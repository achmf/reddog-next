"use client"

import Link from "next/link"

export default function CallToAction() {
  return (
    <section className="w-full py-12 flex flex-col items-center bg-gradient-to-r from-red-200 via-yellow-100 to-white">
      <h3 className="text-2xl font-bold text-red-600 mb-4">Pesan Sekarang & Nikmati Promo Spesial!</h3>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-xl">
        Dapatkan diskon dan penawaran menarik setiap minggu. Pesan sekarang dan rasakan sensasi Korean street food terbaik di kotamu!
      </p>
      <Link href="/menu">
        <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all animate-bounce">
          Pesan Sekarang
        </button>
      </Link>
    </section>
  )
}
