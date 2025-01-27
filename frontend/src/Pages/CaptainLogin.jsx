// CaptainLogin.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../Context/CaptainContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCaptainData } = useContext(CaptainDataContext); // Corrected to `setCaptainData`
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Start loading

    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:5000/captains/login", {
        email,
        password,
      });

      if (response.status === 200) {
        setCaptainData(response.data.captain); // Update context data
        localStorage.setItem("token", response.data.token); // Save token
        navigate("/CaptainHome"); // Redirect to home page
      }
    } catch (error) {
      // Improved error handling
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setMessage(errorMessage);
      console.error("Login failed:", errorMessage);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition hover:scale-105 duration-300">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-black">Welcome Back!</h2>
        <p className="text-center text-gray-700 mb-8">Captain Login</p>
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Link to Sign Up */}
        <div className="mt-6 flex flex-col items-center">
          <Link
            to="/CaptainSignup"
            className="text-black font-semibold hover:underline hover:text-gray-800 transition duration-300"
          >
            Or, Sign up Here
          </Link>
        </div>

        {/* Display Message */}
        {message && (
          <p className="text-center mt-4 text-sm text-gray-800 font-medium bg-gray-200 p-3 rounded-lg">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CaptainLogin;
