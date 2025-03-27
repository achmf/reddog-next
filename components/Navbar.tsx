import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-gray-200 h-16 bg-white shadow-sm">
      <div className="w-full max-w-6xl flex justify-between items-center px-4 text-lg font-semibold">
        {/* Logo & Navigasi Kiri */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/images/reddog_logo.png"
              alt="Reddog Logo"
              width={40} // Sesuaikan ukuran logo
              height={40} // Sesuaikan ukuran logo
              className="h-auto w-auto"
            />
          </Link>

          {/* Navigasi Utama */}
          <div className="flex items-center gap-6">
            <Link href="/menu" className="text-gray-700 hover:text-primary transition-colors">
              Menu
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary transition-colors">
              Tentang
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary transition-colors">
              Kontak
            </Link>
          </div>
        </div>

        {/* Tombol Login & Register */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:text-primary transition-all">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-80 transition-all">
              Register
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
