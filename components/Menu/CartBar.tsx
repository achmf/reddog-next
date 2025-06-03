"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartBar() {
  const { getTotalItems, getTotalPrice, cart } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Only show if there are items in the cart
  if (typeof window === "undefined" || totalItems === 0) {
    return null;
  }

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Show up to 2 items' names, then "+N more" if more
  const itemNames = cart.slice(0, 2).map((item) => item.name).join(", ");
  const moreCount = cart.length > 2 ? ` +${cart.length - 2} more` : "";
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50 animate-slideUp">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Cart Info */}
        <div className="flex items-center gap-4">
          {/* Cart Icon with Badge */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-red-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
              🛒
            </div>
            <div className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
              {totalItems}
            </div>
          </div>
          
          {/* Cart Details */}
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-lg">
              {totalItems} Item{totalItems > 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm max-w-[200px] truncate">
                {itemNames}{moreCount}
              </span>
              <span className="text-gray-300">•</span>
              <span className="font-bold text-primary text-lg">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href="/cart">
          <button className="bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2">
            <span>Lihat Keranjang</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}
