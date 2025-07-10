import React from "react";
import { HiOutlineClock } from "react-icons/hi";
import { PiCubeTransparent } from "react-icons/pi";

export default function DeliverySearchBar() {
  return (
    <div className="w-full max-w-3xl mt-5 bg-white rounded-xl shadow-md flex items-center justify-between px-4 py-6 space-x-4">
      {/* Address Input */}
      <div className="flex items-center space-x-2 flex-1">
        <PiCubeTransparent className="text-lg text-gray-700" />
        <input
          type="text"
          placeholder="Search Spare Part By Name, OEM, Vehicle Number"
          className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-300" />

      

      {/* Search Button */}
      <button className="bg-[#0055FF] text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition">
        Search
      </button>
    </div>
  );
}
