import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import Image from "./../assets/image.png"; // Verify this path
import CarInfo from "../Components/CarInfo.jsx"; // Verify this path
import ConfirmRide from "../Components/ConfirmRide.jsx"; // Verify this path
import SearchingDriver from "../Components/SearchingDriver.jsx"; // Verify this path

function Start() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [selectedRide, setSelectedRide] = useState("");
  const [showCar, setShowCar] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [price, setPrice] = useState(null);
  const [rides, setRides] = useState([]); // Array to hold ride options
  const [lastConfirm, setLastConfirm] = useState(false);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);

  // Ref for debouncing API calls
  const debounceTimer = useRef(null);

  // Animate the map container on mount using GSAP
  useEffect(() => {
    gsap.from(".map-container", { opacity: 0, duration: 2, y: -50 });
  }, []);

  // Modified fetchPrice function
  useEffect(() => {
    const fetchPrice = async () => {
      if (!pickup || !dropoff) {
        setPrice(null);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/rides/get-fare", {
          params: { pickUp: pickup, dropOff: dropoff },
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        console.log("Fare Response:", response.data);
        
        // Ensure the response data has the expected structure
        if (response.data && typeof response.data === 'object') {
          setPrice(response.data);
        } else {
          console.error("Invalid price data received:", response.data);
          setPrice(null);
        }
      } catch (error) {
        console.error("Error fetching fare:", error);
        setPrice(null);
      }
    };

    // Only fetch price if both pickup and dropoff are set
    if (pickup && dropoff) {
      fetchPrice();
    }
  }, [pickup, dropoff]);

  // Fetch location suggestions from backend
  const fetchSuggestions = async (query, type) => {
    if (!query.trim()) {
      if (type === "pickup") {
        setPickupSuggestions([]);
      } else {
        setDropoffSuggestions([]);
      }
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/maps/get-suggestions", {
        params: { input: query },
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        }
      });
      
      console.log("Raw API Response:", response);
      const suggestions = response.data.suggestions || [];
      console.log("Processed suggestions:", suggestions);

      if (type === "pickup") {
        setPickupSuggestions(suggestions);
        setShowPickupDropdown(true);
      } else {
        setDropoffSuggestions(suggestions);
        setShowDropoffDropdown(true);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error.response || error);
      // Clear suggestions on error
      if (type === "pickup") {
        setPickupSuggestions([]);
      } else {
        setDropoffSuggestions([]);
      }
    }
  };

  // Handle input changes with a debounce of 300ms
  const handleInputChange = (value, type) => {
    if (type === "pickup") {
      setPickup(value);
      setShowPickupDropdown(true);
    } else {
      setDropoff(value);
      setShowDropoffDropdown(true);
    }

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only fetch if value length is greater than 2
    if (value.length > 2) {
      debounceTimer.current = setTimeout(() => {
        console.log(`Fetching suggestions for: ${value}`);
        fetchSuggestions(value, type);
      }, 300);
    } else {
      // Clear suggestions for short inputs
      if (type === "pickup") {
        setPickupSuggestions([]);
      } else {
        setDropoffSuggestions([]);
      }
    }
  };

  // Handle selection from the suggestions dropdown
  const handleSelectLocation = (locationDescription, type) => {
    if (type === "pickup") {
      setPickup(locationDescription);
      setShowPickupDropdown(false);
    } else {
      setDropoff(locationDescription);
      setShowDropoffDropdown(false);
    }
  };

  return (
    <div className="relative z-0">
      {confirm && (
        <ConfirmRide 
          setConfirm={setConfirm} 
          Pickup={pickup} 
          DropOff={dropoff} 
          selectedCar={selectedCarDetails}
          price={price && selectedRide ? price[selectedRide] : null}
        />
      )}
      {lastConfirm && <SearchingDriver setC={setLastConfirm} />}
      
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
              onClick={() => setShowCar(!showCar)}
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

      {showCar && (
        <CarInfo
          selectedRide={selectedRide}
          price={price}
          setPrice={setPrice}
          showCar={showCar}
          setshowCar={setShowCar}
          DropOff={dropoff}
          Pickup={pickup}
          setConfirm={setConfirm}
          setSelectedRide={setSelectedRide}
          setSelectedCarDetails={setSelectedCarDetails}
        />
      )}
    </div>
  );
}

export default Start;
