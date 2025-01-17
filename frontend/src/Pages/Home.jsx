import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center transition-all duration-500">
      {/* Hero Section */}
      <div className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-center transition-all duration-500" style={{
        backgroundImage: "url('https://source.unsplash.com/featured/?car,black')",
      }}>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 transition-all duration-500">Uber - Your Ride, Your Way</h1>
        <p className="text-lg md:text-xl max-w-2xl text-center mb-8 transition-all duration-500">
          Experience the ease of booking rides at your fingertips. From daily commutes to luxurious travel, we have you covered.
        </p>
        <button
          onClick={handleLoginRedirect}
          className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
        >
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div className="w-full px-8 py-16 bg-black text-white transition-all duration-500">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjfiEXtIbCmvL_kycawAcVmPgXH2nVM9AZKA&s"
              alt="Safe Rides"
              className="w-64 h-64 mb-4 object-cover transition-transform duration-300 hover:scale-105"
            />
            <h2 className="text-2xl font-bold mb-2">Safety First</h2>
            <p>
              Travel with confidence knowing that your safety is our top priority.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img
              src="https://doubleapex.co.za/wp-content/uploads/2022/10/Audi-R8-Coupe-V10-GT-RWD.jpeg"
              alt="Luxury Cars"
              className="w-64 h-64 mb-4 object-cover transition-transform duration-300 hover:scale-105"
            />
            <h2 className="text-2xl font-bold mb-2">Luxury Rides</h2>
            <p>
              Enjoy premium and luxury cars for a comfortable experience.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img
              src="https://designtemplate.tech/Online-Cab-Booking-With-Mobile-Animation-Scene-700.webp"
              alt="Convenience"
              className="w-64 h-64 mb-4 object-cover transition-transform duration-300 hover:scale-105"
            />
            <h2 className="text-2xl font-bold mb-2">Convenience</h2>
            <p>
              Book rides anytime, anywhere with just a few taps.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="w-full px-8 py-16 bg-white text-black transition-all duration-500">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 transition-all duration-500">About Uber</h2>
          <p className="text-lg md:text-xl text-center mb-8 transition-all duration-500">
            Uber is the leading ride-hailing platform, connecting riders and drivers worldwide. Whether you need a quick trip across town or a ride to the airport, we ensure a seamless experience for all our users.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full px-8 py-16 bg-black text-white text-center transition-all duration-500">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 transition-all duration-500">Ready to book your ride?</h2>
        <button
          onClick={handleLoginRedirect}
          className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
        >
          Login to Book Now
        </button>
      </div>
    </div>
  );
};

export default Home;
