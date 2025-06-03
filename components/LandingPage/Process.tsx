"use client"

export default function Process() {
  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-red-500 mb-12 text-center">Cara Pesan di Reddog</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-red-200 transition-colors duration-300">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">Pilih Menu</h4>
            <p className="text-gray-600 text-sm">Lihat menu lengkap kami dan pilih Korean food favorit Anda</p>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-yellow-200 transition-colors duration-300">
                <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6.001" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">Add to Cart</h4>
            <p className="text-gray-600 text-sm">Masukkan ke keranjang dan atur jumlah sesuai keinginan</p>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-200 transition-colors duration-300">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">Bayar</h4>
            <p className="text-gray-600 text-sm">Checkout dan bayar dengan berbagai metode pembayaran</p>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors duration-300">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">Nikmati</h4>
            <p className="text-gray-600 text-sm">Tunggu pesanan fresh dari kitchen atau ambil di outlet</p>
          </div>
        </div>
      </div>
    </section>
  )
}
