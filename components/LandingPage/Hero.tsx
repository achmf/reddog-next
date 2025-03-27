// src/components/Hero.tsx
"use client";
import { useEffect, useState } from "react";

export default function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 w-screen h-full">
        {/* Gambar Parallax */}
        <div
          className="absolute h-full min-w-[100vw] bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/reddog_parallax.svg')`,
            transform: `translateX(-${offset}px)`,
            transition: "transform 0.1s ease-out",
          }}
        ></div>

        {/* Overlay Putih Transparan */}
        <div className="absolute inset-0 w-full h-full bg-white/30"></div>
      </div>

      {/* Teks di atas Parallax */}
      <div className="absolute inset-0 flex flex-col items-start justify-center text-white text-left bg-black/40 backdrop-blur-sm pl-10">
        <h1 className="text-6xl font-extrabold tracking-widest drop-shadow-lg animate-fadeIn text-red-500">
          REDDOG
        </h1>
        <h2 className="text-4xl font-bold mt-2 animate-slideUp text-[#2B2D4E]">
          Korean Snack & Topokki
        </h2>
      </div>
    </div>
  );
}
