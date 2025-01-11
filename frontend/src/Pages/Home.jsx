import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-between items-start px-8 py-16">
        {/* Left Section */}
        <div className="max-w-lg w-full space-y-8">
          <h1 className="text-4xl font-bold leading-snug">
            Go anywhere with <span className="text-black">Uber</span>
          </h1>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="pickup"
                className="absolute -top-2 left-4 bg-white px-1 text-sm text-gray-600"
              >
                Pickup location
              </label>
              <input
                id="pickup"
                type="text"
                placeholder="Enter pickup location"
                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="dropoff"
                className="absolute -top-2 left-4 bg-white px-1 text-sm text-gray-600"
              >
                Dropoff location
              </label>
              <input
                id="dropoff"
                type="text"
                placeholder="Enter dropoff location"
                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100">
              <span>Today</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100">
              <span>Now</span>
            </button>
          </div>

          {/* See Prices Button */}
          <Link to={'/login'} className=" flex items-center align-middle w-56 justify-center py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition">
            Continue
          </Link>
        </div>

        {/* Right Section (Map) */}
        <div
          className="hidden lg:block bg-cover bg-contain w-full lg:w-1/2 h-[300px] lg:h-[500px] bg-gray-100 mt-8 lg:mt-0 rounded-lg shadow-lg overflow-hidden"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1557404763-69708cd8b9ce?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
            backgroundSize: "cover", // Ensures the image covers the entire section
            backgroundPosition: "center", // Centers the image
            backgroundRepeat: "no-repeat", // Prevents tiling of the image
          }}
        ></div>
      </div>
    </div>
  );
};

export default Home;
