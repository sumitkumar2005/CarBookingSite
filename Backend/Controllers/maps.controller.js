import { getCoordinate, getDistanceTime, getSuggestions as fetchSuggestions } from "../Services/maps.services.js"; // Rename the imported function

export async function getCoordinates(address) {
    try {
        if (!address || typeof address !== "string") {
            throw new Error("Invalid address. Please provide a valid address as a string.");
        }
        const coordinates = await getCoordinate(address);
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
        const distanceTime = await getDistanceTime(origin, destination);
        res.json(distanceTime);
    } catch (error) {
        console.error("Error fetching distance and time:", error.message);
        res.status(500).json({ message: "Failed to fetch distance and time. Please try again." });
    }
}

export async function getSuggestionsController(req, res) { // Rename the controller function
    try {
        const { input } = req.query;
        if (!input || typeof input !== "string") {
            return res.status(400).json({
                message: "Invalid input. Please provide a valid input string.",
            });
        }
        const suggestions = await fetchSuggestions(input); // Use the renamed imported function
        res.json(suggestions);
    } catch (error) {
        console.error("Error fetching suggestions:", error.message);
        res.status(500).json({
            message: "Failed to fetch suggestions. Please try again.",
        });
    }
}
