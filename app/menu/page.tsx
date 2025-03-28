"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import MenuCard from "@/components/Menu/MenuCard";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

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
  const { getTotalItems } = useCart();

  // Categories to display
  const categories = [
    { key: 'combo', label: 'Combo' },
    { key: 'topokki', label: 'Topokki' },
    { key: 'korean snack', label: 'Korean Snack' },
    { key: 'minuman', label: 'Minuman' }
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
  }, []);

  // Filter menus by category
  const getMenusByCategory = (category: string) => {
    return menus.filter(menu => 
      menu.category.toLowerCase() === category.toLowerCase()
    );
  };

  // Helper function to render a menu section
  const renderMenuSection = (title: string, items: MenuType[], categoryKey: string) => (
    <div key={categoryKey} className="mb-12">
      <h2 className="text-3xl font-bold text-navy mb-6 pb-2 border-b-2 border-gray-200">
        {title}
      </h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((menu) => (
            <MenuCard key={menu.id} {...menu} />
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">Menu {title.toLowerCase()} tidak tersedia.</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-600">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col py-10 px-4">
      <h1 className="text-4xl font-extrabold text-red-500 mb-6 self-center">Menu Reddog</h1>
  
      <div className="w-full max-w-6xl self-center">
        {categories.map((category) => {
          const categoryMenus = getMenusByCategory(category.key);
          
          return categoryMenus.length > 0 ? (
            renderMenuSection(category.label, categoryMenus, category.key)
          ) : null;
        })}
      </div>
  
      {/* Floating Cart Button */}
      {typeof window !== "undefined" && getTotalItems() > 0 && (
        <Link href="/cart">
          <button className="fixed bottom-6 right-6 bg-navy text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition">
            Cart ({getTotalItems()})
          </button>
        </Link>
      )}
    </div>
  );
}