import React, { useRef, useEffect, useState } from "react";
import ConfirmRide from "./ConfirmRide";  // Import ConfirmRide directly here

const CarInfo = ({
  rides,
  selectedRide,
  setSelectedRide,
  handleConfirmation,
  showCar,
  setshowCar,
  confirm,
  setConfirm,
}) => {
  const carInfoRef = useRef(null);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null); // Store selected car details locally
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Control the visibility of ConfirmRide modal

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        carInfoRef.current &&
        !carInfoRef.current.contains(event.target) &&
        showCar
      ) {
        setConfirm(true);
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
          {rides.map((ride) => (
            <div
              key={ride.id}
              onClick={() => setSelectedRide(ride.id)}
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
        <button
          onClick={handleConfirmationClick}
          disabled={!selectedRide}
          className={`w-full py-3 text-xl font-semibold rounded-lg ${
            selectedRide
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          style={{
            position: "sticky",
            bottom: "-10px",
          }}
        >
          Confirm
        </button>
      </div>

      {/* Conditionally render ConfirmRide component */}
      {showConfirmModal && selectedCarDetails && (
        <ConfirmRide
          setConfirm={setConfirm}
          currentLocation="Current Location Address"
          destination="Destination Address"
          price={selectedCarDetails.price}
        />
      )}
    </div>
  );
};

export default CarInfo;
