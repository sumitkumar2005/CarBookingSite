import { Server } from 'socket.io';
import userModel from './models/user.model.js';
import captainModel from './models/captain.model.js';
import jwt from 'jsonwebtoken';

import rideService from './Services/ride.service.js';

const connectedClients = new Map();
const maxConnectionsPerUser = 1;
const connectionThrottle = new Map(); // Track connection attempts

// Declare io as a module-level variable so it can be accessed by all functions
let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",  // Allow all origins (adjust as needed)
            methods: ["GET", "POST"],
            credentials: true
        },
        pingTimeout: 60000,
        connectTimeout: 5000,
        // Add rate limiting
        connectionRateLimit: {
            max: 5, // maximum connections per window
            windowMs: 10000 // 10 seconds
        }
    });

    // Rate limiting middleware
    io.use((socket, next) => {
        const clientIp = socket.handshake.address;
        const now = Date.now();
        const connectionData = connectionThrottle.get(clientIp) || { count: 0, firstAttempt: now };

        // Reset if window has passed
        if (now - connectionData.firstAttempt > 10000) {
            connectionData.count = 0;
            connectionData.firstAttempt = now;
        }

        if (connectionData.count >= 5) {
            return next(new Error('Too many connection attempts. Please try again later.'));
        }

        connectionData.count++;
        connectionThrottle.set(clientIp, connectionData);
        next();
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication failed: No token provided'));
            }

            const decoded = jwt.verify(token, "THIS IS MY SECRET BRO");
            
            // Check for existing connection
            const existingSocket = connectedClients.get(decoded._id);
            if (existingSocket) {
                // Close existing connection before allowing new one
                existingSocket.disconnect(true);
                connectedClients.delete(decoded._id);
                await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
            }

            socket.userId = decoded._id;
            connectedClients.set(decoded._id, socket);
            next();
        } catch (error) {
            console.error('Socket authentication error:', error);
            next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        socket.on('disconnect', () => {
            if (socket.userId) {
                connectedClients.delete(socket.userId);
            }
            console.log('Client disconnected:', socket.id);
        });

        // Handle socket connection
        socket.on('get-captain-nearby', async (long, lat) => {
            try {
                if (!long || !lat) {
                    socket.emit('error', { message: 'Longitude and latitude are required' });
                    return;
                }

                const nearByCaptains = await captainModel.find({
                    location: {
                        $geoWithin: {
                            $centerSphere: [
                                [long, lat],
                                10 / 3963.2 // 10 mile radius, converted to radians
                            ]
                        }
                    }
                });

                // Emit ride request to nearby captains
                nearByCaptains.forEach(captain => {
                    if (captain.socketId) {
                        io.to(captain.socketId).emit('new-ride', {
                            type: 'new-ride-request',
                            data: {
                                pickup: long,
                                dropoff: lat,
                                // Add other relevant ride details
                            }
                        });
                    }
                });

                socket.emit('nearby-captains', {
                    success: true,
                    captains: nearByCaptains
                });

            } catch (error) {
                console.error('Error finding nearby captains:', error);
                socket.emit('error', { 
                    message: 'Failed to find nearby captains',
                    error: error.message 
                });
            }
        });

        socket.on('join', async (data) => {
            console.log('Received join event with data:', data);
            
            try {
                const { userId, type } = data;
                
                if (!userId || !type) {
                    console.error('Invalid join data received:', data);
                    socket.emit('error', { message: 'Invalid join data' });
                    return;
                }

                if (type === 'user') {
                    console.log(`Attempting to update user ${userId} with socket ${socket.id}`);
                    
                    const updatedUser = await userModel.findByIdAndUpdate(
                        userId,
                        { $set: { socketId: socket.id } },
                        { new: true, runValidators: true }
                    );
                    
                    if (updatedUser) {
                        console.log(`Successfully updated user ${userId} with socket ${socket.id}`);
                        socket.join(`user_${userId}`);
                        socket.emit('joined', { 
                            success: true, 
                            type: 'user',
                            socketId: socket.id 
                        });
                    } else {
                        console.error(`User ${userId} not found in database`);
                        socket.emit('error', { message: 'User not found' });
                    }
                } else if (type === 'captain') {
                    console.log(`Attempting to update captain ${userId} with socket ${socket.id}`);
                    
                    const updatedCaptain = await captainModel.findByIdAndUpdate(
                        userId,
                        { 
                            $set: { 
                                socketId: socket.id,
                                status: 'active'  // Update captain status
                            }
                        },
                        { new: true }
                    );
                    
                    if (updatedCaptain) {
                        console.log(`Successfully updated captain ${userId} with socket ${socket.id}`);
                        socket.join(`captain_${userId}`);
                        socket.emit('joined', { 
                            success: true, 
                            type: 'captain',
                            socketId: socket.id,
                            status: updatedCaptain.status
                        });
                    } else {
                        console.error(`Captain ${userId} not found in database`);
                        socket.emit('error', { message: 'Captain not found' });
                    }
                }
            } catch (error) {
                console.error('Error in join event handler:', error);
                socket.emit('error', { message: 'Failed to join' });
            }
        });

        socket.on('disconnect', async () => {
            console.log('Socket disconnected:', socket.id);
            try {
                const [updatedUser, updatedCaptain] = await Promise.all([
                    userModel.findOneAndUpdate(
                        { socketId: socket.id },
                        { $unset: { socketId: "" } },
                        { new: true }
                    ),
                    captainModel.findOneAndUpdate(
                        { socketId: socket.id },
                        { $unset: { socketId: "" } },
                        { new: true }
                    )
                ]);

                if (updatedUser) {
                    console.log(`Cleared socketId for user ${updatedUser._id}`);
                }
                if (updatedCaptain) {
                    console.log(`Cleared socketId for captain ${updatedCaptain._id}`);
                }
            } catch (error) {
                console.error('Error cleaning up disconnected socket:', error);
            }
        });

        // Update the captain location handler
        socket.on('captain_location_update', async (data) => {
            try {
                const { location, captainId, timestamp } = data;

                if (!location || !location.lat || !location.long) {
                    socket.emit('error', { message: 'Invalid location data. Must include lat and long.' });
                    return;
                }

                console.log("Received location update:", JSON.stringify(location));

                const updatedCaptain = await captainModel.findByIdAndUpdate(
                    captainId,
                    {
                        $set: {
                            'currentLocation.lat': location.lat,
                            'currentLocation.long': location.long,
                            lastLocationUpdate: timestamp || new Date(),
                            socketId: socket.id
                        }
                    },
                    { new: true }
                );

                console.log("Updated captain location:", JSON.stringify(updatedCaptain.currentLocation));

                if (updatedCaptain) {
                    socket.emit('location_updated', {
                        success: true,
                        location: updatedCaptain.currentLocation,
                        timestamp: updatedCaptain.lastLocationUpdate
                    });

                    // Broadcast to nearby users if captain is available
                    if (updatedCaptain.isAvailable) {
                        socket.broadcast.emit('captain_location_broadcast', {
                            captainId: updatedCaptain._id,
                            location: updatedCaptain.currentLocation
                        });
                    }
                }
            } catch (error) {
                console.error('Error updating captain location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        // Update the captain availability handler
        socket.on('captain_available', async (data) => {
            try {
                const { captainId, location, isAvailable } = data;
                const updateData = {
                    isAvailable,
                    socketId: socket.id
                };

                if (location && isAvailable) {
                    updateData.currentLocation = location;
                    updateData.lastLocationUpdate = new Date();
                }

                const updatedCaptain = await captainModel.findByIdAndUpdate(
                    captainId,
                    { $set: updateData },
                    { new: true }
                );

                if (updatedCaptain) {
                    socket.emit('captain_status_update', {
                        success: true,
                        isAvailable: updatedCaptain.isAvailable
                    });

                    // Broadcast availability change to nearby users
                    socket.broadcast.emit('captain_availability_changed', {
                        captainId: updatedCaptain._id,
                        isAvailable: updatedCaptain.isAvailable,
                        location: updatedCaptain.currentLocation
                    });
                }
            } catch (error) {
                console.error('Error updating captain availability:', error);
                socket.emit('error', { message: 'Failed to update availability' });
            }
        });

        socket.on('create-ride', async (data) => {
            try {
                console.log('Ride creation request received:', data);
                const { rideId, userId, pickUp, dropOff, vehicleType, fare } = data;
                
                if (!rideId || !userId) {
                    socket.emit('error', { message: 'Invalid ride data' });
                    return;
                }
                
                // Find nearby captains to notify about the ride
                const pickupCoordinates = await mapsServices.getCoordinate(pickUp);
                if (!pickupCoordinates) {
                    socket.emit('error', { message: 'Could not determine pickup coordinates' });
                    return;
                }
                
                const nearByCaptains = await mapsServices.getNearByCaptains(
                    pickupCoordinates.lat,
                    pickupCoordinates.long,
                    5, // 5 mile radius
                    false // Normal mode
                );
                
                console.log(`Found ${nearByCaptains.length} captains in radius for ride ${rideId}`);
                
                // Notify each nearby captain
                nearByCaptains.forEach(captain => {
                    if (captain.socketId) {
                        io.to(captain.socketId).emit('ride-request', {
                            event: 'ride-request',
                            data: {
                                rideId,
                                pickUp,
                                dropOff,
                                vehicleType,
                                fare
                            }
                        });
                    }
                });
                
                socket.emit('ride-created', {
                    success: true,
                    rideId,
                    captainsNotified: nearByCaptains.length
                });
                
            } catch (error) {
                console.error('Error handling ride creation:', error);
                socket.emit('error', { 
                    message: 'Failed to process ride creation',
                    error: error.message
                });
            }
        });

        socket.on('ride-response', async (data) => {
            try {
                const { rideId, captainId, response } = data;
                
                if (response === 'accept') {
                    const ride = await rideService.confirmRide(rideId, captainId);
                    
                    // Notify the user
                    if (ride.user.socketId) {
                        io.to(ride.user.socketId).emit('ride-confirmed', {
                            ride,
                            captain: ride.captain
                        });
                    }
                    
                    // Notify other captains that the ride is no longer available
                    socket.broadcast.emit('ride-taken', { rideId });
                }
            } catch (error) {
                console.error('Error handling ride response:', error);
                socket.emit('error', { message: error.message });
            }
        });
    });

    // Set up interval to update captain location
    setInterval(async () => {
        try {
            const captains = await captainModel.find({ socketId: { $exists: true, $ne: "" } });
            for (const captain of captains) {
                if (captain.socketId && captain.currentLocation) {
                    io.emit('update-location-captain', {
                        captainId: captain._id,
                        location: captain.currentLocation
                    });
                }
            }
        } catch (error) {
            console.error('Error sending captain location updates:', error);
        }
    }, 10000); // Update every 10 seconds

    // Clean up connections periodically
    setInterval(() => {
        connectedClients.forEach((socket, userId) => {
            if (!socket.connected) {
                connectedClients.delete(userId);
            }
        });
        
        // Clean up throttle data
        const now = Date.now();
        connectionThrottle.forEach((data, ip) => {
            if (now - data.firstAttempt > 10000) {
                connectionThrottle.delete(ip);
            }
        });
    }, 30000);

    return io;
};

export const sendMessageToSocketId = (socketId, event, data) => {
    if (!io) {
        console.error('Socket.io not initialized');
        return false;
    }
    
    try {
        // Check if the socket is connected
        const socket = io.sockets.sockets.get(socketId);
        if (!socket) {
            console.log(`Socket ${socketId} not connected`);
            return false;
        }
        
        // Emit the event to the specific socket
        io.to(socketId).emit(event, data);
        console.log(`Message sent to socket ${socketId} with event: ${event}`);
        return true;
    } catch (error) {
        console.error('Error sending message to socket:', error);
        return false;
    }
};

// Export a function to get the io instance
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};