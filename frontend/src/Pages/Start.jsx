import React, { useState, useEffect } from "react";
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
  const [showCar, setshowCar] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [price, setPrice] = useState("");
  const [lastConfirm, setLastConfirm] = useState(false);
 
  useEffect(() => {
    gsap.from(".map-container", { opacity: 0, duration: 2, y: -50 });
  }, []);

  // Fetch location suggestions from the backend
  
  const fetchPrice = async ()=>{
    try{
      const response = await axious.get("http://localhost:5000/maps/get-fare")
      setPrice(response.data)

    }
    catch(error)
    {
      console.error(error);
    }
  }
  const fetchSuggestions = async (query, type) => {
    if (!query.trim()) {
      if (type === "pickup") setPickupSuggestions([]);
      else setDropoffSuggestions([]);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/maps/get-suggestions", {
        params: { input: query }, 
      });

      // Extract descriptions
      const suggestions = response.data.map((item) => ({
        description: item.description,
        placeId: item.placeId,
      }));

      if (type === "pickup") setPickupSuggestions(suggestions);
      else setDropoffSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // Hand
  const handleInputChange = (value, type) => {
    if (type === "pickup") {
      setPickup(value);
      setShowPickupDropdown(true);
    } else {
      setDropoff(value);
      setShowDropoffDropdown(true);
    }

    setTimeout(() => fetchSuggestions(value, type), 300); // Debounce request
  };

  // Handle selection from dropdown
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
      {confirm && <ConfirmRide setConfirm={setConfirm} Pickup={pickup} DropOff={dropoff}  />}
      {lastConfirm && <SearchingDriver setC={setLastConfirm} />}
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex flex-col lg:flex-row justify-between relative items-start px-8 py-16">
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
                  className="w-full sm:w-72 bg-[#eee] px-8 py-4 text-lg rounded-lg"
                  onChange={(e) => handleInputChange(e.target.value, "pickup")}
                />
                {showPickupDropdown && (
                  <ul className="absolute z-10 w-full bg-white border rounded-md mt-2 shadow-lg max-h-64 overflow-y-auto">
                    {pickupSuggestions.map((option, index) => (
                      <li
                        key={option.placeId || index}
                        className="flex flex-col px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectLocation(option.description, "pickup")}
                      >
                        <span className="font-medium">{option.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

           
              <div className="relative">
                <input
                  type="text"
                  value={dropoff}
                  placeholder="Dropoff location"
                  className="w-full sm:w-72 bg-[#eee] px-8 py-4 text-lg rounded-lg"
                  onChange={(e) => handleInputChange(e.target.value, "dropoff")}
                />
                {showDropoffDropdown && (
                  <ul className="absolute z-10 w-full bg-white border rounded-md mt-2 shadow-lg max-h-64 overflow-y-auto">
                    {dropoffSuggestions.map((option, index) => (
                      <li
                        key={option.placeId || index}
                        className="flex flex-col px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectLocation(option.description, "dropoff")}
                      >
                        <span className="font-medium">{option.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="submit"
              onClick={() => setshowCar(!showCar)}
              className="flex items-center align-middle w-56 justify-center py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
            >
              Continue
            </button>
          </div>

         
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
            
              price={price}
              setPrice={setPrice}
              showCar={showCar}
              setshowCar={setshowCar}
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
