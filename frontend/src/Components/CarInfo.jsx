import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fixed ETAs for demonstration purposes
  const carETA = 2;
  const bikeETA = 3;
  const autoETA = 4;

  // Handle selecting a ride option
  const handleOptionClick = (rideType) => {
    setSelectedRide(rideType);
    setError(null);
  };

  // Get the numeric fare value for the selected ride type
  const getSelectedFare = () => {
    if (!price || !selectedRide) return null;
    
    const fareValue = price[selectedRide];
    return typeof fareValue === 'number' ? Math.round(fareValue) : null;
  };

  // Confirm the selected ride
  const handleConfirmationClick = async () => {
    const selectedFare = getSelectedFare();
    console.log("Selected Fare:", selectedFare); // Debug log
    
    if (!selectedFare) {
      setError("Invalid fare amount");
      return;
    }

    let selectedCar = null;
    const currentPrice = price[selectedRide];
    console.log("Current Price:", currentPrice); // Debug log

    if (selectedRide === "car") {
      selectedCar = { 
        id: "car", 
        name: "Car", 
        eta: carETA, 
        price: currentPrice 
      };
    } else if (selectedRide === "bike") {
      selectedCar = { 
        id: "bike", 
        name: "Bike", 
        eta: bikeETA, 
        price: currentPrice
      };
    } else if (selectedRide === "auto") {
      selectedCar = { 
        id: "auto", 
        name: "Auto", 
        eta: autoETA, 
        price: currentPrice
      };
    }

    console.log("Selected Car Details:", selectedCar); // Debug log

    if (selectedCar) {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:5000/rides/create",
          {
            pickUp: Pickup,
            dropOff: DropOff,
            vehicleType: selectedRide,
            fare: currentPrice
          },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (response.status === 201) {
          console.log("Ride created successfully:", response.data);
          setSelectedCarDetails(selectedCar);
          setshowCar(false);
          setConfirm(true);
        }
      } catch (error) {
        console.error("Error creating ride:", error);
        setError(
          error.response?.data?.message || 
          "Failed to create ride. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Close CarInfo if click occurs outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (carInfoRef.current && !carInfoRef.current.contains(event.target)) {
        setshowCar(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setshowCar]);

  if (!showCar) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setshowCar(false)}></div>
      <div
        ref={carInfoRef}
        className="relative bg-white rounded-3xl w-[32rem] max-w-full p-8 shadow-2xl transform transition-all duration-300 scale-100"
      >
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
                className="w-16 h-16 object-cover mr-4"
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
                className="w-16 h-16 object-cover mr-4"
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
                className="w-16 h-16 object-cover mr-4"
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

        {/* Confirm Button */}
        <div className="mt-8">
          <button
            onClick={handleConfirmationClick}
            disabled={!selectedRide || loading}
            className={`w-full py-4 text-xl font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
              selectedRide && !loading
                ? "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Ride...
              </span>
            ) : (
              "Confirm Ride"
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-xl text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarInfo;