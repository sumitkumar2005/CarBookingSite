import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../Context/UserContext";
import { useContext } from "react";
const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const {userData,setUserData}= useContext(UserDataContext);
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      // Send login request to backend
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, {
        email,
        password,
      });

      if (response.data.token) {
        // Debug the token
        console.log("Received token:", response.data.token);
        localStorage.setItem("token", response.data.token);
        // Verify token was saved
        console.log("Saved token:", localStorage.getItem("token"));
        setUserData(response.data.user);
        navigate("/start");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition hover:scale-105 duration-300">
        <h2 className="text-3xl font-extrabold text-center text-black-500 mb-6 text-black">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-700 mb-8">User Login.</p>
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
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
          >
            Login
          </button>
        </form>

        {/* Link to Captain Login */}
        <div className="mt-6 flex flex-col items-center">
          <Link
            to="/CaptainLogin"
            className="text-black font-semibold hover:underline hover:text-gray-800 transition duration-300"
          >
            Or, Login as a Captain
          </Link>
        </div>

        {/* Sign Up Block */}
        <div className="mt-4 flex flex-col items-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <Link
            to="/signup"
            className="flex items-center justify-center w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300"
          >
            Sign Up Here
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

export default UserLogin;
