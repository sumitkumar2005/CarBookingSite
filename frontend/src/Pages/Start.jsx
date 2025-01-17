import React, { useState, useEffect } from "react";
import gsap from "gsap";
import Image from './../assets/image.png'

function Start() {
  const [pickupFocused, setPickupFocused] = useState(false);
  const [dropoffFocused, setDropoffFocused] = useState(false);
  const [Pickup, setPickup] = useState("");
  const [DropOff, setDropOff] = useState("");
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);

  const pickupOptions = [
    { title: "Saved places", subtitle: "" },
    { title: "Set location on map", subtitle: "" },
    { title: "803, Kheri Chowk - Kharar...", subtitle: "New Hari Enclave, Kharar, Punjab" },
    { title: "Rimpi Tailor", subtitle: "Badala Road, Kharar, PB 140301" },
    { title: "Amit Bakers", subtitle: "Badala Road, Kharar, PB 140301" },
    { title: "Gurjeet Furniture", subtitle: "Badala Road, Kharar, PB 140301" },
  ];

  const handleSelectLocation = (location, type) => {
    if (type === "pickup") {
      setPickup(location);
      setShowPickupDropdown(false);
    } else {
      setDropOff(location);
      setShowDropoffDropdown(false);
    }
  };

  useEffect(() => {
    // Animating the map on page load (fade-in effect)
    gsap.from(".map-container", { opacity: 0, duration: 2, y: -50 });
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-between items-start px-8 py-16">
        {/* Left Section */}
        <div className="max-w-lg w-full space-y-8">
          <h1 className="text-4xl font-bold leading-snug">
            Go anywhere with <span className="text-black">Uber</span>
          </h1>

          {/* Input Fields */}
          <div className="space-y-4">
            {/* Pickup Input */}
            <div className="relative">
              <input
                id="pickup"
                type="text"
                value={Pickup}
                placeholder="Pickup location"
                className="w-full sm:w-72 bg-[#eee] px-8 py-4 text-xl rounded-lg"
                onFocus={() => {
                  setPickupFocused(true);
                  setShowPickupDropdown(true);
                }}
                onBlur={() => setPickupFocused(false)}
                onChange={(e) => setPickup(e.target.value)}
              />
              {showPickupDropdown && (
                <ul className="absolute z-10 w-full bg-white border rounded-md mt-2 shadow-lg max-h-64 overflow-y-auto">
                  {pickupOptions.map((option, index) => (
                    <li
                      key={index}
                      className="flex flex-col px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectLocation(option.title, "pickup")}
                    >
                      <span className="font-medium">{option.title}</span>
                      {option.subtitle && <span className="text-sm text-gray-600">{option.subtitle}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Dropoff Input */}
            <div className="relative">
              <input
                id="dropoff"
                type="text"
                value={DropOff}
                placeholder="Dropoff location"
                className="w-full sm:w-72 bg-[#eee] px-8 py-4 text-xl rounded-lg"
                onFocus={() => {
                  setDropoffFocused(true);
                  setShowDropoffDropdown(true);
                }}
                onBlur={() => setDropoffFocused(false)}
                onChange={(e) => setDropOff(e.target.value)}
              />
              {showDropoffDropdown && (
                <ul className="absolute z-10 w-full bg-white border rounded-md mt-2 shadow-lg max-h-64 overflow-y-auto">
                  {pickupOptions.map((option, index) => (
                    <li
                      key={index}
                      className="flex flex-col px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectLocation(option.title, "dropoff")}
                    >
                      <span className="font-medium">{option.title}</span>
                      {option.subtitle && <span className="text-sm text-gray-600">{option.subtitle}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100">
              <span>Today</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100">
              <span>Now</span>
            </button>
          </div>

          {/* See Prices Button */}
          <button
            type="submit"
            className="flex items-center align-middle w-56 justify-center py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Continue
          </button>
        </div>

        {/* Right Section (Map) */}
        <img
          src={Image}
          alt="Map"
          className="w-full sm:w-96 lg:w-[60rem] h-auto object-contain mt-8 lg:mt-0"
        />
      </div>
    </div>
  );
}

export default Start;
