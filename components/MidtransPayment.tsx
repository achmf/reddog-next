"use client"

import { useEffect, useRef } from "react"
import { useAlert } from "@/context/AlertContext"

interface MidtransPaymentProps {
  token: string
  onClose: () => void
  onSuccess: () => void
  onError: (error: any) => void
  onPending: () => void
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void
      embed: (token: string, options: any) => void
    }
  }
}

const MidtransPayment = ({ token, onClose, onSuccess, onError, onPending }: MidtransPaymentProps) => {
  const snapContainerRef = useRef<HTMLDivElement>(null)
  const { showWarning, showError } = useAlert()

  useEffect(() => {
    // Load the Snap.js library
    const script = document.createElement("script")
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js"
    script.setAttribute("data-client-key", "SB-Mid-client-wNIhXjTXVqUH5NY4")
    script.async = true

    const handleScriptLoad = () => {
      if (window.snap && token) {
        window.snap.pay(token, {
          onSuccess: () => {
            onSuccess()
          },
          onPending: () => {
            onPending()
          },
          onError: (error: any) => {
            onError(error)
          },
          onClose: () => {
            showWarning("Pembayaran dibatalkan. Pesanan belum diproses.", "Pembayaran Dibatalkan")
            onClose()
          },
        })
      }
    }

    script.addEventListener("load", handleScriptLoad)
    document.body.appendChild(script)

    return () => {
      script.removeEventListener("load", handleScriptLoad)
      document.body.removeChild(script)
    }
  }, [token, onClose, onSuccess, onError, onPending])

  return <div ref={snapContainerRef} id="snap-container"></div>
}

export default MidtransPayment
