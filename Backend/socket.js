import { Server } from 'socket.io';
import userModel from './models/user.model.js';
import captainModel from './models/captain.model.js';
let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Your frontend URL
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ['websocket', 'polling']
    });

    io.on('connection', (socket) => {
        console.log('New socket connection established:', socket.id);

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
