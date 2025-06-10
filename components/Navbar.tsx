"use client";

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
              width={40}
              height={40}
              className="h-auto w-auto"
            />
          </Link>

          {/* Navigasi Utama */}
          <div className="flex items-center gap-6">
            <Link
              href="/menu"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Menu
            </Link>

            <Link
              href="/orders"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Pesanan
            </Link>
          </div>
        </div>

        {/* Right side - dapat ditambahkan konten lain jika diperlukan */}
        <div className="flex items-center gap-4">
          {/* Space for future features */}
        </div>
      </div>
    </nav>
  );
}
