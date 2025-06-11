"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface Testimonial {
  name: string;
  location: string;
  text: string;
  image: string;
  rating: number;
  order: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Ayu Putri",
    location: "Jakarta",
    text: "Reddog's Korean Hotdog is the best! The cheese pull is amazing and the taste is authentic. I've been ordering here for months and never disappointed!",
    image: "/images/profile.png",
    rating: 5,
    order: "Korean Hotdog Cheese"
  },
  {
    name: "Budi Santoso",
    location: "Bandung", 
    text: "Topokki-nya lembut dan sausnya mantap! Pesan online gampang banget. Harga juga masih terjangkau untuk kualitas sebagus ini.",
    image: "/images/profile.png",
    rating: 5,
    order: "Topokki Original"
  },
  {
    name: "Siti Nurhaliza",
    location: "Surabaya",
    text: "Snack Korea favorit keluarga! Anak-anak suka banget hotdognya. Fresh from kitchen dan packaging-nya juga rapi.",
    image: "/images/profile.png",
    rating: 4,
    order: "Korean Snack Combo"
  },
  {
    name: "Dian Kristiawan", 
    location: "Yogyakarta",
    text: "Pelayanan cepat dan rasa authentic Korean! Suka banget sama mozarella hotdog-nya. Definitely will order again!",
    image: "/images/profile.png",
    rating: 5,
    order: "Mozarella Hotdog"
  }
];

export default function Testimonials() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  // Auto slide testimonials
  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoSlide]);

  return (
    <section className="w-full bg-gradient-to-r from-red-50 via-white to-yellow-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-red-500 mb-12 text-center">Apa Kata Mereka?</h3>
        <div className="relative">
          {/* Main testimonial card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mx-auto max-w-4xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Customer image and info */}
                <div className="flex-shrink-0 text-center">
                  <div className="flex flex-col items-center">
                    <Image 
                      src={testimonials[testimonialIdx].image} 
                      alt={testimonials[testimonialIdx].name} 
                      width={80} 
                      height={80} 
                      className="rounded-full border-4 border-red-200 shadow-lg mb-4"
                    />
                    <h4 className="font-bold text-lg text-gray-800">{testimonials[testimonialIdx].name}</h4>
                    <p className="text-red-500 font-medium">{testimonials[testimonialIdx].location}</p>
                    <div className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600 mt-2 text-center">
                      Ordered: {testimonials[testimonialIdx].order}
                    </div>
                  </div>
                </div>
                
                {/* Testimonial content */}
                <div className="flex-1">
                  <div className="relative">
                    <svg className="absolute -top-4 -left-4 w-8 h-8 text-red-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                    <p className="text-lg text-gray-700 italic leading-relaxed pl-8">
                      "{testimonials[testimonialIdx].text}"
                    </p>
                  </div>
                  
                  {/* Star rating */}
                  <div className="flex gap-1 mt-4 pl-8">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < testimonials[testimonialIdx].rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="bg-white hover:bg-red-50 border border-red-200 rounded-full p-3 shadow-md transition-all hover:shadow-lg"
              onMouseEnter={() => setAutoSlide(false)}
              onMouseLeave={() => setAutoSlide(true)}
            >
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex gap-2 items-center">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === testimonialIdx ? "bg-red-500 w-8" : "bg-gray-300 hover:bg-red-300"
                  }`}
                  onClick={() => {
                    setTestimonialIdx(idx);
                    setAutoSlide(false);
                    setTimeout(() => setAutoSlide(true), 2000);
                  }}
                  aria-label={`Testimonial ${idx + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setTestimonialIdx((prev) => (prev + 1) % testimonials.length)}
              className="bg-white hover:bg-red-50 border border-red-200 rounded-full p-3 shadow-md transition-all hover:shadow-lg"
              onMouseEnter={() => setAutoSlide(false)}
              onMouseLeave={() => setAutoSlide(true)}
            >
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
