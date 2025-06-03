import type React from "react"
import { Geist } from "next/font/google"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { CartProvider } from "@/context/CartContext" // Import CartProvider
import "./globals.css"

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
})

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <CartProvider>
          <main className="min-h-screen flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Main Content - Remove items-center and wrap directly */}
            {children}

            {/* Footer */}
            <Footer />
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
