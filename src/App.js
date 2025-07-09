import React from "react";
import { HiArrowRight } from "react-icons/hi";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055FF] to-black text-white font-sans relative overflow-hidden">

      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />

      {/* Top Glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-72 w-[200%] bg-white opacity-10 blur-3xl pointer-events-none z-10" />

      {/* Top Left – Logo + Info */}
      <div className="absolute top-6 left-6 z-20 flex items-center space-x-4 text-sm sm:text-base opacity-90">
        <img src="/logo.png" alt="AutoCare24 Logo" className="h-10 sm:h-12 w-auto" />
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 font-medium">
          <div className="tracking-wide text-white">Quick Book</div>
          <div className="flex space-x-3 text-gray-300 text-xs sm:text-sm">
            <span>Service</span>
            <span>Repair</span>
            <span>30-Min Spare</span>
          </div>
        </div>
      </div>

      {/* Top Right – Login Button */}
      <div className="absolute top-6 right-6 z-20">
        <button className="border border-white text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition">
          Login
        </button>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center h-screen text-center z-20 relative px-6">
        <h1 className="text-6xl sm:text-9xl font-extrabold mb-4 tracking-tight">
          AutoCare24
        </h1>
        <p className="text-gray-300 text-sm sm:text-2xl font-light max-w-xl">
          Because Quality Service, Repair & Spares Matter.
        </p>
        <div className="mt-10">
          <button className="bg-white text-black px-8 py-3 text-sm font-semibold rounded-full hover:bg-gray-200 transition">
            Book Now
          </button>
        </div>
      </div>

      {/* Bottom Left – Copyright */}
      <footer className="absolute bottom-6 left-6 text-xs text-gray-400 z-20 opacity-60">
        &copy; 2025 AutoCare24 | Powered by SangwanHQ
      </footer>

      {/* Bottom Right – About Us Link */}
      <div className="absolute bottom-6 right-6 z-20 opacity-60">
        <a href="/about" className="flex items-center text-xs text-gray-400 hover:text-white transition">
          About Us <HiArrowRight className="ml-1 text-sm" />
        </a>
      </div>
    </div>
  );
}
