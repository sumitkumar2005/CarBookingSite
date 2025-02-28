import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-dark-900 dark:text-white mb-6">
              Your Premium
              <span className="text-primary-600"> Ride</span>
              <br />
              Awaits
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Experience luxury and comfort with our premium fleet of vehicles.
              Book your ride now and enjoy a seamless journey.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/book')}
              className="bg-primary-600 text-white px-8 py-4 rounded-full 
                        font-semibold text-lg shadow-lg hover:bg-primary-700 
                        transition-colors duration-300"
            >
              Book Now
            </motion.button>
          </motion.div>

          {/* Image/Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img
              src="/car-hero.png" // Add your car image
              alt="Luxury Car"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            
            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-10 right-10 bg-white dark:bg-dark-800 
                         p-4 rounded-lg shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Available Now</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 
                      rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400 
                      rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>
    </div>
  );
};

export default Hero; 