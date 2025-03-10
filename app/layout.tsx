import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar"; // Import Navbar
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
          <main className="min-h-screen flex flex-col items-center">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="flex flex-col w-full max-w-6xl p-6">{children}</div>

            {/* Footer */}
            <footer className="w-full flex items-center justify-center border-t bg-white text-center text-sm py-6">
              <p className="text-gray-600">© 2024 Reddog. All Rights Reserved.</p>
            </footer>
          </main>
      </body>
    </html>
  );
}
