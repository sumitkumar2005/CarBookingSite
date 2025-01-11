import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-black text-white">

    <Link to={'/'} className='flex items-center justify-center text-2xl font-bold' >Uber</Link>
    <ul className="flex items-center gap-8">
      <li className="hover:underline cursor-pointer">Ride</li>
      <li className="hover:underline cursor-pointer">Drive</li>
      <li className="hover:underline cursor-pointer">Business</li>
      <li className="hover:underline cursor-pointer">About</li>
    </ul>
    <div className="flex items-center gap-4">
      <button className="hover:underline">Help</button>
      <button className="hover:underline">Log in</button>
      <button className="px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black transition">
        Sign up
      </button>
    </div>
  </nav>
  );
};

export default Navbar;