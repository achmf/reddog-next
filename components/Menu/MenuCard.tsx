"use client"

import { useState } from "react"
import Modal from "@/components/Menu/Modal"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { useAlert } from "@/context/AlertContext"

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
  const { showSuccess, showInfo } = useAlert()
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
    showSuccess(`${name} berhasil ditambahkan ke keranjang!`, "Ditambahkan ke Keranjang")
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
    
    const addOnsText = []
    if (addon.freeSauce.length > 0) addOnsText.push(`Saus: ${addon.freeSauce.join(', ')}`)
    if (addon.topping.length > 0) addOnsText.push(`Topping: ${addon.topping.join(', ')}`)
    
    const message = `${name} (${addon.quantity}x) ditambahkan ke keranjang${addOnsText.length > 0 ? ` dengan ${addOnsText.join(' & ')}` : ''}!`
    showSuccess(message, "Ditambahkan ke Keranjang")
  }

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(id, cartItem.quantity + 1)
      showInfo(`Jumlah ${name} ditambah menjadi ${cartItem.quantity + 1}`, "Jumlah Diperbarui")
    }
  }

  const handleDecreaseQuantity = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(id, cartItem.quantity - 1)
        showInfo(`Jumlah ${name} dikurangi menjadi ${cartItem.quantity - 1}`, "Jumlah Diperbarui")
      } else {
        showInfo(`${name} akan dihapus dari keranjang jika dikurangi lagi`, "Peringatan")
      }
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
                <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 border border-red-200">
                  <button
                    onClick={handleDecreaseQuantity}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    -
                  </button>
                  <span className="font-semibold text-gray-800 min-w-[24px] text-center text-xl">{cartItem.quantity}</span>
                  <button
                    onClick={handleIncreaseQuantity}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
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
