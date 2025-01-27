import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const CaptainRide = ({ 
  customer, 
  onAccept, 
  onDecline, 
  isVisible, 
  setIsVisible 
}) => {
  const popupRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      // GSAP Animation for popup entrance
      gsap.fromTo(
        popupRef.current, 
        { opacity: 0, scale: 0.8 }, 
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.3, 
          ease: "power2.out" 
        }
      );

      // Auto-close timer
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 30000); // 30 seconds timeout

      return () => clearTimeout(timer);
    }
  }, [isVisible, setIsVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div 
        ref={popupRef}
        className="w-[30rem] bg-white rounded-2xl p-6 shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={() => setIsVisible(false)}
        >
          <IoClose size={24} />
        </button>

        {/* Customer Profile */}
        <div className="flex items-center space-x-4 mb-6">
          <img 
            src={customer.photo} 
            alt="Customer" 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{customer.name}</h3>
            <p className="text-sm text-gray-500">{customer.phone}</p>
          </div>
        </div>

        {/* Ride Details */}
        <div className="space-y-4">
          {/* Current Location */}
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-green-500 text-2xl" />
            <div>
              <h3 className="text-lg font-semibold">Pickup Location</h3>
              <p className="text-sm text-gray-500">{customer.pickupLocation}</p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-red-500 text-2xl" />
            <div>
              <h3 className="text-lg font-semibold">Destination</h3>
              <p className="text-sm text-gray-500">{customer.destination}</p>
            </div>
          </div>

          {/* Ride Price */}
          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
            <span className="font-semibold">Ride Fare</span>
            <span className="text-green-600 font-bold">${customer.fare}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6 space-x-4">
          <button 
            onClick={onDecline}
            className="w-full bg-red-500 text-white py-3 rounded-lg 
              hover:bg-red-600 transition duration-300"
          >
            Decline
          </button>
          <button 
            onClick={onAccept}
            className="w-full bg-black text-white py-3 rounded-lg 
              hover:bg-gray-800 transition duration-300"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptainRide;