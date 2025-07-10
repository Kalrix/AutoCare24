import React from "react";

// Import grayscale logos from assets folder
import brand1 from "../assets/brands/brand1.png";
import brand2 from "../assets/brands/brand2.png";
import brand3 from "../assets/brands/brand3.png";
import brand4 from "../assets/brands/brand4.png";
import brand5 from "../assets/brands/brand5.png";

// Array of logos
const logos = [brand1, brand2, brand3, brand4, brand5];

export default function BrandLogoSection() {
  return (
    <div className="w-full bg-white mt-20 pb-10 px-4">
      {/* Headline */}
      <div className="text-center text-gray-600 text-sm sm:text-base font-medium mb-6 opacity-80">
        100+ Trusted Partners
      </div>

      {/* Logos */}
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 grayscale opacity-60">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Brand ${index + 1}`}
            className="h-9 w-28 object-contain"
          />
        ))}
      </div>
    </div>
  );
}
