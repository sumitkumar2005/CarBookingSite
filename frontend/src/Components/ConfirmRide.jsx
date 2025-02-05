import React from "react";

const ConfirmRide = ({ setConfirm, Pickup, DropOff, selectedCar }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Confirm Your Ride</h2>

        <div className="flex flex-col gap-2">
          <p className="text-lg"><strong>Pickup:</strong> {Pickup}</p>
          <p className="text-lg"><strong>DropOff:</strong> {DropOff}</p>

          {/* Show selected car details */}
          {selectedCar && (
            <div className="border rounded-lg p-4 mt-2">
              <img src={selectedCar.img} alt={selectedCar.name} className="w-full rounded-md mb-2" />
              <h3 className="text-xl font-semibold">{selectedCar.name}</h3>
              <p className="text-gray-600">{selectedCar.description}</p>
              <p className="text-lg font-bold">{selectedCar.price}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setConfirm(false)}
            className="bg-gray-300 px-4 py-2 rounded-lg text-gray-700"
          >
            Cancel
          </button>
          <button className="bg-green-600 px-4 py-2 rounded-lg text-white">
            Confirm Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRide;
