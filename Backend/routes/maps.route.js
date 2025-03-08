import express from 'express';
import { getCoordinates, getDistanceAndTime,getSuggestionsController } from './../Controllers/maps.controller.js'; // Corrected imports
import authMiddleware from '../middleware/auth.middleware.js';
import { query } from 'express-validator';
import { validationResult } from 'express-validator';
import mapsServices from './../Services/maps.services.js';

const router = express.Router();

// Define the route for getting coordinates
router.get('/', (req, res) => {
    res.send("hello");
});

// Define the route for getting coordinates
router.get(
    '/get-coordinates',
    [
        query('address')
            .isString()
            .withMessage('Address must be a string.')
            .notEmpty()
            .withMessage('Address is required.'),
    ], 
    authMiddleware.authUser,

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { address } = req.query;
            const coordinates = await getCoordinates(address);
            res.status(200).json({ success: true, coordinates });
        } catch (error) {
            console.error('Error fetching coordinates:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch coordinates. Please try again.',
            });
        }
    }
);

// Define the route for getting distance and time between origin and destination
router.get(
    '/get-distance-time',
    [
        query('origin')
            .isString()
            .withMessage('Origin must be a string.')
            .notEmpty()
            .withMessage('Origin is required.'),
        query('destination')
            .isString()
            .withMessage('Destination must be a string.')
            .notEmpty()
            .withMessage('Destination is required.'),
    ],
    authMiddleware.authUser,

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { origin, destination } = req.query;
            const distanceTime = await getDistanceAndTime(req, res);
            res.status(200).json({ success: true, distanceTime });
        } catch (error) {
            console.error('Error fetching distance and time:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch distance and time. Please try again.',
            });
        }
    }
)
router.get('/suggestions', async (req, res) => {
  try {
    const { input } = req.query;
    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }

    const suggestions = await mapsServices.getSuggestions(input);
    res.json(suggestions);
  } catch (error) {
    console.error("Error in suggestions route:", error);
    res.status(500).json({ 
      error: "Failed to fetch suggestions",
      details: error.message 
    });
  }
});
  
 
  
  const apiKey = process.env.MAP_API;
  
  router.get("/get-location", async (req, res) => {
      try {
          const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`);
          res.json(response.data);
      } catch (error) {
          res.status(500).json({ error: "Failed to get location" });
      }
  });
  

  


export default router;
