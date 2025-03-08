import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Bike, Truck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CarInfo = ({
  selectedRide,
  setSelectedRide,
  showCar,
  setshowCar,
  DropOff,
  Pickup,
  setConfirm,
  setSelectedCarDetails
}) => {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const vehicleTypes = [
    {
      id: 'car',
      name: 'Car',
      icon: Car,
      description: 'Comfortable',
      capacity: '4',
    },
    {
      id: 'bike',
      name: 'Bike',
      icon: Bike,
      description: 'Quick',
      capacity: '1',
    },
    {
      id: 'auto',
      name: 'Auto',
      icon: Truck,
      description: 'Economic',
      capacity: '3',
    },
  ];

  useEffect(() => {
    const fetchPrices = async () => {
      if (!Pickup || !DropOff) {
        setError('Please enter pickup and dropoff locations');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
          {
            params: {
              pickUp: Pickup,
              dropOff: DropOff
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data) {
          console.log("Received prices:", response.data);
          setPrices(response.data);
        } else {
          throw new Error('No price data received');
        }
      } catch (err) {
        console.error('Error fetching prices:', err);
        const errorMessage = err.response?.data?.error || 
                            err.response?.data?.details ||
                            'Failed to calculate ride prices';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [Pickup, DropOff]);

  const handleVehicleSelect = (vehicleId) => {
    setSelectedRide(vehicleId);
    // Also set the selected vehicle's price and details
    if (prices) {
      setSelectedCarDetails({
        type: vehicleId,
        price: prices[vehicleId],
        capacity: vehicleTypes.find(v => v.id === vehicleId)?.capacity || '4'
      });
    }
  };

  const handleContinue = () => {
    if (selectedRide && prices) {
      setConfirm(true);
      setshowCar(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6">Select Vehicle Type</h2>

        <div className="space-y-4 mb-6">
          {vehicleTypes.map((vehicle) => {
            const VehicleIcon = vehicle.icon;
            const price = loading ? 'Calculating...' : 
                         error ? 'Unable to calculate' : 
                         prices ? `₹${Math.round(prices[vehicle.id])}` : 'N/A';

            return (
              <motion.div
                key={vehicle.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVehicleSelect(vehicle.id)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer
                  ${selectedRide === vehicle.id ? 
                    'border-primary-500 bg-primary-50' : 
                    'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <VehicleIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{vehicle.name}</h3>
                      <p className="text-sm text-gray-500">
                        {vehicle.description} • {vehicle.capacity} seats
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${loading ? 'text-gray-400' : 'text-primary-600'}`}>
                      {price}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setshowCar(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedRide || loading}
            className={`
              px-6 py-2 rounded-lg font-semibold text-white
              ${selectedRide && !loading ?
                'bg-black hover:bg-gray-800' :
                'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarInfo;