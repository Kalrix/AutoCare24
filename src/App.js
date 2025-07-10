import React, { useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import BookNowForm from "./components/BookNowForm";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055FF] to-black text-white font-sans relative overflow-hidden">

      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />

      {/* Top Glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-72 w-[200%] bg-white opacity-10 blur-3xl pointer-events-none z-10" />

      {/* Header */}
      <Header />

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center h-screen text-center z-20 relative px-6">
        <h1 className="text-6xl sm:text-9xl font-extrabold mb-4 tracking-tight">
          AutoCare24
        </h1>
        <p className="text-gray-300 text-sm sm:text-2xl font-light max-w-xl">
          Because Quality Service, Repair & Spares Matter.
        </p>
        <div className="mt-10">
          <button
            className="bg-white text-black px-8 py-3 text-sm font-semibold rounded-full hover:bg-gray-200 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Enquire Now
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-white/5 backdrop-blur-md flex items-center justify-center z-50"
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
