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
  const [lastConfirm, setLastConfirm] = useState(false);

  // Ref for debouncing the API calls
  const debounceTimer = useRef(null);

  // Animate the map container on mount using GSAP
  useEffect(() => {
    gsap.from(".map-container", { opacity: 0, duration: 2, y: -50 });
  }, []);

  // Fetch price from backend when both pickup and dropoff are set
  useEffect(() => {
    const fetchPrice = async () => {
      if (!pickup || !dropoff) return;
      try {
        const response = await axios.get("http://localhost:5000/maps/get-fare", {
          params: { pickUp: pickup, dropOff: dropoff },
        });
        setPrice(response.data); // Adjust based on your API response
      } catch (error) {
        console.error("Error fetching fare:", error);
      }
    };

    fetchPrice();
  }, [pickup, dropoff]);

  // Fetch location suggestions from backend
  const fetchSuggestions = async (query, type) => {
    if (!query.trim()) {
      // Clear suggestions if the input is empty
      if (type === "pickup") {
        setPickupSuggestions([]);
      } else {
        setDropoffSuggestions([]);
      }
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/maps/get-suggestions", {
        params: { input: query },
      });

      // Log the response for debugging purposes
      console.log("Response from suggestions API:", response.data);

      // Assuming the API returns an object like: { success: true, suggestions: [ ... ] }
      const suggestions = response.data.suggestions || [];

      if (type === "pickup") {
        setPickupSuggestions(suggestions);
      } else {
        setDropoffSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
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

    // Clear any existing timer before setting a new one
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value, type);
    }, 300);
  };

  // Handle selection from the suggestion dropdown
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
      {confirm && <ConfirmRide setConfirm={setConfirm} Pickup={pickup} DropOff={dropoff} />}
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
                {showPickupDropdown && (
                  <ul className="absolute z-10 w-full bg-white border rounded-md mt-2 shadow-lg max-h-64 overflow-y-auto">
                    {pickupSuggestions.length > 0 ? (
                      pickupSuggestions.map((option, index) => (
                        <li
                          key={option.placeId || index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectLocation(option.description, "pickup")}
                        >
                          {option.description}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">No suggestions found</li>
                    )}
                  </ul>
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
                {showDropoffDropdown && (
                  <ul className="absolute z-10 w-full bg-white border rounded-md mt-2 shadow-lg max-h-64 overflow-y-auto">
                    {dropoffSuggestions.length > 0 ? (
                      dropoffSuggestions.map((option, index) => (
                        <li
                          key={option.placeId || index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectLocation(option.description, "dropoff")}
                        >
                          {option.description}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">No suggestions found</li>
                    )}
                  </ul>
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

          {/* Car Info Section */}
          <div className="relative w-full h-[40rem] lg:h-auto">
            {confirm && (
              <ConfirmRide
                setConfirm={setConfirm}
                Pickup={pickup}
                DropOff={dropoff}
                setLastConfirm={setLastConfirm}
                LastConfirm={lastConfirm}
              />
            )}
            <CarInfo
              selectedRide={selectedRide}
              price={price} // Pass fetched price
              setPrice={setPrice}
              showCar={showCar}
              setshowCar={setShowCar}
              DropOff={dropoff}
              Pickup={pickup}
              setConfirm={setConfirm}
            />
            <img src={Image} alt="Map" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Start;
