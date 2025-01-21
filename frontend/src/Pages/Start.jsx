import React, { useState, useEffect } from "react";
import gsap from "gsap";
import Image from "./../assets/image.png";
import CarInfo from "./CarInfo";
import ConfirmRide from "./ConfirmRide.jsx";

function Start() {
  const [pickupFocused, setPickupFocused] = useState(false);
  const [dropoffFocused, setDropoffFocused] = useState(false);
  const [Pickup, setPickup] = useState("");
  const [DropOff, setDropOff] = useState("");
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  const [selectedRide, setSelectedRide] = useState("");
  const [showCar, setshowCar] = useState(false);
  const [confirm, setConfirm] = useState(false); // Correct casing for 'confirm'
  const [price, setprice] = useState('')
  const pickupOptions = [
    { title: "Saved places", subtitle: "" },
    { title: "803, Kheri Chowk - Kharar...", subtitle: "New Hari Enclave, Kharar, Punjab" },
    { title: "Rimpi Tailor", subtitle: "Badala Road, Kharar, PB 140301" },
    { title: "Amit Bakers", subtitle: "Badala Road, Kharar, PB 140301" },
    { title: "Gurjeet Furniture", subtitle: "Badala Road, Kharar, PB 140301" },
  ];

  const rides = [
    { id: "moto", name: "Moto", time: "2 mins away", description: "Affordable, motorcycle rides", price: "₹41.17", img: "https://www.svgrepo.com/show/408292/car-white.svg" },
    { id: "uberGo", name: "UberGo", time: "6 mins away", description: "Affordable compact rides", price: "₹179.25", img: "https://www.svgrepo.com/show/408292/car-white.svg" },
    { id: "premier", name: "Premier", time: "5 mins away", description: "Comfortable sedans, top-quality drivers", price: "₹197.57", img: "https://www.svgrepo.com/show/408292/car-white.svg" },
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
    gsap.from(".map-container", { opacity: 0, duration: 2, y: -50 });
  }, []);

  return (
    <div className="relative z-0">
      {/* Conditional rendering for ConfirmRide */}
      {confirm && <ConfirmRide setConfirm={setConfirm} Pickup={Pickup} DropOff  />}
      
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex flex-col lg:flex-row justify-between relative items-start px-8 py-16">
          <div className="max-w-lg w-full space-y-8">
            <h1 className="text-4xl font-bold leading-snug">
              Go anywhere with <span className="text-black">Uber</span>
            </h1>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={Pickup}
                  placeholder="Pickup location"
                  className="w-full sm:w-72 bg-[#eee] px-8 py-4 text-lg rounded-lg"
                  onFocus={() => setShowPickupDropdown(true)}
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
                          <span className="text-sm text-gray-600">{option.subtitle}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={DropOff}
                  placeholder="Dropoff location"
                  className="w-full sm:w-72 bg-[#eee] px-8 py-4 text-lg rounded-lg"
                  onFocus={() => setShowDropoffDropdown(true)}
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
                          <span className="text-sm text-gray-600">{option.subtitle}</span>
                        )}
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
            {showCar && (
              <CarInfo
                rides={rides}
                selectedRide={selectedRide}
                setSelectedRide={setSelectedRide}
                handleConfirmation={() => setConfirm(true)} // Update the confirm state here
                showCar={showCar}
                setshowCar={setshowCar}
              />
            )}
            <img src={Image} alt="Map" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Start;
