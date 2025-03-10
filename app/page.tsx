"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-6xl text-center px-6 py-20 flex flex-col items-center">
        <h1 className="text-primary text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
          Reddog: Korean Snack Heaven!
        </h1>
        <p className="text-lg text-gray-800 max-w-3xl mx-auto font-medium">
          Nikmati snack Korea autentik dengan cita rasa khas. Takeaway sekarang
          dan rasakan kelezatannya!
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/menu">
            <button className="bg-accent text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-md">
              Lihat Menu
            </button>
          </Link>
          <Link href="#features">
            <button className="bg-accent text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-md">
              Kenapa Reddog?
            </button>
          </Link>
        </div>
      </section>

      {/* Hero Image */}
      <div className="relative w-full max-w-6xl h-full overflow-hidden rounded-lg shadow-lg">
        <Image
          src="/images/reddog1.png"
          alt="Reddog Snack"
          width={1200} // Sesuaikan dengan ukuran asli gambar
          height={800} // Sesuaikan dengan ukuran asli gambar
          className="w-full h-auto transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Features Section */}
      <section
        id="features"
        className="w-full max-w-6xl px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
      >
        <div className="bg-white shadow-lg rounded-xl p-8 transition-transform duration-300 hover:scale-105">
          <h3 className="text-primary text-2xl font-semibold mb-3">
            ✨ Autentik & Lezat
          </h3>
          <p className="text-gray-700">
            Snack Korea asli dengan cita rasa khas yang bikin nagih.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-8 transition-transform duration-300 hover:scale-105">
          <h3 className="text-primary text-2xl font-semibold mb-3">
            🚀 Takeaway Mudah
          </h3>
          <p className="text-gray-700">
            Pesan online, ambil di outlet terdekat tanpa ribet.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-8 transition-transform duration-300 hover:scale-105">
          <h3 className="text-primary text-2xl font-semibold mb-3">
            🍽️ Beragam Pilihan
          </h3>
          <p className="text-gray-700">
            Dari corndog hingga tteokbokki, semua ada di sini!
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary text-white text-center py-16">
        <h2 className="text-4xl font-extrabold mb-4">Siap Pesan?</h2>
        <p className="text-lg font-medium mb-6">
          Pilih menu favoritmu dan nikmati sekarang juga!
        </p>
        <Link href="/menu">
          <button className="bg-accent text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 transition-all shadow-md">
            Pesan Sekarang
          </button>
        </Link>
      </section>
    </div>
  );
}
