import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CarWashForm from "./components/CarWashForm"; // Make sure this exists

export default function CarWashBooking() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055FF] to-black text-white font-sans relative overflow-hidden">

      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-72 w-[200%] bg-white opacity-10 blur-3xl pointer-events-none z-10" />

      {/* Header */}
      <Header />

      {/* Two Column Section */}
      <div className="relative z-20 flex flex-col lg:flex-row min-h-[90vh] w-full">
        
        {/* Left: Branding */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center p-10 sm:p-16">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight">
            Premium Car Wash
          </h1>
          <p className="text-gray-300 text-sm sm:text-xl font-light max-w-md">
            Choose from Normal or Express. Foam wash, underbody, polish & more. Book your preferred slot now.
          </p>
        </div>

        {/* Right: Form */}
        <div className="w-full lg:w-1/2 bg-white text-black flex items-center justify-center p-6 sm:p-10 rounded-t-3xl lg:rounded-none shadow-2xl">
          <div className="w-full max-w-xl">
            <CarWashForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
