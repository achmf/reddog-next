"use client"

import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative w-full h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden">
      <Image
        src="/images/reddog_parallax.svg"
        alt="Reddog Parallax"
        fill
        className="object-cover object-center opacity-80 animate-fadeIn"
        priority
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-widest drop-shadow-lg animate-fadeIn text-red-500 mb-4">
          REDDOG
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold animate-slideUp text-[#2B2D4E] mb-6">
          Korean Snack & Topokki
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl animate-fadeIn delay-200 mb-8">
          Nikmati sensasi Korean Hotdog, Topokki, dan snack Korea lainnya dengan cita rasa otentik, fresh from the kitchen, dan harga terjangkau. Pesan online, ambil di outlet, atau delivery ke rumah!
        </p>
        <Link href="/menu">
          <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all animate-bounce">
            Lihat Menu
          </button>
        </Link>
      </div>
      <div className="absolute inset-0 bg-black/20 z-0" />
    </section>
  )
}
