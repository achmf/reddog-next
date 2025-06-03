"use client"

export default function Stats() {
  return (
    <section className="w-full max-w-6xl py-16 px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-red-500 mb-2">10K+</div>
          <div className="text-gray-600">Happy Customers</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-red-500 mb-2">25+</div>
          <div className="text-gray-600">Menu Varieties</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-red-500 mb-2">5⭐</div>
          <div className="text-gray-600">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-red-500 mb-2">2Y+</div>
          <div className="text-gray-600">Serving You</div>
        </div>
      </div>
    </section>
  )
}
