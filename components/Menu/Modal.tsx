"use client"

import type React from "react"
import { type FC, useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

type ModalProps = {
  isOpen: boolean
  closeModal: () => void
  handleAddOns: (addOns: {
    freeSauce: string[]
    topping: string[]
    specialInstructions: string
    quantity: number
    spicyLevel?: string
    addOnToppoki?: string[]
    size?: string
    iceLevel?: string
  }) => void
  category: string
}

const Modal: FC<ModalProps> = ({ isOpen, closeModal, handleAddOns, category }) => {
  const [isClient, setIsClient] = useState(false)
  const [freeSauce, setFreeSauce] = useState<string[]>([])
  const [topping, setTopping] = useState<string[]>([])
  const [spicyLevel, setSpicyLevel] = useState<string>("")
  const [addOnToppoki, setAddOnToppoki] = useState<string[]>([])
  const [size, setSize] = useState<string>("")
  const [iceLevel, setIceLevel] = useState<string>("")
  const [specialInstructions, setSpecialInstructions] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isOpen, closeModal])

  // ...existing handlers...
  const handleFreeSauceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFreeSauce((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value)
      }
      if (prev.length < 2) {
        return [...prev, value]
      }
      return prev
    })
  }

  const handleToppingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTopping((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value)
      }
      if (prev.length < 2) {
        return [...prev, value]
      }
      return prev
    })
  }

  const handleSpicyLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSpicyLevel((prev) => (prev === value ? "" : value))
  }

  const handleAddOnToppokiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAddOnToppoki((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value)
      }
      return [...prev, value]
    })
  }

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSize((prev) => (prev === value ? "" : value))
  }

  const handleIceLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setIceLevel((prev) => (prev === value ? "" : value))
  }

  const handleIncreaseQuantity = () => setQuantity((prev) => prev + 1)
  const handleDecreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev))

  const handleAddToCart = () => {
    handleAddOns({
      freeSauce,
      topping,
      specialInstructions,
      quantity,
      spicyLevel,
      addOnToppoki,
      size,
      iceLevel,
    })
    closeModal()
  }

  // ...existing renderOptionCard function...
  const renderOptionCard = (
    title: string, 
    options: string[], 
    selectedValues: string[] | string, 
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    isMultiple = true, 
    icon?: string
  ) => (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-primary/30 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-4">
        {icon && <span className="text-2xl">{icon}</span>}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = isMultiple 
            ? Array.isArray(selectedValues) && selectedValues.includes(option)
            : selectedValues === option
          
          return (
            <label
              key={option}
              className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                value={option}
                onChange={handleChange}
                checked={isSelected}
                className="absolute opacity-0"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors duration-200 ${
                isSelected 
                  ? 'border-primary bg-primary' 
                  : 'border-gray-300'
              }`}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                {option}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )

  if (!isClient || !isOpen) return null

  // Use createPortal to render modal at document.body level
  return createPortal(
    <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-[9999] p-4">
      <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-primary to-red-600 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Customize Your Order</h2>
              <p className="text-white/90 text-sm">Add your favorite add-ons and special instructions</p>
            </div>
            <button 
              onClick={closeModal}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="p-6 space-y-6">
            
            {/* Combo Category */}
            {category === "combo" && (
              <div className="space-y-6">
                {renderOptionCard(
                  "Toppings",
                  ["Sugar", "Cheese Powder", "Chili Powder"],
                  topping,
                  handleToppingChange,
                  true,
                  "🧂"
                )}
              </div>
            )}

            {/* Topokki Category */}
            {category === "topokki" && (
              <div className="space-y-6">
                {renderOptionCard(
                  "Spicy Level",
                  ["Normal", "Spicy", "Bomb!!!"],
                  spicyLevel,
                  handleSpicyLevelChange,
                  false,
                  "🌶️"
                )}
                {renderOptionCard(
                  "Add-On Toppoki",
                  ["Extra Mozarella", "Sosis/Sausage", "Odeng"],
                  addOnToppoki,
                  handleAddOnToppokiChange,
                  true,
                  "🧀"
                )}
              </div>
            )}

            {/* Korean Snack Category */}
            {category === "korean snack" && (
              <div className="space-y-6">
                {renderOptionCard(
                  "Free Sauce (Max 2)",
                  ["Honey Mustard", "Secret Sauce", "Cheddar Cheese", "Cheese Mayo", "Tomato Sauce", "Chili Sauce"],
                  freeSauce,
                  handleFreeSauceChange,
                  true,
                  "🥫"
                )}
                {renderOptionCard(
                  "Toppings (Max 2)",
                  ["Sugar", "Cheese Powder", "Chile Powder"],
                  topping,
                  handleToppingChange,
                  true,
                  "🧂"
                )}
              </div>
            )}

            {/* Beverages Category */}
            {category === "minuman" && (
              <div className="space-y-6">
                {renderOptionCard(
                  "Size",
                  ["Medium", "Large"],
                  size,
                  handleSizeChange,
                  false,
                  "🥤"
                )}
                {renderOptionCard(
                  "Ice Level",
                  ["Normal", "No Ice"],
                  iceLevel,
                  handleIceLevelChange,
                  false,
                  "🧊"
                )}
              </div>
            )}

            {/* Special Instructions */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📝</span>
                <h3 className="text-lg font-semibold text-gray-800">
                  Special Instructions <span className="text-gray-500 text-sm font-normal">(optional)</span>
                </h3>
              </div>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="For example: 'Extra spicy', 'No onions', 'Extra cheese'..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 resize-none h-24"
                maxLength={200}
              />
              <div className="text-right text-xs text-gray-400 mt-2">
                {specialInstructions.length}/200 characters
              </div>
            </div>

            {/* Quantity Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl"></span>
                <h3 className="text-lg font-semibold text-gray-800">Quantity</h3>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={handleDecreaseQuantity} 
                  className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <div className="bg-white border-2 border-gray-200 rounded-lg px-6 py-3 min-w-[80px] text-center">
                  <span className="text-2xl font-bold text-gray-800">{quantity}</span>
                </div>
                <button 
                  onClick={handleIncreaseQuantity} 
                  className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-4">
            <button 
              onClick={closeModal} 
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddToCart} 
              className="flex-1 bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Add to Cart ({quantity} {quantity === 1 ? 'item' : 'items'})
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal