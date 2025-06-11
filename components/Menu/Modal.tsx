"use client"

import type React from "react"
import { type FC, useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useAlert } from "@/context/AlertContext"
import { Sparkles, Flame, Plus, Droplets, Coffee, Snowflake, FileText, Hash } from "lucide-react"
import ConfirmDialog from "@/components/ConfirmDialog"

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
  const { showWarning, showInfo } = useAlert()
  const [freeSauce, setFreeSauce] = useState<string[]>([])
  const [topping, setTopping] = useState<string[]>([])
  const [spicyLevel, setSpicyLevel] = useState<string>("")
  const [addOnToppoki, setAddOnToppoki] = useState<string[]>([])
  const [size, setSize] = useState<string>("")
  const [iceLevel, setIceLevel] = useState<string>("")
  const [specialInstructions, setSpecialInstructions] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

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
    
    // Show warning outside of state setter
    if (!topping.includes(value) && topping.length >= 2) {
      showWarning("Maksimal 2 topping yang bisa dipilih", "Batas Topping")
    }
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

  const handleCancelModal = () => {
    // Cek apakah ada perubahan yang belum disimpan
    const hasChanges = freeSauce.length > 0 || topping.length > 0 || spicyLevel || 
                      addOnToppoki.length > 0 || size || iceLevel || 
                      specialInstructions.trim() || quantity > 1

    if (hasChanges) {
      setShowCancelDialog(true)
    } else {
      closeModal()
    }
  }

  const confirmCancelModal = () => {
    closeModal()
    showInfo("Kustomisasi dibatalkan", "Dibatalkan")
    setShowCancelDialog(false)
  }

  const handleIncreaseQuantity = () => setQuantity((prev) => prev + 1)
  const handleDecreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
  
  const handleAddToCart = () => {
    // Validasi minimal untuk kategori tertentu
    if (category.toLowerCase() === 'minuman' && !iceLevel) {
      showWarning("Pilih level es untuk minuman", "Pilihan Belum Lengkap")
      return
    }
    
    if (quantity < 1) {
      showWarning("Jumlah pesanan minimal 1", "Kuantitas Tidak Valid")
      return
    }

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
    
    const addOnsSelected = []
    if (freeSauce.length > 0) addOnsSelected.push(`${freeSauce.length} saus`)
    if (topping.length > 0) addOnsSelected.push(`${topping.length} topping`)
    if (spicyLevel) addOnsSelected.push(`level ${spicyLevel}`)
    
    if (addOnsSelected.length > 0) {
      showInfo(`Item berhasil dikustomisasi dengan ${addOnsSelected.join(', ')}`, "Kustomisasi Berhasil")
    }
  }

  const renderOptionCard = (
    title: string, 
    options: string[], 
    selectedValues: string[] | string, 
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    isMultiple = true, 
    IconComponent?: React.ComponentType<{ className?: string }>
  ) => (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-primary/30 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-4">
        {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
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

  return createPortal(
    <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-[9999] p-4">
      <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-primary to-red-600 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Sesuaikan Pesanan Kamu</h2>
              <p className="text-white/90 text-sm">Tambahin topping dan catatan khusus sesuai selera kamu</p>
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
                  "Topping",
                  ["Gula", "Bubuk Keju", "Bubuk Cabe"],
                  topping,
                  handleToppingChange,
                  true,
                  Sparkles
                )}
              </div>
            )}

            {/* Topokki Category */}
            {category === "topokki" && (
              <div className="space-y-6">
                {renderOptionCard(
                  "Level Pedas",
                  ["Normal", "Pedas", "Bomb!!!"],
                  spicyLevel,
                  handleSpicyLevelChange,
                  false,
                  Flame
                )}
                {renderOptionCard(
                  "Tambahan Toppoki",
                  ["Extra Mozarella", "Sosis", "Odeng"],
                  addOnToppoki,
                  handleAddOnToppokiChange,
                  true,
                  Plus
                )}
              </div>
            )}

            {/* Korean Snack Category */}
            {category === "korean snack" && (
              <div className="space-y-6">
                {renderOptionCard(
                  "Saus Gratis (Maks 2)",
                  ["Honey Mustard", "Saus Rahasia", "Keju Cheddar", "Keju Mayo", "Saus Tomat", "Saus Sambal"],
                  freeSauce,
                  handleFreeSauceChange,
                  true,
                  Droplets
                )}
                {renderOptionCard(
                  "Topping (Maks 2)",
                  ["Gula", "Bubuk Keju", "Bubuk Cabe"],
                  topping,
                  handleToppingChange,
                  true,
                  Sparkles
                )}
              </div>
            )}

            {/* Beverages Category */}
            {category === "minuman" && (
              <div className="space-y-6">
                {renderOptionCard(
                  "Ukuran",
                  ["Medium", "Large"],
                  size,
                  handleSizeChange,
                  false,
                  Coffee
                )}
                {renderOptionCard(
                  "Level Es",
                  ["Normal", "Tanpa Es"],
                  iceLevel,
                  handleIceLevelChange,
                  false,
                  Snowflake
                )}
              </div>
            )}

            {/* Special Instructions */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Catatan Khusus <span className="text-gray-500 text-sm font-normal">(opsional)</span>
                </h3>
              </div>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Misalnya: 'Extra pedas', 'Tanpa bawang', 'Keju extra'..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 resize-none h-24"
                maxLength={200}
              />
              <div className="text-right text-xs text-gray-400 mt-2">
                {specialInstructions.length}/200 karakter
              </div>
            </div>            {/* Quantity Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Hash className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800">Jumlah</h3>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 border border-red-200">
                  <button 
                    onClick={handleDecreaseQuantity} 
                    className="text-red-500 hover:text-red-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="font-semibold text-gray-800 min-w-[24px] text-center text-xl">{quantity}</span>
                  <button 
                    onClick={handleIncreaseQuantity} 
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-4">
            <button 
              onClick={handleCancelModal} 
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg transition-colors duration-200"
            >
              Batal
            </button>
            <button 
              onClick={handleAddToCart} 
              className="flex-1 bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Masukkan Keranjang ({quantity} {quantity === 1 ? 'item' : 'item'})
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancelModal}
        title="Batalkan Kustomisasi"
        message="Apakah Anda yakin ingin membatalkan kustomisasi ini? Semua pilihan add-on yang telah dipilih akan hilang."
        confirmText="Ya, Batalkan"
        cancelText="Tidak, Lanjutkan Edit"
        type="warning"
      />
    </div>,
    document.body
  )
}

export default Modal