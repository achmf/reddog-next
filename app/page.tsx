"use client";
import Hero from "@/components/LandingPage/Hero";
import WelcomeSection from "@/components/LandingPage/WelcomeSection";
import LatestMenusSection from "@/components/LandingPage/LatestMenuSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center overflow-hidden">
      <Hero />
      <WelcomeSection />
      <LatestMenusSection />
    </div>
  );
}