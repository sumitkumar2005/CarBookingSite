import React, { useState, useContext } from "react";
import axios from "axios";
import { CaptainDataContext } from "../Context/CaptainContext";
import { Link, useNavigate } from "react-router-dom";

const CaptainSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { setCaptainData } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    if (!firstname || !lastname || !email || !password || !vehicleColor || !vehiclePlate || !vehicleCapacity || !vehicleType) {
      setMessage("All fields are required!");
      setLoading(false); // Stop loading
      return;
    }

    try {
      const data = {
        fullname: {
          firstname,
          lastname,
        },
        email,
        password,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: parseInt(vehicleCapacity),
          vehicleType,
        },
      };

      // Send signup request to backend
      const response = await axios.post("http://localhost:5000/captains/register", data);
      setMessage("Captain sign up successful!");
      setCaptainData(response.data.captain);

      // Save token to localStorage (optional)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      navigate("/CaptainHome"); // Redirect after successful sign-up
    } catch (error) {
      setMessage("Sign up failed: " + (error.response?.data?.message || error.message || "An error occurred."));
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition hover:scale-105 duration-300">
        <h2 className="text-3xl font-extrabold text-center text-black-500 mb-6">Register Now</h2>
        <p className="text-center text-gray-700 mb-8">Captain Sign up.</p>
        <form onSubmit={handleSignUp}>
          {/* Full name */}
          <div className="mb-6 flex gap-4">
            <input
              className="border border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-gray-600 w-1/2"
              type="text"
              placeholder="Enter First name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              type="text"
              placeholder="Enter Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          {/* Email and password */}
          <div className="mb-6">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Vehicle details */}
          <div className="mb-6 flex flex-col gap-5">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              type="text"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition duration-300"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <Link
          to="/CaptainLogin"
          className="block text-center mt-4 text-black font-semibold hover:underline transition duration-300"
        >
          Already have an account? Log in
        </Link>

        {/* Display message */}
        {message && <p className="text-center mt-4 text-sm text-gray-800 font-medium bg-gray-200 p-3 rounded-lg">{message}</p>}
      </div>
    </div>
  );
};

export default CaptainSignUp;
