import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { UserDataContext } from './UserContext';
import { CaptainDataContext } from './CaptainContext';
import { toast } from 'react-hot-toast';

export const SocketContext = createContext();

function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const { userData } = useContext(UserDataContext);
    const [rides, setRides] = useState([]);
    const { captainData } = useContext(CaptainDataContext);
    
    // Add connection attempt tracking
    const connectionAttempts = useRef(0);
    const RECONNECT_ATTEMPTS = 3;
    const BASE_DELAY = 2000;
    const MAX_DELAY = 10000;
    const reconnectDelay = useRef(1000); // Start with 1 second

    // Initialize socket connection
    useEffect(() => {
        const initializeSocket = () => {
            if (connectionAttempts.current >= RECONNECT_ATTEMPTS) {
                toast.error('Unable to establish connection. Please refresh the page.');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication token not found');
                return;
            }

            const newSocket = io(import.meta.env.VITE_BASE_URL, {
                auth: { token },
                transports: ['websocket'],
                reconnection: false,
                timeout: 5000,
                forceNew: true,
                reconnectionAttempts: RECONNECT_ATTEMPTS,
                reconnectionDelay: BASE_DELAY,
                reconnectionDelayMax: MAX_DELAY
            });

            newSocket.on('connect', () => {
                console.log('Socket Connected! Socket ID:', newSocket.id);
                setConnected(true);
                connectionAttempts.current = 0; // Reset attempts on successful connection
                reconnectDelay.current = 1000; // Reset delay
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setConnected(false);
                connectionAttempts.current++;

                if (error.message.includes('Authentication failed')) {
                    toast.error('Authentication failed. Please login again.');
                    localStorage.removeItem('token'); // Clear invalid token
                    window.location.href = '/login'; // Redirect to login
                    return;
                }

                if (connectionAttempts.current < RECONNECT_ATTEMPTS) {
                    console.log(`Attempt ${connectionAttempts.current} of ${RECONNECT_ATTEMPTS}`);
                    setTimeout(initializeSocket, reconnectDelay.current);
                    reconnectDelay.current = Math.min(reconnectDelay.current * 2, MAX_DELAY);
                } else {
                    toast.error('Connection failed. Please refresh the page.');
                }
            });

            newSocket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setConnected(false);
                
                // Only attempt reconnect for certain disconnect reasons
                if (reason === 'io server disconnect' || reason === 'transport close') {
                    connectionAttempts.current++;
                    if (connectionAttempts.current < RECONNECT_ATTEMPTS) {
                        setTimeout(initializeSocket, reconnectDelay.current);
                    }
                }
            });

            setSocket(newSocket);

            // Cleanup function
            return () => {
                if (newSocket) {
                    newSocket.off('connect');
                    newSocket.off('connect_error');
                    newSocket.off('disconnect');
                    newSocket.close();
                }
            };
        };

        initializeSocket();
    }, [userData?._id, captainData?._id]); // Only reinitialize on user/captain ID change

    // Listen for ride requests
    useEffect(() => {
        if (socket && connected) {
            socket.on("ride-request", (rideData) => {
                console.log("Ride request received:", rideData);
                setRides(prev => [...prev, rideData]);
            });
        }

        return () => {
            if (socket) {
                socket.off("ride-request");
            }
        };
    }, [socket, connected]);

    // Listen for ride updates
    useEffect(() => {
        if (socket && connected) {
            socket.on('ride-update', (updateData) => {
                console.log('Ride update received:', updateData);
                setRides(prev => prev.map(ride => 
                    ride._id === updateData._id ? { ...ride, ...updateData } : ride
                ));
            });
        }

        return () => {
            if (socket) {
                socket.off('ride-update');
            }
        };
    }, [socket, connected]);

    // Handle user/captain join when they become available
    useEffect(() => {
        if (socket && connected) {
            if (userData?._id) {
                console.log('Emitting join event for user:', userData._id);
                socket.emit('join', { userId: userData._id, type: 'user' });
            } else if (captainData?._id) {
                console.log('Emitting join event for captain:', captainData._id);
                socket.emit('join', { userId: captainData._id, type: 'captain' });
            }
        }
    }, [socket, connected, userData?._id, captainData?._id]);

    // Add error event handler
    useEffect(() => {
        if (socket) {
            socket.on('error', (error) => {
                console.error('Socket error:', error);
                if (error.message === 'Authentication failed') {
                    console.log('Authentication failed, redirecting to login');
                    window.location.href = '/CaptainLogin';
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('error');
            }
        };
    }, [socket]);

    // Function to emit events
    const emitEvent = (eventName, data) => {
        if (socket?.connected) {
            console.log(`Emitting event: ${eventName}`, data);
            socket.emit(eventName, data);
        } else {
            console.error('Socket not connected. Cannot emit event:', eventName);
        }
    };

    // Function to listen for events
    const onEvent = (eventName, callback) => {
        if (socket) {
            console.log(`Setting up listener for event: ${eventName}`);
            socket.on(eventName, callback);
            return () => socket.off(eventName);
        }
        return () => {};
    };

    const value = {
        socket,
        emitEvent,
        onEvent,
        connected,
        rides,
        handleRideResponse: (rideId, response) => {
            if (socket?.connected) {
                socket.emit('ride-response', {
                    rideId,
                    captainId: captainData?._id,
                    response
                });
            }
        }
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export default SocketProvider; 