"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user);
    };

    fetchUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

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

        {/* User Authentication Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary text-white flex items-center justify-center rounded-full">
                    {user.user_metadata?.full_name?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <button className="px-4 py-2 bg-[#cc140e] text-white font-medium rounded-lg border border-primary hover:text-primary hover:bg-white transition-all">
                  Login
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
