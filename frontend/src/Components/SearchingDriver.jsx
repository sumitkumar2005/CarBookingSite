import React, { useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5"; // Importing the close icon
import gsap from "gsap";
import ConfirmRide from "../Components/ConfirmRide"; // Verify this path

function SearchingDriver({ setC }) {
  useEffect(() => {
    gsap.fromTo(
      ".confirm-ride-container",
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  
    // Automatically close the popup after 10 seconds
    const timer = setTimeout(() => {
      setC(false); // Use the correct prop to close the SearchingDriver
    }, 10000);
  
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [setC]);
  

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional overlay
      }}
    >
      <div
        className="confirm-ride-container w-[30rem] border border-gray-300 rounded-lg p-6 shadow-2xl bg-white space-y-6 relative"
        style={{
          minHeight: "24rem",
        }}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition duration-200"
          onClick={(e) => setC(false)}
        >
          <IoClose size={24} />
        </button>

        {/* Ride Image */}
        <div className="flex flex-col items-center space-y-6">
          <img
            src="https://www.svgrepo.com/show/408292/car-white.svg"
            className="w-40"
            alt="Car Icon"
          />
          {/* Searching for Drivers */}
          <div className="w-full text-center text-gray-800 text-lg font-semibold">
            Searching for drivers...
          </div>
          {/* Loading Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-black animate-loading-bar rounded-full"></div>
          </div>
        </div>

        {/* Ride Info */}
        <div className="space-y-6">
          {/* Current Location */}
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-green-500 text-2xl" />
            <div>
              <h3 className="text-lg font-semibold">Current Location</h3>
              <p className="text-sm text-gray-500">803, Kheri Chowk - Kharar...</p>
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
      </div>
    </div>
  );
}

export default SearchingDriver;
