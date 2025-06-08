"use client";

import Link from "next/link";
import { CheckCircle, XCircle, Utensils } from "lucide-react";

interface OrderStatusNoticeProps {
  status: string;
}

export default function OrderStatusNotice({ status }: OrderStatusNoticeProps) {
  if (status === "canceled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-red-500" />        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Pesanan ini sudah dibatalkan
        </h3>
        <p className="text-red-600 mb-6">
          Kalau kamu masih mau pesan item yang sama, yuk buat pesanan baru dari menu kami.
        </p>
        <Link href="/menu">
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium inline-flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Lihat Menu Lagi
          </button>
        </Link>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-500" />        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Pesanan Selesai!
        </h3>
        <p className="text-green-600 mb-6">
          Terima kasih sudah memilih kami! Semoga kamu menikmati makanannya.
        </p>
        <Link href="/menu">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:green-700 transition-colors font-medium inline-flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Pesan Lagi
          </button>
        </Link>
      </div>
    );
  }

  return null;
}
