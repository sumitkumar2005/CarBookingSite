import dotenv from "dotenv";
import axios from "axios";
import Captain from '../models/captain.model.js'; // Import the Captain model

dotenv.config(); // Load the .env file

// Fetch the coordinates for the given address
async function getCoordinate(address) {
  try {
    const apiKey = process.env.MAP_API; // Load API key from environment variables
    if (!apiKey) {
      throw new Error("Google Maps API key is not defined in environment variables.");
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await axios.get(url);
    if (response.data.status === "OK" && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        long: location.lng,
      };
    } else {
      throw new Error(`Error fetching geocoding data: ${response.data.status}`);
    }
  } catch (error) {
    console.error("Error in getCoordinate:", error.message);
    throw new Error("Unable to fetch geocoding data. Please try again later.");
  }
}

// Fetch the distance and time between origin and destination
async function getDistanceTime(origin, destination) {
  if (!origin || !destination) {
    throw new Error("Origin and Destination are required");
  }

  const apiKey = process.env.MAP_API; // Load API key from environment variables
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const element = response.data.rows[0].elements[0];
      if (element.status === "OK") {
        return {
          distance: element.distance.text,  // Distance in human-readable format
          duration: element.duration.text,  // Duration in human-readable format
        };
      } else {
        throw new Error(`Error calculating distance: ${element.status}`);
      }
    } else {
      throw new Error(`Error fetching distance data: ${response.data.status}`);
    }
  } catch (error) {
    console.error("Error in getDistanceTime:", error.message);
    throw new Error("Unable to fetch distance and time data. Please try again later.");
  }
}

// Fetch suggestions for a given input
async function getSuggestions(input) {
  console.log("Input has reached services: " + input);
  try {
    // You can also store the API key in an environment variable if desired.
    const apiKey = "AIzaSyCQFiCyNnhHEiBglJ_uBNAf3cG3p5a4njA";
    if (!apiKey) {
      throw new Error("Google Maps API key is not defined in environment variables.");
    }

    if (!input || input.trim() === "") {
      throw new Error("Input is required for fetching suggestions.");
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&key=${apiKey}&types=geocode`;

    const response = await axios.get(url);
    if (response.data.status === "OK" && response.data.predictions.length > 0) {
      // Map the results into a list of suggestions
      const suggestions = response.data.predictions.map((place) => ({
        description: place.description,
        placeId: place.place_id,
      }));
    
      return suggestions;
    } else {
      throw new Error(`Error fetching suggestions: ${response.data.status}`);
    }
  } catch (error) {
    console.error("Error in getSuggestions:", error.message);
    throw new Error("Unable to fetch suggestions. Please try again later.");
  }
}

async function getNearByCaptains(lat, long, radius) {
  try {
    console.log(`Searching for captains near lat: ${lat}, long: ${long}, radius: ${radius} miles`);
    
    // Find all available captains
    const allCaptains = await Captain.find({ 
      isAvailable: true,
      'currentLocation.lat': { $exists: true },
      'currentLocation.long': { $exists: true }
    });
    
    console.log(`Found ${allCaptains.length} available captains total`);
    
    // Filter by distance manually
    const nearbyCaptains = allCaptains.filter(captain => {
      const capLat = captain.currentLocation.lat;
      const capLong = captain.currentLocation.long;
      
      if (!capLat || !capLong) return false;
      
      // Calculate distance using Haversine formula
      const R = 3963.2; // Earth radius in miles
      const dLat = (capLat - lat) * Math.PI / 180;
      const dLon = (capLong - long) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat * Math.PI / 180) * Math.cos(capLat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      // Log the distance for debugging
      console.log(`Captain ${captain._id}: distance = ${distance.toFixed(2)} miles (from ${capLat},${capLong} to ${lat},${long})`);
      
      return distance <= radius;
    });
    
    console.log(`Found ${nearbyCaptains.length} captains within ${radius} miles`);
    
    return nearbyCaptains;
  } catch (error) {
    console.error("Error finding nearby captains:", error);
    return [];
  }
}

export default { getCoordinate, getSuggestions, getDistanceTime, getNearByCaptains };
