import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Car } from 'lucide-react';
import PlacesAutocomplete from './PlacesAutocomplete';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    vehicleType: 'car'
  });

  const vehicleTypes = [
    { id: 'car', name: 'Car', icon: '🚗', price: '₹15/km' },
    { id: 'auto', name: 'Auto', icon: '🛺', price: '₹12/km' },
    { id: 'bike', name: 'Bike', icon: '🏍️', price: '₹8/km' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Your booking logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-dark-800 rounded-2xl shadow-xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Book Your Ride</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pickup Location */}
        <div className="space-y-2">
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <MapPin className="w-5 h-5 mr-2 text-primary-500" />
            Pickup Location
          </label>
          <PlacesAutocomplete
            value={formData.pickup}
            onChange={(value) => setFormData({ ...formData, pickup: value })}
            placeholder="Enter pickup location"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Dropoff Location */}
        <div className="space-y-2">
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <MapPin className="w-5 h-5 mr-2 text-primary-500" />
            Dropoff Location
          </label>
          <PlacesAutocomplete
            value={formData.dropoff}
            onChange={(value) => setFormData({ ...formData, dropoff: value })}
            placeholder="Enter destination"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Vehicle Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicleTypes.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData({ ...formData, vehicleType: vehicle.id })}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-colors
                ${formData.vehicleType === vehicle.id 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 hover:border-primary-200'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl mr-2">{vehicle.icon}</span>
                  <span className="font-medium">{vehicle.name}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{vehicle.price}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold 
                   text-lg shadow-lg hover:bg-primary-700 transition-colors duration-300"
        >
          Book Now
        </motion.button>
      </form>
    </motion.div>
  );
};

export default BookingForm; 