import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 w-full h-[80px] bg-[#0055FF] z-50 px-6 flex items-center justify-between">
      {/* Left – Logo + Links */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="AutoCare24 Logo" className="h-10 sm:h-12 w-auto" />
          <span className="text-white font-semibold text-lg">AutoCare24</span>
        </Link>
        <div className="hidden sm:flex space-x-3 text-white/80 text-sm ml-4">
          <span>Service</span>
          <span>Repair</span>
          <Link to="/qikspare" className="hover:text-white underline">30-Min Spare</Link>
        </div>
      </div>

      {/* Right – Login */}
      <button className="border border-white text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-[#0055FF] transition">
        Login
      </button>
    </div>
  );
}
