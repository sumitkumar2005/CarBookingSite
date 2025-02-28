import dotenv from 'dotenv';
dotenv.config();
import connect from './db/db.js';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser'
import captainRoute from './routes/captain.routes.js'
import mapsRoute from './routes/maps.route.js'
import rideRoute from './routes/rides.routes.js'
const app = express();
app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connect();
app.use(cookieParser())
app.get('/', (req, res) => {
    res.send("Server is running");
});

app.use('/users', userRoutes); // Correct route usage

app.use('/captains', captainRoute); // Correct route usage
// Error handling middleware
app.use('/maps',mapsRoute)
app.use('/rides',rideRoute)
app.use((err, req, res, next) => {
    console.error(err.stack);   
    res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
