import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../Context/SocketContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const UserPage = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [vehicleType, setVehicleType] = useState('car');
    const [nearbyCaptains, setNearbyCaptains] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [rideConfirmed, setRideConfirmed] = useState(false);
    const { socket, emitEvent } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('ride-confirmed', (data) => {
                setIsSearching(false);
                setRideConfirmed(true);
                toast.success(`Ride confirmed! Captain ${data.captain.fullname.firstname} is on the way`);
            });

            return () => {
                socket.off('ride-confirmed');
            };
        }
    }, [socket]);

    const handleCreateRide = async () => {
        try {
            setIsSearching(true);
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides`,
                {
                    pickUp: pickupLocation,
                    dropOff: dropoffLocation,
                    vehicleType: vehicleType
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            toast.success('Searching for nearby drivers...');

        } catch (error) {
            console.error("Error creating ride:", error);
            toast.error(error.response?.data?.message || 'Failed to create ride');
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Request a Ride</h2>
                
                {/* Form Fields */}
                <div className="space-y-4">
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
                </div>

                {/* Search Animation */}
                <AnimatePresence>
                    {isSearching && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                        >
                            <div className="bg-white p-6 rounded-lg text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                                <p className="text-lg font-semibold">Finding your ride...</p>
                                <p className="text-sm text-gray-500">Please wait while we connect you with a driver</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Ride Confirmed View */}
                {rideConfirmed && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-800">Ride Confirmed!</h3>
                        <p className="text-sm text-green-600">Your driver is on the way</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPage; 