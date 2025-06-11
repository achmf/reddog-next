"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAlert } from "@/context/AlertContext"
import Link from "next/link"

export default function PaymentFailedPage() {
  const router = useRouter()
  const { showError, showInfo } = useAlert()

  useEffect(() => {
    showError("Pembayaran gagal atau dibatalkan. Silakan coba lagi.", "Pembayaran Gagal")
    showInfo("Keranjang belanja masih tersimpan jika ingin mencoba lagi", "Info")
  }, [showError, showInfo])

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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Gagal</h1>
        <p className="text-gray-600 mb-6">
          Pembayaran tidak dapat diproses. Silakan coba lagi atau hubungi customer service jika masalah berlanjut.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cart">
            <button className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition w-full">
              Kembali ke Keranjang
            </button>
          </Link>
          <Link href="/menu">
            <button className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-500 hover:text-white transition w-full">
              Lihat Menu
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
