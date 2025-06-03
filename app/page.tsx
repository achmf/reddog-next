"use client"

// Import components
import Hero from "@/components/LandingPage/Hero"
import Gallery from "@/components/LandingPage/Gallery"
import Features from "@/components/LandingPage/Features"
import Testimonials from "@/components/LandingPage/Testimonials"
import Stats from "@/components/LandingPage/Stats"
import Process from "@/components/LandingPage/Process"
import FeaturedProducts from "@/components/LandingPage/FeaturedProducts"
import Newsletter from "@/components/LandingPage/Newsletter"
import FAQ from "@/components/LandingPage/FAQ"
import CallToAction from "@/components/LandingPage/CallToAction"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-yellow-100 flex flex-col items-center overflow-hidden">
      <Hero />
      <Gallery />
      <Features />
      <Testimonials />
      <Stats />
      <Process />
      <FeaturedProducts />
      <Newsletter />
      <FAQ />
      <CallToAction />
    </div>
  )
}
