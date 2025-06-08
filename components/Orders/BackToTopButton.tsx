"use client";

import { useState, useEffect } from "react";

interface BackToTopButtonProps {
  threshold?: number;
}

export default function BackToTopButton({ threshold = 400 }: BackToTopButtonProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showBackToTop) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 bg-primary hover:bg-red-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-40 animate-fadeIn"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
