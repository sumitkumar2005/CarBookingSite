import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const UserLocation = () => {
  const [location, setLocation] = useState(null);
  const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_API_KEY";

  useEffect(() => {
    axios.get("http://localhost:5000/maps/get-location")
      .then(response => {
        const { lat, lng } = response.data.location;
        setLocation({ lat, lng });
      })
      .catch(error => console.error("Error fetching location:", error));
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Your Current Location</h1>
      {location ? (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={14}>
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default serLocation;
