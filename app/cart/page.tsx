"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { ArrowLeft, Trash2, Search, MapPin, ChevronDown, ChevronUp, X } from "lucide-react"
import MidtransPayment from "@/components/MidtransPayment"
import { generateOrderId, formatMidtransItems, formatCustomerDetails } from "@/utils/midtrans"
import { supabase } from "@/utils/supabase/supabaseClient"  // Make sure to import supabase client

// Define outlet type
type Outlet = {
  id: string
  name: string
  address: string
  city: string
}

export default function CartPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null)
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [paymentToken, setPaymentToken] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [buyerName, setBuyerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [isAttemptedCheckout, setIsAttemptedCheckout] = useState(false)
  const [outlets, setOutlets] = useState<Outlet[]>([])  // State for storing fetched outlets
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch outlets data from Supabase
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const { data, error } = await supabase.from('outlets').select('*')
        if (error) throw error
        setOutlets(data || [])
      } catch (err) {
        console.error("Error fetching outlets:", err)
        setError("Failed to fetch outlets data")
      } finally {
        setLoading(false)
      }
    }
    fetchOutlets()
  }, [])

  // Get minimum pickup time (current time + 30 minutes)
  const getMinPickupTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 30) // Add 30 minutes to current time
    return now.toISOString().slice(0, 16) // Format as YYYY-MM-DDTHH:MM
  }

  // Filter outlets based on search query
  const filteredOutlets = outlets.filter(
    (outlet) =>
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Close dropdown when clicking outside
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

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = async () => {
    setIsAttemptedCheckout(true)

    if (!selectedOutlet) {
      alert("Please select an outlet for pickup")
      return
    }

    if (!buyerName) {
      alert("Please enter your name")
      return
    }

    if (!phoneNumber) {
      alert("Please enter your phone number")
      return
    }

    if (!email) {
      alert("Please enter your email")
      return
    }

    if (!pickupTime) {
      alert("Please select a pickup time")
      return
    }

    setIsCheckingOut(true)

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
          outletId: selectedOutlet.id,
          outletName: selectedOutlet.name,
          buyerName: buyerName,
          phoneNumber: phoneNumber,
          email: email,
          pickupTime: new Date(pickupTime).toISOString(),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to create payment")
      }

      // Set the payment token to trigger the Midtrans Snap popup
      setPaymentToken(data.token)
    } catch (error) {
      console.error("Checkout error:", error)
      setIsCheckingOut(false)
      alert(`Error placing order: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handlePaymentClose = () => {
    setPaymentToken(null)
    setIsCheckingOut(false)
  }

  const handlePaymentSuccess = () => {
    clearCart()
    if (orderId) {
      router.push(`/orders/${orderId}`)
    } else {
      router.push("/payment/success")
    }
  }

  const handlePaymentPending = () => {
    clearCart()
    if (orderId) {
      router.push(`/orders/${orderId}`)
    } else {
      router.push("/payment/pending")
    }
  }

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error)
    setPaymentToken(null)
    setIsCheckingOut(false)
    router.push("/payment/failed")
  }

  const handleSelectOutlet = (outlet: Outlet) => {
    setSelectedOutlet(outlet)
    setIsOutletDropdownOpen(false)
    setSearchQuery("")
  }

  const handleClearOutlet = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedOutlet(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-red-400 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-red-500">Loading outlets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-yellow-100 flex items-center justify-center">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-yellow-100 flex flex-col items-center justify-center py-10 px-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any delicious items to your cart yet. Let's change that!</p>
          <Link href="/menu">
            <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 font-semibold">
              <ArrowLeft size={20} />
              Browse Our Menu
            </button>
          </Link>
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">Your Cart</h1>
              <p className="text-gray-600">Review your delicious selections and checkout</p>
            </div>
            <Link href="/menu">
              <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 font-semibold">
                <ArrowLeft size={20} />
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🍽️ Your Items ({cart.length})
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
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-full transition-all duration-300"
                          aria-label="Remove item"
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
                📝 Order Summary
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
                  👤 Customer Information
                </h3>

                {/* Buyer's Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 border ${!buyerName && isAttemptedCheckout ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
                    required
                  />
                  {!buyerName && isAttemptedCheckout && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      ⚠️ Please enter your full name
                    </p>
                  )}
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number (e.g., +62812345678)"
                    className={`w-full px-4 py-3 border ${!phoneNumber && isAttemptedCheckout ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
                    required
                  />
                  {!phoneNumber && isAttemptedCheckout && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      ⚠️ Please enter your phone number
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 border ${!email && isAttemptedCheckout ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
                    required
                  />
                  {!email && isAttemptedCheckout && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      ⚠️ Please enter your email address
                    </p>
                  )}
                </div>
              </div>

              {/* Pickup Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  📍 Pickup Information
                </h3>

                {/* Outlet Selection Dropdown */}
                <div ref={dropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Pickup Outlet *</label>
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
                            aria-label="Clear selection"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 flex items-center gap-2">
                          <MapPin size={16} />
                          Select a pickup outlet
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
                              placeholder="Search outlets..."
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
                              <div className="text-2xl mb-2">🔍</div>
                              No outlets found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {!selectedOutlet && isAttemptedCheckout && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      ⚠️ Please select an outlet for pickup
                    </p>
                  )}
                </div>

                {/* Pickup Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time *</label>
                  <input
                    type="datetime-local"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    min={getMinPickupTime()}
                    className={`w-full px-4 py-3 border ${!pickupTime && isAttemptedCheckout ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300`}
                    required
                  />
                  {!pickupTime && isAttemptedCheckout && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      ⚠️ Please select a pickup time
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    ⏰ Pickup time must be at least 30 minutes from now
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
                      Processing...
                    </>
                  ) : (
                    <>
                      💳 Pay Now - {formatPrice(getTotalPrice())}
                    </>
                  )}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full border-2 border-red-300 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 hover:border-red-400 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  🗑️ Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-red-100">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">🔒 Secure Payment</h3>
            <p className="text-gray-600 text-sm">Your payment information is processed securely through Midtrans. We never store your payment details.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
