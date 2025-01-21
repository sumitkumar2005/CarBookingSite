import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import gsap from "gsap";

function ConfirmRide({ setConfirm, Pickup, DropOff, setLastConfirm, LastConfirm }) {
  useEffect(() => {
    // Popup animation
    gsap.fromTo(
      ".confirm-ride-container",
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const handleLastConfirm = () => {
    setConfirm(false); // Hides ConfirmRide
    setTimeout(() => {
      setLastConfirm(true); // Ensures SearchingDriver renders after ConfirmRide hides
    }, 200);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay with transparency
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
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition duration-200 focus:outline-none"
          onClick={() => setConfirm(false)}
          aria-label="Close"
        >
          <IoClose size={28} />
        </button>

        {/* Heading */}
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-xl font-semibold text-gray-800">Confirm Ride</h1>
        </div>

        {/* Ride Info */}
        <div className="space-y-6">
          {/* Pickup Location */}
          <div className="flex items-center space-x-4">
            <div className="text-green-500 text-2xl">📍</div>
            <div>
              <h3 className="text-lg font-semibold">Pickup Location</h3>
              <p className="text-sm text-gray-500">{Pickup}</p>
            </div>
          </div>

          {/* Route */}
          <div className="flex justify-center">
            <div className="text-gray-500 text-2xl">...</div>
          </div>

          {/* Dropoff Location */}
          <div className="flex items-center space-x-4">
            <div className="text-red-500 text-2xl">📍</div>
            <div>
              <h3 className="text-lg font-semibold">Dropoff Location</h3>
              <p className="text-sm text-gray-500">{DropOff}</p>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLastConfirm}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Confirm Ride
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmRide;
