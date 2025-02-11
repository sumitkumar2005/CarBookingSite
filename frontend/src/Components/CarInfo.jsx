import React, { useRef, useEffect, useState } from "react";
import ConfirmRide from "../Components/ConfirmRide";

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
  const carInfoRef = useRef(null);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fixed ETAs for demonstration purposes
  const carETA = 2;
  const bikeETA = 3;
  const autoETA = 4;

  // Handle selecting a ride option
  const handleOptionClick = (rideType) => {
    setSelectedRide(rideType);
  };

  // Confirm the selected ride
  const handleConfirmationClick = () => {
    let selectedCar = null;
    if (selectedRide === "car") {
      selectedCar = { id: "car", name: "Car", eta: carETA, price: price?.car };
    } else if (selectedRide === "bike") {
      selectedCar = { id: "bike", name: "Bike", eta: bikeETA, price: price?.bike };
    } else if (selectedRide === "auto") {
      selectedCar = { id: "auto", name: "Auto", eta: autoETA, price: price?.auto };
    }
    if (selectedCar) {
      setSelectedCarDetails(selectedCar);
      setPrice(selectedCar.price);
      setShowConfirmModal(true);
      setshowCar(false);
    }
  };

  // Close CarInfo if a click occurs outside the component
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (carInfoRef.current && !carInfoRef.current.contains(event.target) && showCar) {
        setshowCar(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showCar, setshowCar]);

  return (
    <div className="">
      <div
        ref={carInfoRef}
        className={`absolute top-0 left-1/3 transform -translate-x-1/2 ${
          showCar
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-10 scale-95"
        } bg-white text-black border border-black rounded-2xl w-[32rem] max-w-full h-auto p-8 flex flex-col gap-6 shadow-2xl transition-all duration-500 ease-out overflow-y-auto`}
      >
        <h1 className="text-3xl font-bold text-center">Choose a Ride</h1>
        <p className="text-lg text-center">Recommended for you</p>

        <div className="space-y-4">
          {/* Car Option */}
          <div
            onClick={() => handleOptionClick("car")}
            className={`cursor-pointer p-4 rounded-xl border transition transform hover:scale-105 hover:shadow-lg ${
              selectedRide === "car"
                ? "border-black bg-gray-200"
                : "border-gray-400 bg-white"
            }`}
          >
            <div className="flex items-center">
              <img
                src="https://th.bing.com/th/id/OIP.90_IXyFPb47LZ_AYAe1ylAHaEK?w=301&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                alt="Car"
                className="w-16 h-16 object-cover mr-4 filter grayscale"
              />
              <div>
                <h2 className="text-xl font-semibold">Car</h2>
                <p className="text-sm">ETA: {carETA} mins away</p>
              </div>
              <div className="ml-auto text-lg font-bold">
                ₹{price?.car ? Math.round(price.car) : "N/A"}
              </div>
            </div>
          </div>

          {/* Bike Option */}
          <div
            onClick={() => handleOptionClick("bike")}
            className={`cursor-pointer p-4 rounded-xl border transition transform hover:scale-105 hover:shadow-lg ${
              selectedRide === "bike"
                ? "border-black bg-gray-200"
                : "border-gray-400 bg-white"
            }`}
          >
            <div className="flex items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/8636/8636881.png"
                alt="Bike"
                className="w-16 h-16 object-cover mr-4 filter grayscale"
              />
              <div>
                <h2 className="text-xl font-semibold">Bike</h2>
                <p className="text-sm">ETA: {bikeETA} mins away</p>
              </div>
              <div className="ml-auto text-lg font-bold">
                ₹{price?.bike ? Math.round(price.bike) : "N/A"}
              </div>
            </div>
          </div>

          {/* Auto Option */}
          <div
            onClick={() => handleOptionClick("auto")}
            className={`cursor-pointer p-4 rounded-xl border transition transform hover:scale-105 hover:shadow-lg ${
              selectedRide === "auto"
                ? "border-black bg-gray-200"
                : "border-gray-400 bg-white"
            }`}
          >
            <div className="flex items-center">
              <img
                src="https://th.bing.com/th/id/OIP.gERohywpalGF3NjolmHt5wHaE7?rs=1&pid=ImgDetMain"
                alt="Auto"
                className="w-16 h-16 object-cover mr-4 filter grayscale"
              />
              <div>
                <h2 className="text-xl font-semibold">Auto</h2>
                <p className="text-sm">ETA: {autoETA} mins away</p>
              </div>
              <div className="ml-auto text-lg font-bold">
                ₹{price?.auto ? Math.round(price.auto) : "N/A"}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirmationClick}
          disabled={!selectedRide}
          className={`w-full py-4 text-xl font-semibold rounded-xl transition duration-200 ${
            selectedRide
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Confirm
        </button>
      </div>

      {/* Conditionally render the ConfirmRide modal */}
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