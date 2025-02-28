import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5"; // Importing the close icon
import gsap from "gsap";

function WaitingDriver({ onClose }) {
  // State to control whether the modal is visible or hidden
  const [isVisible, setIsVisible] = useState(true);

  // Driver and User Data
  const driver = {
    name: "John Doe",
    photo: "https://randomuser.me/api/portraits/men/41.jpg", // Random profile photo
    carNumber: "PB 140301",
    carModel: "Toyota Corolla",
    carPhoto: "https://www.svgrepo.com/show/408292/car-white.svg",
  };

  // User Data
  const user = {
    currentLocation: "803, Kheri Chowk - Kharar...",
    destination: "Amit Bakers, Kharar, PB",
  };

  // Close the modal after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
        isVisible ? "" : "hidden" // Conditionally add the 'hidden' class
      }`}
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
          onClick={() => setIsVisible(false)} // Close the modal on button click
        >
          <IoClose size={24} />
        </button>

        {/* Driver Info */}
        <div className="flex items-center space-x-4">
          <img
            src={driver.photo}
            alt="Driver"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{driver.name}</h3>
            <p className="text-sm text-gray-500">{driver.carModel}</p>
            <p className="text-sm text-gray-500">Car No: {driver.carNumber}</p>
          </div>
        </div>

        {/* Ride Image */}
        <div className="flex flex-col items-center space-y-6">
          <img
            src={driver.carPhoto}
            className="w-40"
            alt="Car Icon"
          />
          {/* Waiting for Driver */}
          <div className="w-full text-center text-gray-800 text-lg font-semibold">
            Waiting for Driver...
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
              <p className="text-sm text-gray-500">{user.currentLocation}</p>
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
              <p className="text-sm text-gray-500">{user.destination}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitingDriver;
