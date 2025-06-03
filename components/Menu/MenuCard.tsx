"use client"

import { useState } from "react"
import Modal from "@/components/Menu/Modal"
import Image from "next/image"
import { useCart } from "@/context/CartContext"

type MenuCardProps = {
  id: string
  name: string
  price: string
  image: string
  category: string
  description?: string
}

export default function MenuCard({ id, name, price, image, category, description }: MenuCardProps) {
  const { addToCart, updateQuantity, cart } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addOns, setAddOns] = useState<{
    freeSauce: string[]
    topping: string[]
    specialInstructions: string
    quantity: number
  }>({
    freeSauce: [],
    topping: [],
    specialInstructions: "",
    quantity: 1,
  })

  const cartItem = cart.find((item) => item.id === id)

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      image,
      description,
      quantity: addOns.quantity,
      addOns: {
        freeSauce: addOns.freeSauce,
        topping: addOns.topping,
        specialInstructions: addOns.specialInstructions,
        quantity: addOns.quantity,
      },
    })
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleAddOns = (addon: {
    freeSauce: string[]
    topping: string[]
    specialInstructions: string
    quantity: number
  }) => {
    setAddOns(addon)
    handleCloseModal()

    // Add to cart after setting add-ons
    addToCart({
      id,
      name,
      price,
      image,
      description,
      quantity: addon.quantity,
      addOns: {
        freeSauce: addon.freeSauce,
        topping: addon.topping,
        specialInstructions: addon.specialInstructions,
        quantity: addon.quantity,
      },
    })
  }

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(id, cartItem.quantity + 1)
    }
  }

  const handleDecreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(id, cartItem.quantity - 1)
    }
  }
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden w-full flex flex-col h-full transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      {/* Image Container with Overlay */}
      <div className="relative w-full pt-[75%] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          Rp{price}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Action Section */}
        <div className="mt-auto">
          {cartItem ? (
            <div className="space-y-3">
              {/* Quantity Controls */}
              <div className="flex justify-center items-center bg-gray-50 rounded-xl p-2">
                <button
                  onClick={handleDecreaseQuantity}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-lg font-bold w-12 h-12 flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  −
                </button>
                <div className="text-gray-800 w-16 text-center text-xl font-bold">
                  {cartItem.quantity}
                </div>
                <button
                  onClick={handleIncreaseQuantity}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-bold w-12 h-12 flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  +
                </button>
              </div>
              
              {/* In Cart Indicator */}
              <div className="text-center">
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                  ✓ Dalam Keranjang
                </span>
              </div>
            </div>
          ) : (            <button
              onClick={handleOpenModal}
              className="group/btn bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white w-full px-4 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="transition-transform duration-300 group-hover/btn:scale-110">🛒</span>
              <span>Tambah ke Keranjang</span>
            </button>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} closeModal={handleCloseModal} handleAddOns={handleAddOns} category={category} />
    </div>
  )
}
