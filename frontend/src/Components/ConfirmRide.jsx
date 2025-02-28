import React from "react";

const ConfirmRide = ({ 
  Pickup, 
  DropOff, 
  selectedRide, 
  price, 
  setConfirm, 
  openSearching 
}) => {
  console.log("ConfirmRide Props:", {
    selectedRide,
    price,
    currentFare: price?.[selectedRide]
  });

  // Function to format price
  const formatPrice = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      console.log("Invalid amount:", amount);
      return 'N/A';
    }
    return `₹${Math.round(amount).toLocaleString()}`;
  };

  // Function to get formatted vehicle type
  const getVehicleType = (type) => {
    const types = {
      car: 'Car',
      bike: 'Bike',
      auto: 'Auto'
    };
    return types[type] || type?.toUpperCase() || 'N/A';
  };

  // Get current fare based on selected ride
  const getCurrentFare = () => {
    if (!price || !selectedRide) {
      console.log("Missing price or selectedRide:", { price, selectedRide });
      return null;
    }
    const fare = price[selectedRide];
    console.log("Current fare:", fare);
    return fare;
  };

  const currentFare = getCurrentFare();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-bold">Confirm Your Ride</h2>
          <p className="text-sm md:text-base text-gray-600">Please review your ride details</p>
        </div>

        {/* Ride Details */}
        <div className="space-y-3 md:space-y-4">
          {/* Pickup Location */}
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base font-medium text-gray-600">Pickup:</span>
            <span className="text-sm md:text-base text-gray-800 text-right flex-1 ml-4">{Pickup}</span>
          </div>

          {/* Drop-off Location */}
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base font-medium text-gray-600">Drop-off:</span>
            <span className="text-sm md:text-base text-gray-800 text-right flex-1 ml-4">{DropOff}</span>
          </div>

          {/* Vehicle Type */}
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base font-medium text-gray-600">Vehicle Type:</span>
            <span className="text-sm md:text-base text-gray-800 font-semibold">
              {getVehicleType(selectedRide)}
            </span>
          </div>

          {/* Fare Amount */}
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <span className="text-sm md:text-base font-medium text-gray-600">Fare:</span>
            <span className="text-sm md:text-base text-gray-800 font-bold">
              {formatPrice(currentFare)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setConfirm(false)}
            className="flex-1 py-2.5 md:py-3 px-4 md:px-6 bg-gray-200 text-gray-800 
              rounded-xl hover:bg-gray-300 transition-colors text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setConfirm(false);
              if (openSearching) openSearching();
            }}
            className="flex-1 py-2.5 md:py-3 px-4 md:px-6 bg-black text-white 
              rounded-xl hover:bg-gray-800 transition-colors text-sm md:text-base"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRide;