import React, { useState } from "react";
import {
  MapPin,
  Car,
  Clock,
  DollarSign,
  Navigation,
  Activity,
  Shield,
} from "lucide-react";

// Reusable RideCard Component
const RideCard = ({ from, to, distance, estimatedTime, earnings, onAccept }) => (
  <div className="bg-white shadow-md p-4 rounded-lg mb-4 flex flex-col md:flex-row justify-between items-center">
    <div className="text-center md:text-left">
      <p className="font-bold">{from} → {to}</p>
      <p className="text-sm text-gray-500">{distance} | {estimatedTime}</p>
    </div>
    <div className="text-center md:text-right mt-4 md:mt-0">
      <span className="text-green-600 font-bold">{earnings}</span>
      <button
        onClick={onAccept}
        className="ml-0 md:ml-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300 mt-2 md:mt-0"
      >
        Accept
      </button>
    </div>
  </div>
);

const CaptainHome = () => {
  const [showRideConfirmation, setShowRideConfirmation] = useState(false);

  const customerData = {
    name: "Alex Johnson",
    photo: "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg",
    phone: "+1 (555) 123-4567",
    pickupLocation: "Central Station",
    destination: "Tech Park",
    fare: "15.50",
  };

  const availableRides = [
    {
      id: 1,
      from: "Central Station",
      to: "Tech Park",
      distance: "12 km",
      estimatedTime: "25 mins",
      earnings: "$15.50",
    },
    {
      id: 2,
      from: "Airport",
      to: "Downtown",
      distance: "18 km",
      estimatedTime: "35 mins",
      earnings: "$22.50",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-800 px-4 sm:px-6 md:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
        {/* Profile Column */}
        <div className="col-span-1 md:col-span-3 lg:col-span-3 bg-gray-100 rounded-2xl p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row items-center mb-6">
            <img
              src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"
              alt="Captain Profile"
              className="w-24 h-24 rounded-full border-4 border-blue-500 mb-4 sm:mb-0 sm:mr-4"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">Sumit Kumar</h2>
              <p className="text-blue-600">Active Captain</p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex items-center bg-white shadow-md p-3 rounded-lg">
              <Car className="mr-3 text-green-600" />
              <span>Toyota Camry - Blue</span>
            </div>
            <div className="flex items-center bg-white shadow-md p-3 rounded-lg">
              <MapPin className="mr-3 text-red-600" />
              <span>License: XYZ 1234</span>
            </div>
          </div>

          <div className="mt-auto">
            <button className="bg-black text-white py-3 px-4 rounded-lg text-center hover:bg-gray-800 transition duration-300 w-full">
              Start Shift
            </button>
          </div>
        </div>

        {/* Performance & Stats Column */}
        <div className="col-span-1 md:col-span-3 lg:col-span-6 space-y-6">
          <div className="bg-gray-100 rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white shadow-md p-4 rounded-lg text-center">
                <Clock className="mx-auto text-blue-600 mb-2" />
                <span>6.5 hrs</span>
                <p className="text-sm text-gray-500">Worked</p>
              </div>
              <div className="bg-white shadow-md p-4 rounded-lg text-center">
                <DollarSign className="mx-auto text-green-600 mb-2" />
                <span>$245</span>
                <p className="text-sm text-gray-500">Earnings</p>
              </div>
              <div className="bg-white shadow-md p-4 rounded-lg text-center">
                <Navigation className="mx-auto text-purple-600 mb-2" />
                <span>12</span>
                <p className="text-sm text-gray-500">Rides</p>
              </div>
              <div className="bg-white shadow-md p-4 rounded-lg text-center">
                <Activity className="mx-auto text-yellow-600 mb-2" />
                <span>4.8</span>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
            </div>
          </div>

          {/* Ride History */}
          <div className="bg-gray-100 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Shield className="mr-3 text-blue-600" /> Recent Rides
            </h3>
            {availableRides.map((ride) => (
              <RideCard
                key={ride.id}
                {...ride}
                onAccept={() => setShowRideConfirmation(true)}
              />
            ))}
          </div>
        </div>

        {/* Available Rides Column */}
        <div className="col-span-1 md:col-span-3 lg:col-span-3 bg-gray-100 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Upcoming Rides</h3>
          <div className="space-y-4">
            {availableRides.map((ride) => (
              <RideCard
                key={ride.id}
                {...ride}
                onAccept={() => setShowRideConfirmation(true)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
