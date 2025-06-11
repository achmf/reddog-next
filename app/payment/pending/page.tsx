"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAlert } from "@/context/AlertContext"
import { Loader2 } from "lucide-react"

export default function PaymentPendingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const { showInfo, showError, showWarning } = useAlert()
  const [isChecking, setIsChecking] = useState(true)
  const [checkAttempts, setCheckAttempts] = useState(0)

  useEffect(() => {    const checkPaymentStatus = async () => {
      if (!orderId) {
        showWarning("Order ID tidak ditemukan. Anda akan diarahkan ke halaman pesanan.", "Order ID Tidak Valid")
        setTimeout(() => router.push("/orders"), 3000)
        return
      }

      try {
        setIsChecking(true)
        
        // Check payment status from Midtrans
        const response = await fetch(`/api/payment/status?order_id=${orderId}`)
        const data = await response.json()
        
        console.log("Payment status check:", data)
        
        if (data.success && data.midtrans_status) {
          const { transaction_status, fraud_status } = data.midtrans_status
          
          // Check if payment is successful
          if (transaction_status === "settlement" || 
              (transaction_status === "capture" && fraud_status === "accept")) {
            
            console.log("Payment successful, checking if order exists in database")
            showInfo("Pembayaran berhasil! Mengarahkan ke halaman sukses...", "Pembayaran Berhasil")
            
            // Check if order exists in our database
            if (!data.order_exists) {
              console.log("Payment successful but order not found in database - will be handled by success page")
            }
            
            // Payment successful - redirect to success page
            router.push(`/payment/success?order_id=${orderId}`)
            return
          } else if (transaction_status === "deny" || 
                     transaction_status === "cancel" || 
                     transaction_status === "expire") {
            // Payment failed - redirect to failed page
            showError("Pembayaran gagal atau dibatalkan", "Pembayaran Gagal")
            router.push("/payment/failed")
            return
          }
        }
        
        // If still pending and we haven't tried too many times, try again
        if (checkAttempts < 10) {
          setCheckAttempts(prev => prev + 1)
          setTimeout(() => checkPaymentStatus(), 3000) // Check again in 3 seconds
        } else {
          // Too many attempts, redirect to orders page
          router.push("/orders")
        }
        
      } catch (error) {
        console.error("Error checking payment status:", error)
        if (checkAttempts < 5) {
          setCheckAttempts(prev => prev + 1)
          setTimeout(() => checkPaymentStatus(), 3000)
        } else {
          router.push("/orders")
        }
      } finally {
        setIsChecking(false)
      }
    }

    checkPaymentStatus()
  }, [orderId, router, checkAttempts])

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
        <p className="text-gray-600 mb-6">
          Your payment is being processed. We're checking the status...
        </p>

        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="animate-spin h-5 w-5" />
          <span>
            {isChecking ? "Checking payment status..." : "Redirecting..."}
          </span>
        </div>
        
        {checkAttempts > 3 && (
          <p className="text-sm text-gray-500 mt-4">
            This is taking longer than usual. Please wait...
          </p>
        )}
      </div>
    </div>
  )
}