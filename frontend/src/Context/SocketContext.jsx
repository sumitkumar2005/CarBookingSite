import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { UserDataContext } from './UserContext';
import { CaptainDataContext } from './CaptainContext';

export const SocketContext = createContext();

function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const { userData } = useContext(UserDataContext);
    const { captainData } = useContext(CaptainDataContext);

    // Initialize socket connection
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const newSocket = io(import.meta.env.VITE_BASE_URL, {
            auth: {
                token
            },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5
        });

        // Set up connection event handlers
        newSocket.on('connect', () => {
            console.log('Socket Connected! Socket ID:', newSocket.id);
            setConnected(true);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setConnected(false);
            // Exponential backoff reconnection
            const reconnectionDelay = Math.min(30000, (2 ** newSocket.reconnectionAttempts) * 1000); // max delay 30s
            console.log(`Attempting reconnection in ${reconnectionDelay/1000} seconds`);
            setTimeout(() => {
                newSocket.connect();
            }, reconnectionDelay);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setConnected(false);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            if (newSocket) {
                console.log('Cleaning up socket connection');
                newSocket.disconnect();
            }
        };
    }, []);

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
                    // Use a better notification method than alert, e.g., state to show error message
                    console.log('Authentication failed, redirecting to login');
                    window.location.href = '/captain/login'; // Or use navigate if available in context
                }
            });

            socket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                // Handle reconnection if needed
                if (reason === 'io server disconnect') {
                    // Server disconnected the socket
                    socket.connect();
                }
            });

            return () => {
                socket.off('error');
                socket.off('disconnect');
            };
        }
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
        connected
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

// Custom hook for using socket context
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export default SocketProvider; 