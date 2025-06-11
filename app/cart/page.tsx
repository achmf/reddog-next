"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { useAlert } from "@/context/AlertContext"
import { ArrowLeft, Trash2, Search, MapPin, ChevronDown, ChevronUp, X, AlertTriangle, ShoppingCart, Utensils, FileText, User, CreditCard, Lock, Clock } from "lucide-react"
import MidtransPayment from "@/components/MidtransPayment"
import { generateOrderId, formatMidtransItems, formatCustomerDetails } from "@/utils/midtrans"
import { supabase } from "@/utils/supabase/supabaseClient"  // Pastikan mengimpor supabase client
import FormAlert from "@/components/FormAlert"
import ConfirmDialog from "@/components/ConfirmDialog"

// Definisi tipe outlet
type Outlet = {
  id: string
  name: string
  address: string
  city: string
}

export default function CartPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const { showError, showWarning, showSuccess, showInfo } = useAlert()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null)
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [paymentToken, setPaymentToken] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null) // Simpan detail order sementara
  const [userSessionId, setUserSessionId] = useState<string>("") // User session untuk privacy
  const [buyerName, setBuyerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [isAttemptedCheckout, setIsAttemptedCheckout] = useState(false)
  const [outlets, setOutlets] = useState<Outlet[]>([]) // State untuk menyimpan outlet yang diambil
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showClearCartDialog, setShowClearCartDialog] = useState(false)
  const [showRemoveItemDialog, setShowRemoveItemDialog] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<{id: string, name: string} | null>(null)

  // Generate atau ambil session ID dari localStorage untuk privacy
  useEffect(() => {
    let sessionId = localStorage.getItem("user_session_id")
    if (!sessionId) {
      sessionId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("user_session_id", sessionId)
      console.log("Generated new user session ID:", sessionId)
    }
    setUserSessionId(sessionId)
  }, [])

  // Ambil data outlet dari Supabase
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const { data, error } = await supabase.from('outlets').select('*')
        if (error) throw error
        setOutlets(data || [])
      } catch (err) {
        console.error("Error fetching outlets:", err)
        setError("Gagal memuat data outlet")
      } finally {
        setLoading(false)
      }
    }
    fetchOutlets()
  }, [])

  // Dapatkan waktu pickup minimum (waktu sekarang + 30 menit)
  const getMinPickupTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 30) // Tambah 30 menit ke waktu sekarang
    return now.toISOString().slice(0, 16) // Format sebagai YYYY-MM-DDTHH:MM
  }

  // Filter outlet berdasarkan query pencarian
  const filteredOutlets = outlets.filter(
    (outlet) =>
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOutletDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Format harga ke Rupiah Indonesia
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }
  const handleCheckout = async () => {
    setIsAttemptedCheckout(true)

    // Validasi form dengan alert yang lebih user-friendly
    if (!selectedOutlet) {
      showWarning("Silakan pilih outlet untuk pickup terlebih dahulu", "Outlet Belum Dipilih")
      return
    }

    if (!buyerName.trim()) {
      showError("Nama lengkap wajib diisi untuk melanjutkan pesanan", "Nama Belum Diisi")
      return
    }

    if (!phoneNumber.trim()) {
      showError("Nomor HP diperlukan untuk konfirmasi pesanan", "Nomor HP Belum Diisi")
      return
    }

    // Validasi format nomor HP
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      showError("Format nomor HP tidak valid. Contoh: +6281234567890", "Format Nomor HP Salah")
      return
    }

    if (!email.trim()) {
      showError("Alamat email diperlukan untuk pengiriman invoice", "Email Belum Diisi")
      return
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showError("Format email tidak valid. Contoh: nama@email.com", "Format Email Salah")
      return
    }

    if (!pickupTime) {
      showError("Pilih waktu pickup yang sesuai dengan jadwal kamu", "Waktu Pickup Belum Dipilih")
      return
    }

    // Validasi waktu pickup (minimal 30 menit dari sekarang)
    const selectedTime = new Date(pickupTime)
    const minTime = new Date()
    minTime.setMinutes(minTime.getMinutes() + 30)
    
    if (selectedTime < minTime) {
      showWarning("Waktu pickup minimal 30 menit dari sekarang", "Waktu Pickup Terlalu Cepat")
      return
    }

    setIsCheckingOut(true)
    showInfo("Sedang memproses pesanan...", "Mohon Tunggu")

    try {
      // Generate a unique order ID
      const newOrderId = generateOrderId()
      setOrderId(newOrderId)

      // Format cart items for Midtrans
      const items = formatMidtransItems(cart)

      // Format customer details with buyer's name
      const customerDetails = formatCustomerDetails(buyerName, selectedOutlet.name)

      // Call the Midtrans API to create a transaction
      const response = await fetch("/api/midtrans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: newOrderId,
          amount: getTotalPrice(),
          customerDetails,
          items,
          outletId: selectedOutlet.id,          outletName: selectedOutlet.name,
          buyerName: buyerName,
          phoneNumber: phoneNumber,
          email: email,
          pickupTime: new Date(pickupTime).toISOString(),
          userSessionId: userSessionId, // Include user session for privacy
        }),      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Gagal memproses pembayaran")
      }

      // Store order details for later use when payment succeeds
      setOrderDetails(data.order_details)
      setOrderId(data.order_details.id) // Set orderId immediately from order details

      console.log("Payment token created, order details stored:", data.order_details)
      showSuccess("Pesanan berhasil dibuat! Silakan lanjutkan pembayaran", "Berhasil")

      // Set the payment token to trigger the Midtrans Snap popup
      setPaymentToken(data.token)
    } catch (error) {
      console.error("Checkout error:", error)
      setIsCheckingOut(false)
      showError(
        `${error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga"}`,
        "Gagal Memproses Pesanan"
      )
    }
  }
  const handlePaymentClose = () => {
    // Popup pembayaran ditutup - clear data sementara
    setPaymentToken(null)
    setOrderDetails(null) 
    setOrderId(null)
    setIsCheckingOut(false)
  }

  const handlePaymentSuccess = async () => {
    try {
      console.log("Payment success callback triggered")
      
      // Ensure order exists in database (either from webhook or create it now)
      if (orderDetails) {
        console.log("Ensuring order exists in database:", orderDetails.id)
        
        try {
          const response = await fetch("/api/orders/ensure", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },            body: JSON.stringify({
              orderId: orderDetails.id,
              orderDetails: {
                ...orderDetails,
                user_session_id: userSessionId // Include user session for privacy
              },
            }),
          })

          const data = await response.json()
          console.log("Order ensure response:", data)

          if (data.success) {
            console.log("Order successfully ensured in database")
          } else {
            console.error("Failed to ensure order:", data.message)
          }
        } catch (error) {
          console.error("Error ensuring order:", error)
        }
      }
      
      // Clear cart and redirect
      clearCart()
      const targetOrderId = orderDetails?.id || orderId
      console.log("Payment successful, redirecting to order:", targetOrderId)
      
      if (targetOrderId) {
        router.push(`/orders/${targetOrderId}`)
      } else {
        router.push("/payment/success")
      }
    } catch (error) {
      console.error("Error in payment success handler:", error)
      
      // Still clear cart and redirect
      clearCart()
      const targetOrderId = orderDetails?.id || orderId
      if (targetOrderId) {
        router.push(`/orders/${targetOrderId}`)
      } else {
        router.push("/payment/success")
      }
    }
  }
  const handlePaymentPending = () => {
    console.log("Payment pending callback triggered")
    
    const targetOrderId = orderDetails?.id || orderId
    console.log("Redirecting to pending page with order ID:", targetOrderId)
    
    if (targetOrderId) {
      router.push(`/payment/pending?order_id=${targetOrderId}`)
    } else {
      router.push("/payment/pending")
    }
  }

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error)
    // Clear data sementara saat error pembayaran
    setPaymentToken(null)
    setOrderDetails(null)
    setOrderId(null)
    setIsCheckingOut(false)
    router.push("/payment/failed")
  }
  const handleRemoveItem = (itemId: string, itemName: string) => {
    setItemToRemove({ id: itemId, name: itemName })
    setShowRemoveItemDialog(true)
  }

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id)
      showSuccess(`${itemToRemove.name} telah dihapus dari keranjang`, "Item Dihapus")
      setShowRemoveItemDialog(false)
      setItemToRemove(null)
    }
  }

  const handleClearOutlet = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedOutlet(null)
    showInfo("Pilihan outlet telah dihapus", "Outlet Dibersihkan")
  }

  const handleSelectOutlet = (outlet: Outlet) => {
    setSelectedOutlet(outlet)
    setIsOutletDropdownOpen(false)
    setSearchQuery("")
    showSuccess(`Outlet ${outlet.name} telah dipilih`, "Outlet Terpilih")
  }
  const handleClearCart = () => {
    if (cart.length === 0) {
      showInfo("Keranjang sudah kosong", "Keranjang Kosong")
      return
    }
    setShowClearCartDialog(true)
  }

  const confirmClearCart = () => {
    clearCart()
    showSuccess("Keranjang telah dikosongkan", "Berhasil")
    setShowClearCartDialog(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-red-400 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-red-500">Memuat outlet...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-yellow-100 flex items-center justify-center">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-red-500 mb-4 flex justify-center">
            <AlertTriangle size={64} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Ada yang salah nih</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-yellow-100 flex flex-col items-center justify-center py-10 px-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          <div className="text-red-500 mb-6 flex justify-center">
            <ShoppingCart size={80} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Keranjang Kosong Nih</h1>
          <p className="text-gray-600 mb-8">Kayaknya belum ada makanan enak yang masuk keranjang. Yuk, pilih menu favoritmu!</p>
          <div className="flex justify-center">
            <Link href="/menu">
              <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 font-semibold">
                <ArrowLeft size={20} />
                Lihat Menu Kita
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-yellow-100 flex flex-col py-10 px-4">
      {paymentToken && (
        <MidtransPayment
          token={paymentToken}
          onClose={handlePaymentClose}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onPending={handlePaymentPending}
        />
      )}

      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-red-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">Keranjang Kamu</h1>
              <p className="text-gray-600">Cek lagi pesanan kamu dan lanjut ke pembayaran yuk!</p>
            </div>
            <Link href="/menu">
              <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 font-semibold">
                <ArrowLeft size={20} />
                Lanjut Belanja
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Utensils size={24} className="text-red-500" />
                Pesanan Kamu ({cart.length})
              </h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 flex flex-col sm:flex-row gap-4 border border-red-100 hover:shadow-md transition-all duration-300">
                    {/* Item Image */}
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-red-600">{formatPrice(Number.parseFloat(item.price))}</span>
                            <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 border border-red-200">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-red-500 hover:text-red-700 font-bold text-lg"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="font-semibold text-gray-800 min-w-[24px] text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-red-500 hover:text-red-700 font-bold text-lg"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-full transition-all duration-300"
                          aria-label="Hapus item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4 border border-red-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText size={24} className="text-red-500" />
                Ringkasan Pesanan
              </h2>

              {/* Cart Summary */}
              <div className="space-y-3 mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-800">{formatPrice(Number.parseFloat(item.price) * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-red-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-800">Total</span>
                    <span className="text-red-600">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information Form */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <User size={20} className="text-red-500" />
                  Info Pelanggan
                </h3>

                {/* Buyer's Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Masukkan nama lengkap kamu"
                    className={`w-full px-4 py-3 border ${!buyerName && isAttemptedCheckout ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
                    required
                  />                  {!buyerName && isAttemptedCheckout && (
                    <FormAlert type="error" message="Jangan lupa isi nama lengkap ya" />
                  )}
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor HP *</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Masukkan nomor HP (contoh: +62812345678)"
                    className={`w-full px-4 py-3 border ${!phoneNumber && isAttemptedCheckout ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
                    required
                  />                  {!phoneNumber && isAttemptedCheckout && (
                    <FormAlert type="error" message="Nomor HP belum diisi nih" />
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan alamat email kamu"
                    className={`w-full px-4 py-3 border ${!email && isAttemptedCheckout ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
                    required
                  />                  {!email && isAttemptedCheckout && (
                    <FormAlert type="error" message="Email belum diisi ya" />
                  )}
                </div>
              </div>

              {/* Pickup Information */}
              <div className="space-y-6 mt-8">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <MapPin size={20} className="text-red-500" />
                  Info Pickup
                </h3>

                {/* Outlet Selection Dropdown */}
                <div ref={dropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Outlet Pickup *</label>
                  <div className="relative">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setIsOutletDropdownOpen(!isOutletDropdownOpen)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setIsOutletDropdownOpen(!isOutletDropdownOpen)
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 border ${!selectedOutlet && isAttemptedCheckout ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-xl bg-white text-left focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition-all duration-300 hover:border-red-300`}
                    >
                      {selectedOutlet ? (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <MapPin size={16} className="text-red-500 mr-2" />
                            <div>
                              <div className="font-medium text-gray-800">{selectedOutlet.name}</div>
                              <div className="text-sm text-gray-600">{selectedOutlet.address}</div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleClearOutlet(e)
                            }}
                            className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-100 rounded-full transition-all duration-300"
                            aria-label="Hapus pilihan"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 flex items-center gap-2">
                          <MapPin size={16} />
                          Pilih outlet pickup
                        </span>
                      )}
                      {isOutletDropdownOpen ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>

                    {isOutletDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-xl rounded-xl max-h-60 overflow-hidden border border-red-100">
                        <div className="sticky top-0 bg-white p-3 border-b border-red-100">
                          <div className="relative">
                            <Search
                              size={16}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="text"
                              placeholder="Cari outlet..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredOutlets.length > 0 ? (
                            filteredOutlets.map((outlet) => (
                              <button
                                key={outlet.id}
                                onClick={() => handleSelectOutlet(outlet)}
                                className={`w-full text-left px-4 py-3 hover:bg-red-50 border-b border-gray-100 transition-all duration-300 ${
                                  selectedOutlet?.id === outlet.id ? "bg-red-50 border-l-4 border-l-red-500" : ""
                                }`}
                              >
                                <div className="font-medium text-gray-800">{outlet.name}</div>
                                <div className="text-sm text-gray-600">{outlet.address}</div>
                                <div className="text-xs text-gray-500">{outlet.city}</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-gray-500 text-center">
                              <div className="mb-2 flex justify-center">
                                <Search size={32} className="text-gray-400" />
                              </div>
                              Tidak ada outlet ditemukan
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>                  {!selectedOutlet && isAttemptedCheckout && (
                    <FormAlert type="warning" message="Pilih outlet pickup dulu ya" />
                  )}
                </div>

                {/* Pickup Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Pickup *</label>
                  <input
                    type="datetime-local"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    min={getMinPickupTime()}
                    className={`w-full px-4 py-3 border ${!pickupTime && isAttemptedCheckout ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
                    required
                  />                  {!pickupTime && isAttemptedCheckout && (
                    <FormAlert type="warning" message="Pilih waktu pickup dulu ya" />
                  )}
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={14} />
                    Waktu pickup minimal 30 menit dari sekarang
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-6 border-t border-red-100">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className={`w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg ${
                    isCheckingOut ? "opacity-70 cursor-not-allowed" : "hover:from-red-600 hover:to-orange-600 transform hover:scale-105"
                  } transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Bayar Sekarang - {formatPrice(getTotalPrice())}
                    </>
                  )}
                </button>

                <button
                  onClick={handleClearCart}
                  className="w-full border-2 border-red-300 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 hover:border-red-400 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} />
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-red-100">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <Lock size={20} className="text-red-600" />
              Pembayaran Aman
            </h3>            <p className="text-gray-600 text-sm">Informasi pembayaran kamu diproses dengan aman melalui Midtrans. Kami tidak pernah menyimpan detail pembayaran kamu.</p>
          </div>
        </div>
      </div>

      {/* Remove Item Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRemoveItemDialog}
        onClose={() => {
          setShowRemoveItemDialog(false)
          setItemToRemove(null)
        }}
        onConfirm={confirmRemoveItem}
        title="Hapus Item dari Keranjang"
        message={`Apakah Anda yakin ingin menghapus "${itemToRemove?.name}" dari keranjang belanja?`}
        confirmText="Ya, Hapus Item"
        cancelText="Batal"
        type="warning"
      />

      {/* Clear Cart Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearCartDialog}
        onClose={() => setShowClearCartDialog(false)}
        onConfirm={confirmClearCart}
        title="Kosongkan Keranjang"
        message={`Apakah Anda yakin ingin mengosongkan seluruh keranjang belanja? Semua ${cart.length} item akan dihapus.`}
        confirmText="Ya, Kosongkan Keranjang"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}
