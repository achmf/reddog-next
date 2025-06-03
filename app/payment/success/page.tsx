"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [isRedirecting, setIsRedirecting] = useState(true)

  useEffect(() => {
    // If we have an order ID, redirect to the order details page
    if (orderId) {
      router.push(`/orders/${orderId}`)
    } else {
      // If no order ID is provided, redirect to the order history page after a short delay
      const timer = setTimeout(() => {
        router.push("/orders")
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [orderId, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>

        {isRedirecting && (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="animate-spin h-5 w-5" />
            <span>Redirecting to order details...</span>
          </div>
        )}
      </div>
    </div>
  )
}
