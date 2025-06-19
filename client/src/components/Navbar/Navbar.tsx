import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <nav className="flex">
        <ul className="text-white fixed top-0 h-20 w-screen flex justify-around items-center bg-secondary shadow-lg font-semibold">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li className="bg-accent px-3.5 py-1 rounded-lg transition duration-300">
            <Link to="/dashboard">Dashboard/Login</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
