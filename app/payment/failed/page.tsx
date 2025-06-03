"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function PaymentFailedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. Please try again or contact customer support.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cart">
            <button className="bg-navy text-white px-6 py-2 rounded-full hover:bg-red-600 transition w-full">
              Return to Cart
            </button>
          </Link>
          <Link href="/menu">
            <button className="border border-navy text-navy px-6 py-2 rounded-full hover:bg-navy hover:text-white transition w-full">
              Browse Menu
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
