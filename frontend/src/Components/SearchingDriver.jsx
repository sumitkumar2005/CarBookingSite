import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5"; // Importing the close icon
import gsap from "gsap";
import ConfirmRide from "../Components/ConfirmRide"; // Verify this path
import CaptainRide from "../Components/CaptainRide";

function SearchingDriver({ setC, pickup }) {
  const defaultDriver = {
    name: "Finding Driver...",
    photo: "/default-driver.png",
    carModel: "Searching..."
  };

  const [driver, setDriver] = useState(defaultDriver);

  useEffect(() => {
    gsap.fromTo(
      ".searching-container",
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  
    // Automatically close the popup after 10 seconds
    const timer = setTimeout(() => {
      setC(false);
    }, 10000);
  
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [setC]);
  

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center p-4 z-50">
      <div className="searching-container w-full max-w-md mx-auto space-y-6 md:space-y-8">
        {/* Driver Info */}
        <div className="flex items-center space-x-4">
          <img
            src={driver.photo}
            alt="Driver"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-base md:text-lg font-semibold">{driver.name}</h3>
            <p className="text-xs md:text-sm text-gray-500">{driver.carModel}</p>
          </div>
        </div>

        {/* Searching Animation */}
        <div className="flex flex-col items-center space-y-4 md:space-y-6">
          <img
            src="car-icon.svg"
            className="w-32 md:w-40"
            alt="Car Icon"
          />
          <div className="text-center text-gray-800 text-base md:text-lg font-semibold">
            Searching for drivers...
          </div>
          <div className="w-full h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-black animate-loading-bar rounded-full"></div>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-4 md:space-y-6">
          {/* Current Location */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <FaMapMarkerAlt className="text-green-500 text-xl md:text-2xl" />
            <div>
              <h3 className="text-base md:text-lg font-semibold">Current Location</h3>
              <p className="text-xs md:text-sm text-gray-500">{pickup}</p>
            </div>
          </div>

          {/* Route (Dot Icon) */}
          <div className="flex justify-center">
            <BsThreeDotsVertical className="text-gray-500 text-2xl" />
          </div>

          {/* Destination */}
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-red-500 text-2xl" />
            <div>
              <h3 className="text-lg font-semibold">Destination</h3>
              <p className="text-sm text-gray-500">Amit Bakers, Kharar, PB</p>
            </div>
          </div>
        </div>

        {showRideConfirmation && (
          <CaptainRide
            customer={customerData}
            onAccept={() => {
              // Handle ride acceptance
              setShowRideConfirmation(false);
            }}
            onDecline={() => setShowRideConfirmation(false)}
          />
        )}
      </div>
    </div>
  );
}

export default SearchingDriver;
