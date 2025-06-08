"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import MenuSection from "@/components/Menu/MenuSection";
import CartBar from "@/components/Menu/CartBar";
import MenuCardSkeleton from "@/components/Menu/MenuCardSkeleton";
import dynamic from "next/dynamic";
import Image from "next/image";

const Loading = dynamic(() => import("../loading"), { ssr: false });

type MenuType = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
};

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Categories to display with icons and descriptions
  const categories = [
    {
      key: "combo",
      label: "Combo",
      icon: "🍱",
      description: "Paket hemat dengan berbagai pilihan",
      color: "from-red-500 to-red-500",
    },
    {
      key: "topokki",
      label: "Topokki",
      icon: "🍲",
      description: "Rice cake Korea yang pedas dan lezat",
      color: "from-red-500 to-red-500",
    },
    {
      key: "korean snack",
      label: "Korean Snack",
      icon: "🥟",
      description: "Camilan khas Korea yang autentik",
      color: "from-red-500 to-red-500",
    },
    {
      key: "minuman",
      label: "Minuman",
      icon: "🥤",
      description: "Minuman segar untuk melengkapi makanan",
      color: "from-red-500 to-red-500",
    },
  ];

  useEffect(() => {
    const fetchMenus = async () => {
      const supabase = await createClient();

      const { data, error } = await supabase.from("menus").select("*");

      if (error) {
        console.error("Error fetching menus:", error);
      } else {
        setMenus(data as MenuType[]);
      }

      setLoading(false);
    };

    fetchMenus();
  }, []); // Filter menus by category and search query
  const getMenusByCategory = (category: string) => {
    let filtered = menus;

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(
        (menu) => menu.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (menu) =>
          menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (menu.description &&
            menu.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredMenus = getMenusByCategory(activeCategory);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-secondary">
        {/* Hero Section Skeleton */}
        <section className="relative w-full bg-gradient-to-r from-primary via-red-600 to-primary py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
            <div className="h-16 bg-white/20 rounded-lg mx-auto mb-4 animate-pulse max-w-md"></div>
            <div className="h-8 bg-white/10 rounded mx-auto mb-8 animate-pulse max-w-2xl"></div>
          </div>
        </section>

        {/* Content Skeleton */}
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          {/* Search Bar Skeleton */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          {/* Category Buttons Skeleton */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 w-32 bg-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
          </div>

          {/* Menu Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <MenuCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-secondary">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-primary via-red-600 to-primary py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
            Menu <span className="text-accent">Reddog</span>
          </h1>{" "}
          <p className="text-xl md:text-2xl font-medium mb-8 animate-slideUp opacity-90">
            Jelajahi kelezatan autentik Korea dengan berbagai pilihan menu
            spesial
          </p>
        </div>
        {/* Decorative elements - positioned away from text */}
        <div className="absolute top-10 right-20 w-20 h-20 border-4 border-accent/30 rounded-full animate-float"></div>
        <div
          className="absolute bottom-10 left-20 w-16 h-16 border-4 border-white/30 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </section>
      {/* Search Bar */}
      <section className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari menu favorit Anda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-md hover:shadow-lg bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </section>
      {/* Category Filter */}
      <section className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeCategory === "all"
                ? "bg-primary text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
            }`}
          >
            🍽️ Semua Menu
          </button>
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.key
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              }`}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
      </section>{" "}
      {/* Menu Content */}
      <div className="w-full max-w-6xl mx-auto px-4 pb-20">
        {/* Results Info */}
        {searchQuery && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              {filteredMenus.length > 0
                ? `Ditemukan ${filteredMenus.length} menu untuk "${searchQuery}"`
                : `Tidak ada menu yang ditemukan untuk "${searchQuery}"`}
            </p>
          </div>
        )}

        {activeCategory === "all" && !searchQuery
          ? // Show all categories when no search query
            categories.map((category) => {
              const categoryMenus = getMenusByCategory(category.key);
              return categoryMenus.length > 0 ? (
                <MenuSection
                  key={category.key}
                  title={category.label}
                  items={categoryMenus}
                  icon={category.icon}
                  description={category.description}
                  color={category.color}
                />
              ) : null;
            })
          : // Show filtered results
            (() => {
              if (filteredMenus.length > 0) {
                const currentCategory = categories.find(
                  (cat) => cat.key === activeCategory
                );
                return (
                  <MenuSection
                    title={
                      searchQuery
                        ? `Hasil Pencarian`
                        : currentCategory?.label || "Menu"
                    }
                    items={filteredMenus}
                    icon={searchQuery ? "🔍" : currentCategory?.icon}
                    description={
                      searchQuery
                        ? `Menampilkan hasil untuk "${searchQuery}"`
                        : currentCategory?.description
                    }
                    color={
                      currentCategory?.color || "from-gray-400 to-gray-600"
                    }
                  />
                );
              } else {
                return (
                  <div className="text-center py-20 animate-fadeIn">
                    <div className="text-8xl mb-6">😔</div>
                    <h3 className="text-3xl font-bold text-gray-600 mb-4">
                      {searchQuery
                        ? "Menu Tidak Ditemukan"
                        : "Menu Tidak Tersedia"}
                    </h3>
                    <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                      {searchQuery
                        ? `Maaf, tidak ada menu yang cocok dengan pencarian "${searchQuery}". Coba kata kunci lain.`
                        : "Menu untuk kategori ini sedang tidak tersedia."}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300"
                      >
                        Hapus Pencarian
                      </button>
                    )}
                  </div>
                );
              }
            })()}
      </div>{" "}
      {/* CartBar */}
      <CartBar />
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 bg-primary hover:bg-red-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-40 animate-fadeIn"
        >
          <svg
            className="w-6 h-6"
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
      )}
    </div>
  );
}
