"use client"

import Image from "next/image"

export default function Gallery() {
  return (
    <section className="w-full max-w-6xl py-16 px-4 flex flex-col items-center">
      <h3 className="text-3xl font-bold text-red-500 mb-8 text-center">Galeri Reddog</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        <div className="rounded-xl overflow-hidden shadow-lg group relative">
          <Image 
            src="/images/reddog1.png" 
            alt="Korean Hotdog" 
            width={400} 
            height={300} 
            className="object-cover w-full h-60 group-hover:scale-105 transition-transform duration-300" 
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-2 text-lg font-semibold">
            Korean Hotdog
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg group relative">
          <Image 
            src="/images/reddog1.png" 
            alt="Topokki" 
            width={400} 
            height={300} 
            className="object-cover w-full h-60 group-hover:scale-105 transition-transform duration-300" 
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-2 text-lg font-semibold">
            Topokki
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg group relative">
          <Image 
            src="/images/reddog1.png" 
            alt="Korean Snack" 
            width={400} 
            height={300} 
            className="object-cover w-full h-60 group-hover:scale-105 transition-transform duration-300" 
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-2 text-lg font-semibold">
            Korean Snack
          </div>
        </div>
      </div>
    </section>
  )
}
