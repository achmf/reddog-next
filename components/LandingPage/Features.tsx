"use client"

export default function Features() {
  return (
    <section className="w-full max-w-6xl py-16 px-4 flex flex-col items-center">
      <h3 className="text-3xl font-bold text-red-500 mb-8 text-center">Kenapa Memilih Reddog?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center transform hover:-translate-y-2">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">Cepat & Fresh</h4>
          <p className="text-gray-600">Dibuat fresh dari kitchen dengan proses cepat untuk menjaga kualitas dan rasa otentik</p>
        </div>
        <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center transform hover:-translate-y-2">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">Harga Terjangkau</h4>
          <p className="text-gray-600">Nikmati rasa premium dengan harga yang ramah di kantong untuk semua kalangan</p>
        </div>
        <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center transform hover:-translate-y-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">Delivery Anywhere</h4>
          <p className="text-gray-600">Pesan kapan saja, di mana saja. Kami siap mengantarkan kelezatan Korea ke rumah Anda</p>
        </div>
      </div>
    </section>
  )
}
