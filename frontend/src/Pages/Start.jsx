import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "./../assets/image.png";

function Start() {
  const [pickupFocused, setPickupFocused] = useState(false);
  const [dropoffFocused, setDropoffFocused] = useState(false);
  const [Pickup, setPickup] = useState("");
  const [DropOff, setDropOff] = useState("");
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  const [selectedRide, setSelectedRide] = useState(""); // State for selected ride
  const [showCar, setshowCar] = useState(false);
  const carInfoRef = useRef(null); // Ref for car information overlay

  const pickupOptions = [
    { title: "Saved places", subtitle: "" },
    {
      title: "803, Kheri Chowk - Kharar...",
      subtitle: "New Hari Enclave, Kharar, Punjab",
    },
    {
      title: "Rimpi Tailor",
      subtitle: "Badala Road, Kharar, PB 140301",
    },
    {
      title: "Amit Bakers",
      subtitle: "Badala Road, Kharar, PB 140301",
    },
    {
      title: "Gurjeet Furniture",
      subtitle: "Badala Road, Kharar, PB 140301",
    },
  ];

  const rides = [
    {
      id: "moto",
      name: "Moto",
      time: "2 mins away",
      description: "Affordable, motorcycle rides",
      price: "₹41.17",
      img: "https://www.svgrepo.com/show/408292/car-white.svg",
    },
    {
      id: "uberGo",
      name: "UberGo",
      time: "6 mins away",
      description: "Affordable compact rides",
      price: "₹179.25",
      img: "https://www.svgrepo.com/show/408292/car-white.svg",
    },
    {
      id: "premier",
      name: "Premier",
      time: "5 mins away",
      description: "Comfortable sedans, top-quality drivers",
      price: "₹197.57",
      img: "https://www.svgrepo.com/show/408292/car-white.svg",
    },
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

  const handleSelectRide = (id) => {
    setSelectedRide(id); // Update selected ride
  };

  useEffect(() => {
    // Animating the map on page load (fade-in effect)
    gsap.from(".map-container", { opacity: 0, duration: 2, y: -50 });
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        carInfoRef.current &&
        !carInfoRef.current.contains(event.target) &&
        showCar
      ) {
        setshowCar(false); // Hide car info if clicked outside
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showCar]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
                className="w-full sm:w-72 bg-[#eee] px-8 py-4 text-lg rounded-lg"
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
                      {option.subtitle && (
                        <span className="text-sm text-gray-600">
                          {option.subtitle}
                        </span>
                      )}
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
                      {option.subtitle && (
                        <span className="text-sm text-gray-600">
                          {option.subtitle}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* See Prices Button */}
          <button
            type="submit"
            onClick={(e) => setshowCar(!showCar)}
            className="flex items-center align-middle w-56 justify-center py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Continue
          </button>
        </div>

        {/* Right Section */}
        <div className="relative w-full h-[40rem] lg:h-auto">
          {/* Car Information Overlay */}
          {showCar && (
            <div
              ref={carInfoRef}
              className="absolute top-0 left-1/4 transform -translate-x-1/2 scale-95 opacity-0 bg-white w-[32rem] h-full p-6 flex flex-col gap-4 shadow-lg overflow-y-auto transition-all duration-500 ease-out"
              style={{
                opacity: showCar ? 1 : 0,
                transform: showCar
                  ? "translate(-50%, 0) scale(1)"
                  : "translate(-50%, -50%) scale(0.95)",
              }}
            >
              <h1 className="text-4xl font-bold">Choose a Ride</h1>
              <p className="text-xl text-gray-600">Recommended</p>
              <div className="space-y-4">
                {rides.map((ride) => (
                  <div
                    key={ride.id}
                    onClick={() => handleSelectRide(ride.id)}
                    className={`flex items-center justify-between border rounded-lg p-4 hover:shadow-md cursor-pointer ${
                      selectedRide === ride.id ? "border-black" : "border-gray-300"
                    }`}
                  >
                    <div className="flex">
                      <img src={ride.img} className="w-32" alt="" />
                      <div>
                        <h2 className="text-left text-2xl font-semibold">
                          {ride.name}
                        </h2>
                        <p className="text-gray-500">{ride.time}</p>
                        <p className="text-sm text-gray-400">{ride.description}</p>
                      </div>

                   
                    </div>
                    <p className="text-xl font-bold">{ride.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map Background */}
          <img
            src={Image}
            alt="Map"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Start;
