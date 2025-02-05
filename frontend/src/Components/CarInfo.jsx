import React, { useRef, useEffect, useState } from "react";
import ConfirmRide from "../Components/ConfirmRide"; // Import ConfirmRide directly
import Start from "../Pages/Start";


const CarInfo = ({
  price,
  setPrice,
  selectedRide,
  setSelectedRide,
  showCar,
  setshowCar,
  DropOff,
  Pickup,
}) => {
  const carInfoRef = useRef(null);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null); // Store selected car details locally
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Control ConfirmRide modal visibility

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

  const handleConfirmationClick = () => {
    const selectedCar = rides.find((ride) => ride.id === selectedRide);
    if (selectedCar) {
      setSelectedCarDetails(selectedCar); // Set selected car details
      setShowConfirmModal(true); // Show ConfirmRide modal
      setshowCar(false); // Hide car info after confirmation
    }
  };

  return (
    <div>
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
         
        </div>
        <button
          onClick={handleConfirmationClick}
          disabled={!selectedRide}
          className={`w-full py-3 text-xl font-semibold rounded-lg ${
            selectedRide
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Confirm
        </button>
      </div>

      {/* Conditionally render ConfirmRide component */}
      {showConfirmModal && selectedCarDetails && (
        <ConfirmRide
          setConfirm={setShowConfirmModal}
          Pickup={Pickup}
          DropOff={DropOff}
        />
      )}
    </div>
  );
};

export default CarInfo;