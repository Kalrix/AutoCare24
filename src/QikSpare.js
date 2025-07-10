import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DeliverySearchBar from "./components/DeliverySearchBar";
import ImageCarousel from "./components/ImageCarousel";
import BrandLogoSection from "./components/BrandLogoSection";

export default function QikSpare() {
  return (
    <div className="min-h-screen bg-white text-black font-sans relative flex flex-col justify-center overflow-hidden">

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-16 md:py-0 gap-10">
        
        {/* Left: Tagline */}
        <div className="text-left space-y-9 max-w-xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black">
            QikSpare
          </h1>
          <p className="text-blue-500 text-lg md:text-3xl font-medium">
            30-Min Spare Part Delivery for Garages, Workshops & Mechanics.
          </p>
          <DeliverySearchBar />
        </div>

        {/* Right: Carousel */}
        <ImageCarousel />
      </div>
      <BrandLogoSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
