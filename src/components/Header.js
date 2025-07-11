import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full h-[80px] bg-[#0055FF] z-50 px-6 flex items-center justify-between">
      {/* Left – Logo */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="AutoCare24 Logo" className="h-10 sm:h-12 w-auto" />
          <span className="text-white font-semibold text-lg">AutoCare24</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden sm:flex space-x-5 text-white/80 text-sm ml-4">
        <Link to="/carwash" className="hover:text-white underline">Book-Carwash</Link>
        <Link to="/service" className="hover:text-white underline">Service & Repair</Link>
        <Link to="/qikspare" className="hover:text-white underline">30-Min Spare</Link>
        <button className="border border-white text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-white hover:text-[#0055FF] transition">
          Login
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <div className="sm:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} className="text-white" /> : <Menu size={26} className="text-white" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-[#0055FF] text-white flex flex-col items-start px-6 py-4 space-y-4 sm:hidden shadow-lg">
          <Link to="/carwash" onClick={() => setMenuOpen(false)} className="text-sm underline">
            Car Wash Booking
          </Link>
          <Link to="/service" onClick={() => setMenuOpen(false)} className="text-sm underline">
            Service & Repair
          </Link>
          <Link to="/qikspare" onClick={() => setMenuOpen(false)} className="text-sm underline">
            30-Min Spare
          </Link>
          <button className="border border-white text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-[#0055FF] transition">
            Login
          </button>
        </div>
      )}
    </div>
  );
}
