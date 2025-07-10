import React from "react";
import { HiOutlineLocationMarker, HiOutlineClock } from "react-icons/hi";

export default function DeliverySearchBar() {
  return (
    <div className="w-full max-w-3xl mt-6 bg-white rounded-xl shadow-md flex items-center justify-between px-4 py-3 space-x-4">
      {/* Address Input */}
      <div className="flex items-center space-x-2 flex-1">
        <HiOutlineLocationMarker className="text-lg text-gray-700" />
        <input
          type="text"
          placeholder="Enter delivery address"
          className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-300" />

      {/* Delivery Time */}
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <HiOutlineClock className="text-lg" />
        <span>Delivery Now</span>
      </div>

      {/* Search Button */}
      <button className="bg-[#0055FF] text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition">
        Search
      </button>
    </div>
  );
}
