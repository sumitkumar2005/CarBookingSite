import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [firstname, setfirstname] = useState("")
  const [lastname, setlastname] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!firstname || !lastname || !email || !password) {
        setMessage("All fields are required!");
        return;
    }

    try {
        // Prepare the data
        const data = {
            fullname: {
                firstname,
                lastname,
            },
            email,
            password,
        };

        // Send signup request to backend
        const response = await axios.post("http://localhost:5000/users/register", data);

        console.log(response.data);
        setMessage(
            "User sign up successful! User name: " + (response.data.user?.fullname?.firstname || "Unknown")
        );

        // Save token to localStorage (optional)
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
    } catch (error) {
        // Handle errors
        setMessage(
            "Sign up failed: " + (error.response?.data?.message || error.message || "An error occurred.")
        );
    }
};


  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition hover:scale-105 duration-300">
        <h2 className="text-3xl font-extrabold text-center text-black-500 mb-6 text-black">
          Register Now
        </h2>
        <p className="text-center text-gray-700 mb-8">User Sign up.</p>
        <form onSubmit={handleSignUp}>
          {/* Email Input */}
          <p className="m-2">Full name</p>
          <div className="mb-6 flex gap-4">
            
            <input className=" border border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-gray-600 w-1/2 gap-4" type="text" placeholder="Enter First name " value={firstname} onChange={(e) => setfirstname(e.target.value)} />
            <input className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-600 " type="text" placeholder="Enter Last Name"  value={lastname} onChange={(e) => setlastname(e.target.value)} />
            
          </div>
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
            Sign up
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
          <p className="text-sm text-gray-600">Already  have an account?</p>
          <Link
            to="/login"
            className="flex items-center justify-center w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300"
          >
            Login Here
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

export default UserSignUp;
