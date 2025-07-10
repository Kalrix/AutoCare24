import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookNowForm from "./components/BookNowForm";

export default function Service() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black font-sans relative">
      <Header />

      {/* Hero */}
      <section className="pt-32 px-6 md:px-20 text-left space-y-4">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Vehicle Service & Repair
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Get trusted repair, servicing and maintenance at certified AutoCare24 centers.
        </p>
      </section>

      {/* Locator Box */}
      <section className="mt-10 px-6 md:px-20">
        <div className="bg-gray-100 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Enter your location or use current location"
            className="w-full sm:w-2/3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
          />
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900">
            Locate Center
          </button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mt-16 px-6 md:px-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {["General Service", "Car Washing", "Battery Replacement", "Accident Repair", "Tyre & Brake", "AC & Electrical", "Engine Check", "Oil Change"].map((service, index) => (
            <div
              key={index}
              className="border border-gray-200 bg-white rounded-lg p-4 text-center hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-gray-700">{service}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Operational Cities */}
      <section className="mt-24 px-6 md:px-20 pb-24">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Currently Operational In</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="group border border-gray-200 p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition relative">
            <p className="text-center font-semibold text-sm">Bhopal</p>
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/90 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out z-10">
              <p className="text-xs text-gray-800">📞 +91 9109998340</p>
              <button
                className="mt-2 text-xs bg-black text-white px-4 py-1 rounded-full hover:bg-gray-900"
                onClick={() => setIsModalOpen(true)}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white text-black border border-white-200 rounded-2xl p-6 w-[90%] max-w-xl relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <BookNowForm />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
