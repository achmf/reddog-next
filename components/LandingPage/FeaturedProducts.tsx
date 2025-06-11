"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export default function FeaturedProducts() {
  const router = useRouter()

  const handleOrderClick = () => {
    router.push("/menu")
  }
  return (
    <section className="w-full max-w-6xl py-16 px-4">
      <h3 className="text-3xl font-bold text-red-500 mb-12 text-center">Menu Terpopuler</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="relative overflow-hidden">
            <Image 
              src="/images/korean-hotdog-special.webp" 
              alt="Korean Hotdog Special" 
              width={400} 
              height={250} 
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
            />
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              Best Seller
            </div>
          </div>
          <div className="p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Korean Hotdog Special</h4>
            <p className="text-gray-600 mb-4">Hotdog Korea dengan cheese mozzarella yang melimpah dan saus spesial</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-red-500">Rp 25.000</span>
              <button 
                onClick={handleOrderClick}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Pesan
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="relative overflow-hidden">
            <Image 
              src="/images/topokki.jpg" 
              alt="Topokki Original" 
              width={400} 
              height={250} 
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
            />
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              Popular
            </div>
          </div>
          <div className="p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Topokki Original</h4>
            <p className="text-gray-600 mb-4">Rice cake Korea dengan saus gochujang otentik yang pedas manis</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-red-500">Rp 20.000</span>
              <button 
                onClick={handleOrderClick}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Pesan
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="relative overflow-hidden">
            <Image 
              src="/images/korean-snack-combo.jpg" 
              alt="Korean Snack Combo" 
              width={400} 
              height={250} 
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
            />
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              New
            </div>
          </div>
          <div className="p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Korean Snack Combo</h4>
            <p className="text-gray-600 mb-4">Kombinasi berbagai snack Korea dalam satu paket hemat</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-red-500">Rp 35.000</span>
              <button 
                onClick={handleOrderClick}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Pesan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
