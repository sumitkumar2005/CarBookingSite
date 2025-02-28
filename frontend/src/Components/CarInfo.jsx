import React, { useRef, useState } from "react";
import axios from "axios";

const CarInfo = ({
  price,
  setPrice,
  selectedRide,
  setSelectedRide,
  showCar,
  setshowCar,
  DropOff,
  Pickup,
  setConfirm,
}) => {
  console.log("CarInfo Props:", { price, selectedRide, DropOff, Pickup });

  const carInfoRef = useRef(null);
  const [error, setError] = useState(null);

  // Function to format price
  const formatPrice = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "Calculating...";
    }
    return `₹${Math.round(amount).toLocaleString()}`;
  };

  // Handle selecting a ride option
  const handleOptionClick = (rideType) => {
    console.log("Selected ride type:", rideType);
    setSelectedRide(rideType);
    setError(null);
  };

  // Get the numeric fare value for the selected ride type
  const getSelectedFare = () => {
    if (!price || !selectedRide) return null;
    console.log("Getting fare for:", selectedRide, "Price object:", price);
    const fareValue = price[selectedRide];
    return typeof fareValue === "number" ? Math.round(fareValue) : null;
  };

  // Confirm the selected ride:
  const handleConfirmationClick = async () => {
    const selectedFare = getSelectedFare();
    console.log("Confirming ride with fare:", selectedFare);

    if (!selectedFare) {
      setError("Please select a ride type");
      return;
    }

    // Close CarInfo and open ConfirmRide in the parent
    setshowCar(false);
    setConfirm(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md mx-auto p-4 md:p-6 space-y-4">
        {/* Ride Options */}
        <div
          onClick={() => handleOptionClick("car")}
          className={`flex justify-between items-center p-4 cursor-pointer ${
            selectedRide === "car" ? "bg-gray-100" : ""
          }`}
        >
          <div className="flex items-center gap-4">
            <img src="/car-icon.png" alt="Car" className="w-10 h-10" />
            <div>
              <h3 className="font-semibold">Car</h3>
              <p className="text-sm text-gray-500">Comfortable</p>
            </div>
          </div>
          <div className="text-lg font-bold">{formatPrice(price?.car)}</div>
        </div>

        <div
          onClick={() => handleOptionClick("bike")}
          className={`flex justify-between items-center p-4 cursor-pointer ${
            selectedRide === "bike" ? "bg-gray-100" : ""
          }`}
        >
          <div className="flex items-center gap-4">
            <img src="/bike-icon.png" alt="Bike" className="w-10 h-10" />
            <div>
              <h3 className="font-semibold">Bike</h3>
              <p className="text-sm text-gray-500">Quick</p>
            </div>
          </div>
          <div className="text-lg font-bold">{formatPrice(price?.bike)}</div>
        </div>

        <div
          onClick={() => handleOptionClick("auto")}
          className={`flex justify-between items-center p-4 cursor-pointer ${
            selectedRide === "auto" ? "bg-gray-100" : ""
          }`}
        >
          <div className="flex items-center gap-4">
            <img src="/auto-icon.png" alt="Auto" className="w-10 h-10" />
            <div>
              <h3 className="font-semibold">Auto</h3>
              <p className="text-sm text-gray-500">Economic</p>
            </div>
          </div>
          <div className="text-lg font-bold">{formatPrice(price?.auto)}</div>
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirmationClick}
          disabled={!selectedRide}
          className="w-full mt-4 py-3 bg-black text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        >
          Confirm {selectedRide?.toUpperCase()}
        </button>
      </div>
    </div>
  );
};

export default CarInfo;