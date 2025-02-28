import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaptainDataContext } from "../Context/CaptainContext";
import { useSocket } from "../Context/SocketContext";
import Navbar from "../components/Navbar";
import {
  MapPin,
  Car,
  Clock,
  DollarSign,
  Navigation,
  Activity,
  Shield,
  Power,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainHome = () => {
  const navigate = useNavigate();
  const { captainData, setCaptainData } = useContext(CaptainDataContext);
  const { emitEvent, connected } = useSocket();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    hoursOnline: '0',
    totalRides: '0',
    earnings: '0',
    rating: '4.8'
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Load captain data
  useEffect(() => {
    const loadCaptainData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        if (!captainData?._id) {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/captains/profile`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setCaptainData(response.data);
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadCaptainData();
  }, [setCaptainData]);

  // Request location access
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support location services');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          long: position.coords.longitude
        };
        setCurrentLocation(location);
        setLocationError(null);

        if (connected && isOnline && captainData?._id) {
          emitEvent('captain_location_update', {
            location,
            captainId: captainData._id
          });
        }
      },
      (error) => {
        console.error('Location error:', error);
        setLocationError('Please enable location services to go online');
      }
    );
  };

  // Toggle online status
  const toggleOnlineStatus = async () => {
    if (!currentLocation) {
      await requestLocation();
      return;
    }

    setIsOnline(!isOnline);
    if (connected && captainData?._id) {
      emitEvent('captain_available', {
        captainId: captainData._id,
        isAvailable: !isOnline,
        location: currentLocation
      });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 bg-white dark:bg-dark-800 rounded-xl shadow-xl"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-600">{error}</h2>
          <button
            onClick={() => navigate('/captain/login')}
            className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Return to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Navbar */}
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main Content */}
      <div className="pt-16 bg-gray-50 dark:bg-dark-900 min-h-screen">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {/* Header Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome, {captainData?.fullname?.firstname || 'Captain'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Status: <span className={`font-semibold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleOnlineStatus}
                className={`flex items-center px-6 py-3 rounded-lg text-white transition-colors ${
                  isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                <Power className="w-5 h-5 mr-2" />
                {isOnline ? 'Go Offline' : 'Go Online'}
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              { icon: Clock, label: 'Hours Online', value: stats.hoursOnline, color: 'blue' },
              { icon: Car, label: 'Total Rides', value: stats.totalRides, color: 'green' },
              { icon: DollarSign, label: 'Today\'s Earnings', value: `₹${stats.earnings}`, color: 'yellow' },
              { icon: Activity, label: 'Rating', value: stats.rating, color: 'purple' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Vehicle Info */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4">
                <Car className="w-6 h-6 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{captainData?.vehicle?.vehicleType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Shield className="w-6 h-6 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Plate Number</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{captainData?.vehicle?.plate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Navigation className="w-6 h-6 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-green-500">Available for Rides</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Location Warning */}
          <AnimatePresence>
            {locationError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-lg"
              >
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-yellow-400 mr-3" />
                  <div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">{locationError}</p>
                    <button
                      onClick={requestLocation}
                      className="mt-2 text-sm text-yellow-700 dark:text-yellow-200 underline hover:text-yellow-600"
                    >
                      Enable Location
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default CaptainHome;
