import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import gsap from "gsap";
import Image from "./../assets/image.png"; // Verify this path
import CarInfo from "../Components/CarInfo.jsx"; // Verify this path
import ConfirmRide from "../Components/ConfirmRide.jsx"; // Verify this path
import SearchingDriver from "../Components/SearchingDriver.jsx"; // Verify this path
import { UserDataContext } from "../Context/UserContext.jsx";
import { useSocket } from "../Context/SocketContext";
import { SocketContext } from "../Context/SocketContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Start() {
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const { socket } = useSocket();
  const { userData } = useContext(UserDataContext);
  const { emitEvent, connected } = useSocket();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showCar, setshowCar] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);
  const [searching, setSearching] = useState(false);

  // Ref for debouncing API calls
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on('ride-confirmed', (ride) => {
        setWaitingForDriver(true);
        // Handle ride confirmation
        console.log('Ride confirmed:', ride);
      });

      // Cleanup listener when component unmounts
      return () => {
        socket.off('ride-confirmed');
      };
    }
  }, [socket]);

  // Join socket room when component mounts or when socket connects
  useEffect(() => {
    if (connected && userData?._id) {
      console.log('Attempting to join socket room...', {
        userId: userData._id,
        type: 'user'
      });
      
      emitEvent('join', {
        userId: userData._id,
        type: 'user'
      });
    }
  }, [connected, userData, emitEvent]); // Add connected to dependencies

  // Animate the map container on mount using GSAP
  useEffect(() => {
    gsap.from(".map-container", { opacity: 0, duration: 2, y: -50 });
  }, []);

  // Fetch location suggestions
  const fetchSuggestions = async (query, type) => {
    if (!query.trim()) {
      type === "pickup" ? setPickupSuggestions([]) : setDropoffSuggestions([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/suggestions`,
        {
          params: { input: query },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (type === "pickup") {
        setPickupSuggestions(response.data);
      } else {
        setDropoffSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Handle input changes with debounce
  const handleInputChange = (value, type) => {
    if (type === "pickup") {
      setPickup(value);
      setShowPickupDropdown(true);
    } else {
      setDropoff(value);
      setShowDropoffDropdown(true);
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.length > 2) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(value, type);
      }, 300);
    } else {
      type === "pickup" ? setPickupSuggestions([]) : setDropoffSuggestions([]);
    }
  };

  // Handle location selection
  const handleSelectLocation = (locationDescription, type) => {
    if (type === "pickup") {
      setPickup(locationDescription);
      setShowPickupDropdown(false);
    } else {
      setDropoff(locationDescription);
      setShowDropoffDropdown(false);
    }
  };

  // Debug logs to track state changes
  useEffect(() => {
    console.log("Selected car details updated:", selectedCarDetails);
  }, [selectedCarDetails]);

  const handleShowCar = () => {
    if (!pickup || !dropoff) {
      toast.error("Please enter pickup and drop-off locations");
      return;
    }
    setshowCar(true);
  };

  const openSearching = () => {
    setSearching(true);
    setConfirm(false);
  };

  return (
    <div className="relative z-0">
      {confirm && (
        <ConfirmRide
          Pickup={pickup}
          DropOff={dropoff}
          selectedRide={selectedRide}
          selectedCarDetails={selectedCarDetails}
          setConfirm={setConfirm}
          openSearching={openSearching}
        />
      )}
      
      {showCar && (
        <CarInfo
          selectedRide={selectedRide}
          setSelectedRide={setSelectedRide}
          showCar={showCar}
          setshowCar={setshowCar}
          DropOff={dropoff}
          Pickup={pickup}
          setConfirm={setConfirm}
          setSelectedCarDetails={setSelectedCarDetails}
        />
      )}
      
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex flex-col lg:flex-row justify-between items-start px-8 py-16">
          <div className="max-w-lg w-full space-y-8">
            <h1 className="text-4xl font-bold leading-snug">
              Go anywhere with <span className="text-black">Uber</span>
            </h1>
            <div className="space-y-4">
              {/* Pickup Location Input */}
              <div className="relative">
                <input
                  type="text"
                  value={pickup}
                  placeholder="Pickup location"
                  className="w-full sm:w-72 bg-gray-200 px-8 py-4 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleInputChange(e.target.value, "pickup")}
                />
                {showPickupDropdown && pickupSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1">
                    {pickupSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectLocation(suggestion.description, "pickup")}
                      >
                        {suggestion.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropoff Location Input */}
              <div className="relative">
                <input
                  type="text"
                  value={dropoff}
                  placeholder="Dropoff location"
                  className="w-full sm:w-72 bg-gray-200 px-8 py-4 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleInputChange(e.target.value, "dropoff")}
                />
                {showDropoffDropdown && dropoffSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1">
                    {dropoffSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectLocation(suggestion.description, "dropoff")}
                      >
                        {suggestion.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleShowCar}
              className="flex items-center justify-center w-56 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
            >
              Continue
            </button>
          </div>

          <div className="relative w-full h-[40rem] lg:h-auto">
            <img src={Image} alt="Map" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default Start;