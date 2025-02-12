import React from "react";

const ConfirmRide = ({ setConfirm, Pickup, DropOff, selectedCar, price }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Confirm Your Ride
        </h2>

        {/* Ride Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-600">Pickup:</span>
            <span className="text-lg text-gray-800">{Pickup}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-600">DropOff:</span>
            <span className="text-lg text-gray-800">{DropOff}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-600">Vehicle Type:</span>
            <span className="text-lg text-gray-800 capitalize">{selectedCar?.id || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-600">Fare:</span>
            <span className="text-lg font-bold text-gray-800">
              ₹{price ? Math.round(price).toLocaleString() : "N/A"}
            </span>
          </div>
        </div>

        {/* Vehicle Details */}
        {selectedCar && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Vehicle Details
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={selectedCar.img}
                alt={selectedCar.name}
                className="w-24 h-24 object-cover rounded-lg shadow-md"
              />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {selectedCar.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedCar.description}
                </p>
                <p className="text-xl font-semibold text-gray-800 mt-2">
                  ₹{selectedCar.price}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => setConfirm(false)}
            className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setConfirm(false);
            }}
            className="flex-1 py-3 px-6 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRide;
