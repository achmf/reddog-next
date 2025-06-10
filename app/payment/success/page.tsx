"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [isRedirecting, setIsRedirecting] = useState(true)
  const [isCheckingOrder, setIsCheckingOrder] = useState(false)

  useEffect(() => {
    const handleRedirect = async () => {
      if (orderId) {
        console.log("Payment success - checking order:", orderId)
        setIsCheckingOrder(true)
        
        // Wait a moment for the order to be created
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Check if order exists in database
        try {
          const response = await fetch(`/api/payment/status?order_id=${orderId}`)
          const data = await response.json()
          
          if (data.success && data.order_exists) {
            console.log("Order found in database, redirecting to order details")
            router.push(`/orders/${orderId}`)
          } else {
            console.log("Order not found in database, redirecting to orders list")
            router.push("/orders")
          }
        } catch (error) {
          console.error("Error checking order status:", error)
          router.push(`/orders/${orderId}`) // Try anyway
        }
        
        setIsCheckingOrder(false)
      } else {
        // If no order ID is provided, redirect to the order history page after a short delay
        const timer = setTimeout(() => {
          router.push("/orders")
        }, 3000)

        return () => clearTimeout(timer)
      }
    }

    handleRedirect()
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

        {(isRedirecting || isCheckingOrder) && (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="animate-spin h-5 w-5" />
            <span>
              {isCheckingOrder ? "Checking order status..." : "Redirecting to order details..."}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
