// Hero section with background image, heading, description, and call-to-action buttons
"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const heroImages = [
  "https://www.ssu.ac.in/images/B.PHARAM%20SSU%20JPG.jpg",
  "https://www.ssu.ac.in/images/SSU%20WELCOME%20BANNER%202026.jpg",
  "https://www.ssu.ac.in/images/b.tech%20ssu.jpg",
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const nextImage = () => setCurrent((prev) => (prev + 1) % heroImages.length);
  const prevImage = () =>
    setCurrent((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <section className="relative bg-[#2a1a5e] min-h-[400px] flex items-center justify-center px-0 py-0">
      <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center relative">
        <Image
          src={heroImages[current]}
          alt={`SSU Hero Banner ${current + 1}`}
          fill
          sizes="100vw"
          className="object-cover rounded-none"
        />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-60 text-[#2a1a5e] rounded-full p-3 shadow hover:bg-opacity-80 z-10"
        >
          &#8592;
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-60 text-[#2a1a5e] rounded-full p-3 shadow hover:bg-opacity-80 z-10"
        >
          &#8594;
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === current ? "bg-[#ffd600]" : "bg-white"} inline-block`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
