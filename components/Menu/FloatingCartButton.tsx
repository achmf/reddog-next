"use client"

import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useAlert } from "@/context/AlertContext"
import { ShoppingCart } from "lucide-react"

export default function FloatingCartButton() {
  const { getTotalItems, getTotalPrice } = useCart()
  const { showInfo } = useAlert()

  const totalItems = getTotalItems()

  const handleCartClick = () => {
    if (totalItems === 0) {
      showInfo("Keranjang masih kosong. Tambahkan menu terlebih dahulu!", "Keranjang Kosong")
      return
    }
    showInfo(`Menuju keranjang dengan ${totalItems} item`, "Buka Keranjang")
  }

  // Only show the button if there are items in the cart
  if (typeof window === "undefined" || totalItems === 0) {
    return null
  }

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link href="/cart">
      <button 
        onClick={handleCartClick}
        className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition flex items-center gap-2 z-50"
      >
        <ShoppingCart size={20} />
        <span>
          {totalItems} {totalItems === 1 ? "item" : "items"} | {formatPrice(getTotalPrice())}
        </span>
      </button>
    </Link>
  )
}

// This component is now replaced by CartBar and can be deleted if not used elsewhere.
