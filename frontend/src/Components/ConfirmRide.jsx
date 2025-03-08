import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Car, IndianRupee } from "lucide-react"; // Import icons
import { useSocket } from "../Context/SocketContext.jsx";
import { useContext } from "react";
import { UserDataContext } from "../Context/UserContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const ConfirmRide = ({ 
  Pickup, 
  DropOff, 
  selectedRide,
  selectedCarDetails,
  setConfirm, 
  openSearching 
}) => {
  const { socket } = useSocket();
  const { userData } = useContext(UserDataContext);

  const handleConfirmRide = async () => {
    try {
      // Create ride request
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickUp: Pickup,
          dropOff: DropOff,
          vehicleType: selectedRide,
          fare: selectedCarDetails.price
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.ride) {
        // Emit socket event for ride request
        socket.emit('create-ride', {
          rideId: response.data.ride._id,
          userId: userData._id,
          pickUp: Pickup,
          dropOff: DropOff,
          vehicleType: selectedRide,
          fare: selectedCarDetails.price
        });

        toast.success('Looking for nearby drivers...');
        openSearching();
      }
    } catch (error) {
      console.error('Error creating ride:', error);
      toast.error(error.response?.data?.message || 'Failed to create ride');
    }
  };

  // Debug log to check incoming data
  useEffect(() => {
    console.log("ConfirmRide received:", {
      selectedRide,
      selectedCarDetails
    });
  }, [selectedRide, selectedCarDetails]);

  useEffect(() => {
    console.log("ConfirmRide mounted with props:", {
      selectedRide,
      selectedCarDetails,
      currentFare: selectedCarDetails?.price
    });
  }, []);

  // Get the fare from selectedCarDetails
  const currentFare = selectedCarDetails?.price;

  // Function to format price
  const formatPrice = (amount) => {
    console.log("Formatting price amount:", amount);
    if (amount === undefined || amount === null || isNaN(amount)) {
      console.log("Invalid fare amount:", amount);
      return 'N/A';
    }
    return `₹${Math.round(amount).toLocaleString()}`;
  };

  // Function to get formatted vehicle type
  const getVehicleType = (type) => {
    const types = {
      car: 'Car',
      bike: 'Bike',
      auto: 'Auto'
    };
    return types[type] || type?.toUpperCase() || 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-md mx-auto p-6 shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Confirm Your Ride</h2>
          <p className="text-gray-600 mt-2">Please review your ride details</p>
        </div>

        <div className="space-y-6">
          {/* Location Details */}
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Pickup Location</p>
                  <p className="font-medium text-gray-900">{Pickup}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Drop-off Location</p>
                  <p className="font-medium text-gray-900">{DropOff}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ride Details */}
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-gray-700" />
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="font-medium text-gray-900">
                    {getVehicleType(selectedRide)}
                    <span className="text-sm text-gray-500 ml-2">
                      {selectedCarDetails?.capacity} seats
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Fare</p>
                <div className="flex items-center space-x-1">
                  <IndianRupee className="w-4 h-4 text-gray-700" />
                  <p className="font-bold text-xl text-gray-900">
                    {selectedCarDetails?.price ? Math.round(selectedCarDetails.price) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          <button
            onClick={() => setConfirm(false)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 
                     hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Back
          </button>
          <button
            onClick={handleConfirmRide}
            className="flex-1 px-4 py-3 bg-black text-white rounded-xl 
                     hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            Confirm Ride
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmRide;