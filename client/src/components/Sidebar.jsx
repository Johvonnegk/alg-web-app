import React from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <>
      <nav className="flex">
        <ul className="text-white fixed top-0 h-screen w-20 m-0 flex flex-col bg-gray-900 shadow-lg">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
