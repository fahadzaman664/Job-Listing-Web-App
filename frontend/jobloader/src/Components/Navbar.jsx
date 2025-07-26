import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Briefcase, PlusCircle, Home } from "lucide-react"; 
const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md md:px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
      >
        JobBoard
      </Link>

      <div className="flex space-x-4 items-center text-sm md:text-base">
        <Link
          to="/"
          className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium transition duration-200 ${
            location.pathname === "/"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
          }`}
        >
          <Home size={18} />
          Home
        </Link>

        <Link
          to="/add-job"
          className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium transition duration-200 ${
            location.pathname === "/add-job"
              ? "bg-indigo-600 text-white"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          <PlusCircle size={18} />
          Add Job
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
