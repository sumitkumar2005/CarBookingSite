import React, { useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import gsap from "gsap";

function ConfirmRide({ setConfirm, pickup, dropOff, price }) {
  useEffect(() => {
    // Animate popup
    gsap.fromTo(
      ".confirm-ride-container",
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
      }}
    >
      <div
        className="confirm-ride-container w-[30rem] border border-gray-300 rounded-lg p-6 shadow-2xl bg-white space-y-6 relative"
        style={{ minHeight: "24rem" }}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition duration-200"
          onClick={() => setConfirm(false)}
        >
          <IoClose size={24} />
        </button>

        {/* Ride Information */}
        <div className="space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Confirm Your Ride
          </h2>

          {/* Ride Details */}
          <div className="space-y-4">
            {/* Current Location */}
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-green-500 text-xl" />
              <div>
                <h3 className="text-lg font-medium">Current Location</h3>
                <p className="text-sm text-gray-500">{currentLocation}</p>
              </div>
            </div>

            {/* Route */}
            <div className="flex justify-center">
              <BsThreeDotsVertical className="text-gray-500 text-2xl" />
            </div>

            {/* Destination */}
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-red-500 text-xl" />
              <div>
                <h3 className="text-lg font-medium">Destination</h3>
                <p className="text-sm text-gray-500">{destination}</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-lg font-medium text-gray-700">Price:</span>
              <span className="text-xl font-semibold text-black">{price}</span>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => alert("Ride Confirmed!")}
            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmRide;
