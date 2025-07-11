import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CarWashForm from "./components/CarWashForm";

export default function CarWashBooking() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055FF] to-black text-white font-sans relative overflow-hidden">

      {/* Background Blur */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-72 w-[200%] bg-white opacity-10 blur-3xl pointer-events-none z-10" />

      {/* Header */}
      <Header />

      {/* Content Section */}
      <div className="relative z-20 flex flex-col lg:flex-row min-h-[90vh] w-full">

        {/* Left Column: Branding */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center px-6 py-12 sm:px-10 md:px-20 min-h-[300px] sm:min-h-[400px]">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Premium Car Wash
          </h1>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl font-light max-w-md">
            Book a car wash that fits your schedule. Foam Wash, Underbody, Interior Detailing — Normal or Express. 
          </p>
        </div>

        {/* Right Column: Booking Form */}
        <div className="w-full lg:w-1/2 bg-white text-black flex items-center justify-center px-4 py-12 sm:px-6 md:px-10 rounded-t-3xl lg:rounded-none shadow-2xl">
<div className="w-full bg-white text-black flex items-center justify-center px-4 py-12 sm:px-6 md:px-10 pt-20">
            <CarWashForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
