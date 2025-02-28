import express from 'express';
import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import { initializeSocket } from './socket.js';

dotenv.config();
const port =  5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is Listening at port ${port}`);
});
