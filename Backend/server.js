import express from 'express';
import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import { initializeSocket } from './socket.js';

dotenv.config();
const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with connection limits
const io = initializeSocket(server);

// Add error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Add graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

server.listen(port, () => {
  console.log(`Server is Listening at port ${port}`);
});
