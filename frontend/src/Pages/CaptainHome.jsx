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
  User
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RideRequestPopup from '../components/RideRequestPopup';
import { toast } from 'react-hot-toast';

const CaptainHome = () => {
  const navigate = useNavigate();
  const { captainData, setCaptainData } = useContext(CaptainDataContext);
  const { socket, emitEvent, connected } = useSocket();
  
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
  const [currentRideRequest, setCurrentRideRequest] = useState(null);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [acceptedRide, setAcceptedRide] = useState(null);

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

  // Toggle online status with location check
  const toggleOnlineStatus = async () => {
    if (!isOnline) {
      // Request location permission when going online
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const newLocation = {
          lat: position.coords.latitude,
          long: position.coords.longitude
        };
        setCurrentLocation(newLocation);
        setIsOnline(true);
        
        emitEvent('captain_available', {
          captainId: captainData?._id,
          location: newLocation,
          isAvailable: true
        });
        
        toast.success('You are now online and available for rides');
      } catch (error) {
        toast.error('Location access is required to go online');
        return;
      }
    } else {
      setIsOnline(false);
      emitEvent('captain_available', {
        captainId: captainData?._id,
        isAvailable: false
      });
      toast.success('You are now offline');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle ride acceptance
  const handleAcceptRide = async () => {
    try {
      if (!currentRideRequest) return;

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        { rideId: currentRideRequest._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setAcceptedRide(response.data);
      setShowRideRequest(false);
      toast.success('Ride accepted successfully!');
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalRides: (parseInt(prev.totalRides) + 1).toString()
      }));
    } catch (error) {
      console.error('Error accepting ride:', error);
      toast.error('Failed to accept ride');
    }
  };

  // Handle ride decline
  const handleDeclineRide = () => {
    if (currentRideRequest) {
      emitEvent('ride-declined', { rideId: currentRideRequest._id });
      setShowRideRequest(false);
      setCurrentRideRequest(null);
    }
  };

  // Load captain data
  useEffect(() => {
    const loadCaptainData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/CaptainLogin');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setCaptainData(response.data);
      } catch (error) {
        console.error('Error loading captain data:', error);
        toast.error('Failed to load profile');
        navigate('/CaptainLogin');
      } finally {
        setIsLoading(false);
      }
    };

    loadCaptainData();
  }, [setCaptainData, navigate]);

  // Handle socket connections and ride requests
  useEffect(() => {
    if (socket && captainData?._id) {
      socket.on("ride-request", (data) => {
        console.log("Received ride request:", data);
        setCurrentRideRequest(data.data);
        setShowRideRequest(true);
        toast.success('New ride request received!');
      });

      socket.on("ride-cancelled", () => {
        setShowRideRequest(false);
        setCurrentRideRequest(null);
        toast.info('Ride was cancelled by user');
      });

      return () => {
        socket.off("ride-request");
        socket.off("ride-cancelled");
      };
    }
  }, [socket, captainData]);

  // Location tracking
  useEffect(() => {
    if (isOnline) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            long: position.coords.longitude
          };
          setCurrentLocation(newLocation);
          
          if (socket?.connected && captainData?._id) {
            emitEvent('captain_location_update', {
              captainId: captainData._id,
              location: newLocation
            });
          }
        },
        (error) => {
          console.error('Location error:', error);
          setLocationError('Unable to access location');
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isOnline, socket, captainData, emitEvent]);

  // Stats Card Component
  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className={`bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  // Render loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-900">
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {captainData?.fullname?.firstname}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {connected ? 'Connected to service' : 'Connecting...'}
            </p>
          </div>
          
          <button
            onClick={toggleOnlineStatus}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all duration-300
              flex items-center space-x-2
              ${isOnline 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
            `}
          >
            <Power className="w-5 h-5" />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="visible"
        >
          <StatCard
            icon={Clock}
            title="Hours Online"
            value={stats.hoursOnline}
            color="bg-blue-500"
          />
          <StatCard
            icon={Car}
            title="Total Rides"
            value={stats.totalRides}
            color="bg-green-500"
          />
          <StatCard
            icon={DollarSign}
            title="Total Earnings"
            value={`₹${stats.earnings}`}
            color="bg-yellow-500"
          />
          <StatCard
            icon={Activity}
            title="Rating"
            value={stats.rating}
            color="bg-purple-500"
          />
        </motion.div>

        {/* Location Status */}
        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-red-500" />
              <p className="text-red-700">{locationError}</p>
            </div>
          </div>
        )}

        {/* Current Ride Section */}
        {acceptedRide && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Current Ride</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Passenger</p>
                    <p className="font-medium">{acceptedRide.user?.fullname?.firstname}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="font-medium">{acceptedRide.pickUp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Navigation className="text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Dropoff</p>
                    <p className="font-medium">{acceptedRide.dropOff}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">Fare</p>
                    <p className="font-medium">₹{acceptedRide.fare}</p>
                  </div>
                </div>
                {/* Add more ride details as needed */}
              </div>
            </div>
          </motion.div>
        )}

        {/* Ride Request Popup */}
        <RideRequestPopup
          ride={currentRideRequest}
          onAccept={handleAcceptRide}
          onDecline={handleDeclineRide}
          isVisible={showRideRequest}
          setIsVisible={setShowRideRequest}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
