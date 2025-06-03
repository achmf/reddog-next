"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Loader2, Clock, MapPin, ChevronRight, CheckCircle, XCircle, AlertTriangle, Package } from "lucide-react"

type Order = {
  id: string
  outlet_name: string
  total_amount: number
  status: string
  created_at: string
  buyer_name: string
  pickup_time: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setOrders(data || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [supabase])

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Get status badge color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "paid":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Payment Confirmed",
        }
      case "received":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-4 w-4" />,
          text: "Order Received",
        }
      case "cooking":
        return {
          color: "bg-orange-100 text-orange-800",
          icon: <Clock className="h-4 w-4" />,
          text: "Preparing Order",
        }
      case "ready":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Ready to Pickup",
        }
      case "completed":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Order Completed",
        }
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-4 w-4" />,
          text: "Pending Payment",
        }
      case "canceled":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-4 w-4" />,
          text: "Order Canceled",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertTriangle className="h-4 w-4" />,
          text: status.charAt(0).toUpperCase() + status.slice(1),
        }
    }
  }

  // Format pickup time
  const formatPickupTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-secondary">
        {/* Hero Section Skeleton */}
        <section className="relative w-full bg-gradient-to-r from-primary via-red-600 to-primary py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
            <div className="h-16 bg-white/20 rounded-lg mx-auto mb-4 animate-pulse max-w-md"></div>
            <div className="h-8 bg-white/10 rounded mx-auto mb-8 animate-pulse max-w-2xl"></div>
          </div>
        </section>

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-4 border-red-400 border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-red-500">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-secondary">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-primary via-red-600 to-primary py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
            Pesanan <span className="text-accent">Reddog</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 animate-slideUp opacity-90">
            Lacak dan kelola pesanan lezat Anda dengan mudah
          </p>
        </div>
        {/* Decorative elements - positioned away from text */}
        <div className="absolute top-10 right-20 w-20 h-20 border-4 border-accent/30 rounded-full animate-float"></div>
        <div
          className="absolute bottom-10 left-20 w-16 h-16 border-4 border-white/30 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
            <div className="text-6xl mb-6">
              <Package className="h-16 w-16 mx-auto text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start exploring our delicious menu!</p>
            <Link href="/menu">
              <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                Browse Menu
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-red-100 hover:border-red-200 transform hover:-translate-y-1"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          Order #{order.id.substring(0, 8)}...
                        </span>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-2 ${statusInfo.color}`}>
                          {statusInfo.icon}
                          {statusInfo.text}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">{formatPrice(order.total_amount)}</h3>
                      <p className="text-gray-600 mt-1">Order by: {order.buyer_name}</p>
                    </div>
                    <div className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors">
                      <ChevronRight className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-medium">Pickup Location</div>
                        <div className="text-sm text-gray-600">{order.outlet_name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-medium">Pickup Time</div>
                        <div className="text-sm text-gray-600">{formatPickupTime(order.pickup_time)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary hover:bg-red-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-40 animate-fadeIn"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
