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
            <span className="text-lg font-medium text-gray-600">Fare:</span>
            <span className="text-lg text-gray-800">₹{price}</span>
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

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setConfirm(false)}
            className="w-1/2 mr-2 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition duration-200"
          >
            Cancel
          </button>
          <button className="w-1/2 ml-2 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200">
            Confirm Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRide;
