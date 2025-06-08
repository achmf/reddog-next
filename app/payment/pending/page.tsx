"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function PaymentPendingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")

  useEffect(() => {
    // Check if order exists in database (may not exist due to new secure payment flow)
    const checkOrderStatus = async () => {
      if (orderId) {
        try {
          // Wait a bit for potential webhook processing
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Try to redirect to order details
          router.push(`/orders/${orderId}`)
        } catch (error) {
          console.error("Error checking order status:", error)
          // If there's an issue, redirect to orders page
          const timer = setTimeout(() => {
            router.push("/orders")
          }, 3000)
          return () => clearTimeout(timer)
        }
      } else {
        // If no order ID is provided, redirect to the order history page after a short delay
        const timer = setTimeout(() => {
          router.push("/orders")
        }, 3000)
        return () => clearTimeout(timer)
      }
    }

    checkOrderStatus()
  }, [orderId, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Pending</h1>
        <p className="text-gray-600 mb-6">Your payment is being processed. We'll update you once it's confirmed.</p>

        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="animate-spin h-5 w-5" />
          <span>Redirecting to order details...</span>
        </div>
      </div>
    </div>
  )
}
