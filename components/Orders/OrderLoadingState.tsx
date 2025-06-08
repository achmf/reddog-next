"use client";

import { Loader2 } from "lucide-react";

export default function OrderLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-secondary">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-primary via-red-600 to-primary py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
            Menu <span className="text-accent">Reddog</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 animate-slideUp opacity-90">
            Jelajahi kelezatan autentik Korea dengan berbagai pilihan menu spesial
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 right-20 w-20 h-20 border-4 border-accent/30 rounded-full animate-float"></div>
        <div
          className="absolute bottom-10 left-20 w-16 h-16 border-4 border-white/30 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </section>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-10">        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail pesanan...</p>
        </div>
      </div>
    </div>
  );
}
