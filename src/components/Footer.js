import React from "react";
import { HiArrowRight } from "react-icons/hi";

export default function Footer() {
  return (
    <>
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
    </>
  );
}
