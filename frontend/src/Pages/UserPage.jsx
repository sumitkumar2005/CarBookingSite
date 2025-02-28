import React, { useState } from 'react';
import axios from 'axios';

const UserPage = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [vehicleType, setVehicleType] = useState('car');
    const [nearbyCaptains, setNearbyCaptains] = useState([]);

    const handleCreateRide = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides`, // Assuming your ride creation endpoint is /rides
                {
                    pickUp: pickupLocation,
                    dropOff: dropoffLocation,
                    vehicleType: vehicleType
                }
            );

            console.log("Ride created successfully", response.data);
            setNearbyCaptains(response.data.nearbyCaptains); // Access nearbyCaptains from response

        } catch (error) {
            console.error("Error creating ride", error);
            // Handle error appropriately
        }
    };

    return (
        <div>
            <h2>Request a Ride</h2>
            <div>
                <label>Pickup Location:</label>
                <input type="text" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
            </div>
            <div>
                <label>Dropoff Location:</label>
                <input type="text" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} />
            </div>
            <div>
                <label>Vehicle Type:</label>
                <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="auto">Auto</option>
                </select>
            </div>
            <button onClick={handleCreateRide}>Request Ride</button>

            {/* Display Nearby Captains */}
            {nearbyCaptains.length > 0 && (
                <div>
                    <h3>Nearby Captains:</h3>
                    <ul>
                        {nearbyCaptains.map((captain) => (
                            <li key={captain._id}>
                                <p><strong>Name:</strong> {captain.fullname.firstname} {captain.fullname.lastname}</p>
                                <p><strong>Vehicle Type:</strong> {captain.vehicle.vehicleType}</p>
                                <p><strong>Vehicle Plate:</strong> {captain.vehicle.plate}</p>
                                {/* Display other captain details as needed */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
             {nearbyCaptains.length === 0 && pickupLocation && (
                <div>
                    <p>No captains found nearby for pickup location: {pickupLocation}</p>
                </div>
            )}
        </div>
    );
};

export default UserPage; 