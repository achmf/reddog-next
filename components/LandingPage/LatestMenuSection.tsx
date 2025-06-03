"use client";
import { useEffect, useState } from "react";
import MenuCard from "@/components/Menu/MenuCard";
import { createClient } from "@/utils/supabase/client";

type MenuType = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: "makanan" | "minuman";
};

export default function LatestMenuSection() {
  const [latestMenus, setLatestMenus] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestMenus = async () => {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("menus")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching latest menus:", error);
      } else {
        setLatestMenus(data as MenuType[]);
      }

      setLoading(false);
    };

    fetchLatestMenus();
  }, []);

  return (
    <div className="w-full max-w-6xl py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Our Menu</h2>
      {loading ? (
        <p className="text-lg text-gray-600 text-center">Loading latest menus...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {latestMenus.length > 0 ? (
            latestMenus.map((menu) => <MenuCard key={menu.id} {...menu} />)
          ) : (
            <p className="text-lg text-gray-600 text-center">No menus available.</p>
          )}
        </div>
      )}
    </div>
  );
}