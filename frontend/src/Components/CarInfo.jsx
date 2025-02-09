import React, { useRef, useEffect, useState, useMemo } from "react";
import ConfirmRide from "../Components/ConfirmRide"; // Import ConfirmRide directly

const CarInfo = ({
  price,            // Price object (if needed)
  setPrice,
  selectedRide,
  setSelectedRide,
  showCar,
  setshowCar,
  DropOff,
  Pickup,
  rides,           // Array of ride options passed from Start
  setConfirm,
}) => {
  const carInfoRef = useRef(null);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Generate a random ETA (in minutes) for each ride once when rides update.
  // This creates a new array with an additional "eta" property.
  const ridesWithETA = useMemo(() => {
    if (!rides) return [];
    return rides.map((ride) => ({
      ...ride,
      eta: Math.floor(Math.random() * 8) + 3, // ETA between 3 and 10 mins
    }));
  }, [rides]);

  // Close CarInfo if click occurs outside the component
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        carInfoRef.current &&
        !carInfoRef.current.contains(event.target) &&
        showCar
      ) {
        setshowCar(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showCar, setshowCar]);

  // When confirming, set the selected ride and update the price
  const handleConfirmationClick = () => {
    const selectedCar = ridesWithETA?.find((ride) => ride.id === selectedRide);
    if (selectedCar) {
      setSelectedCarDetails(selectedCar);
      setPrice(selectedCar.price);
      setShowConfirmModal(true);
      setshowCar(false);
    }
  };

  return (
    <div>
      <div
        ref={carInfoRef}
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${
          showCar
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-10 scale-95"
        } bg-white rounded-2xl w-[32rem] max-w-full h-auto p-8 flex flex-col gap-6 shadow-2xl transition-all duration-500 ease-out overflow-y-auto`}
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Choose a Ride
        </h1>
        <p className="text-lg text-gray-600 text-center">Recommended for you</p>

        {/* Render available rides */}
        <div className="space-y-4">
          {ridesWithETA && ridesWithETA.length > 0 ? (
            ridesWithETA.map((ride) => (
              <div
                key={ride.id}
                onClick={() => setSelectedRide(ride.id)}
                className={`cursor-pointer p-4 rounded-xl border transition transform hover:scale-105 hover:shadow-lg ${
                  selectedRide === ride.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {ride.name}
                    </h2>
                    <p className="text-sm text-gray-500">ETA {ride.eta} mins</p>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    ₹{ride.price}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No rides available</p>
          )}
        </div>

        <button
          onClick={handleConfirmationClick}
          disabled={!selectedRide}
          className={`w-full py-4 text-xl font-semibold rounded-xl transition duration-200 ${
            selectedRide
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Confirm
        </button>
      </div>

      {/* Conditionally render the ConfirmRide component */}
      {showConfirmModal && selectedCarDetails && (
        <ConfirmRide
          setConfirm={setShowConfirmModal}
          Pickup={Pickup}
          DropOff={DropOff}
          selectedCar={selectedCarDetails}
          price={selectedCarDetails.price}
        />
      )}
    </div>
  );
};

export default CarInfo;
