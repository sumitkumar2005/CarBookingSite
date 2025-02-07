import mapsServices from "../Services/maps.services.js"; // Ensure consistent naming

export async function getCoordinates(address) {
  try {
    if (!address || typeof address !== "string") {
      throw new Error("Invalid address. Please provide a valid address as a string.");
    }
    const coordinates = await mapsServices.getCoordinate(address);
    console.log("Coordinates fetched successfully:", coordinates);
    return coordinates;
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw new Error("Failed to fetch coordinates. Please try again.");
  }
}

export async function getDistanceAndTime(req, res) {
  try {
    const { origin, destination } = req.query;
    const distanceTime = await mapsServices.getDistanceTime(origin, destination);
    res.json(distanceTime);
  } catch (error) {
    console.error("Error fetching distance and time:", error.message);
    res.status(500).json({ message: "Failed to fetch distance and time. Please try again." });
  }
}

export async function getSuggestionsController(req, res) {
  try {
    const { input } = req.query;
    console.log("Controller extracted input:", input);
    
    // Fetch the suggestions (an array of suggestion objects)
    const suggestions = await mapsServices.getSuggestions(input);
    
    // Return the full suggestions array in the response.
    // This sends an object with a "success" flag and the suggestions array.
    return res.status(200).json({ success: true, suggestions });
  } catch (error) {
    console.error('Error fetching suggestions in controller:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch suggestions.' });
  }
}
