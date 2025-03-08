import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, User, DollarSign, Clock } from 'lucide-react';

const RideRequestPopup = ({ ride, onAccept, onDecline, isVisible }) => {
  if (!ride) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              New Ride Request
            </h2>

            <div className="space-y-6">
              {/* Customer Details */}
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-primary-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {ride.user?.fullname || 'Customer'}
                  </p>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Pickup Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{ride.pickUp}</p>
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Dropoff Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{ride.dropOff}</p>
                </div>
              </div>

              {/* Fare */}
              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-primary-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Estimated Fare</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ₹{ride.estimatedFare || 'Calculating...'}
                  </p>
                </div>
              </div>

              {/* Timer */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 30 }}
                  className="bg-primary-500 h-2 rounded-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={onDecline}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700
                           hover:bg-gray-50 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={onAccept}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg
                           hover:bg-primary-700 transition-colors"
                >
                  Accept Ride
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RideRequestPopup; 