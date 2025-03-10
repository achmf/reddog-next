import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-gray-200 h-16 bg-white shadow-sm">
      <div className="w-full max-w-6xl flex justify-between items-center p-4 text-lg font-semibold">
        <Link href="/" className="text-primary text-2xl font-bold tracking-wide">
          Reddog
        </Link>
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
    </nav>
  );
}
