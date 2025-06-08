"use client";

import Link from "next/link";
import { FrownIcon, FileText } from "lucide-react";

interface OrderErrorStateProps {
  error?: string;
}

export default function OrderErrorState({ error }: OrderErrorStateProps) {
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

      <div className="flex items-center justify-center p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <FrownIcon className="h-8 w-8 text-red-500" />
          </div>          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Pesanan Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "Pesanan yang kamu cari tidak ada."}
          </p>
          <Link href="/orders">
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lihat Semua Pesanan
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
