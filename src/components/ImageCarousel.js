import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img1 from "../assets/qikspare1.png";
import img2 from "../assets/qikspare2.png";
import img3 from "../assets/qikspare3.png";

const slides = [
  {
    image: img1,
    caption: "30-Min Genuine Spares at Your Doorstep",
  },
  {
    image: img2,
    caption: "Trusted by 1000+ Mechanics & Workshops",
  },
  {
    image: img3,
    caption: "From OEM to Aftermarket – All in One Place",
  },
];

export default function ImageCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <div className="w-full max-w-md">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="text-center">
            <img
              src={slide.image}
              alt={`QikSpare Slide ${index + 1}`}
              className="w-full object-contain mb-4"
            />
            <p className="text-gray-700 text-lg md:text-1xl font-light">
  {slide.caption}
</p>

          </div>
        ))}
      </Slider>
    </div>
  );
}
