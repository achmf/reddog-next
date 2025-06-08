"use client";

import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface OrderHeaderProps {
  orderId: string;
  createdAt: string;
  status: string;
}

export default function OrderHeader({ orderId, createdAt, status }: OrderHeaderProps) {  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, d MMMM yyyy 'pukul' HH:mm", { locale: id });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {      case "paid":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
          text: "Pembayaran Dikonfirmasi",
        };
      case "received":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          text: "Pesanan Diterima",
        };
      case "cooking":
        return {
          color: "bg-orange-100 text-orange-800",
          icon: <Clock className="h-5 w-5 text-orange-500" />,
          text: "Sedang Dimasak",
        };
      case "ready":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          text: "Siap Diambil",
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          text: "Pesanan Selesai",
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          text: "Menunggu Pembayaran",
        };
      case "canceled":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          text: "Pesanan Dibatalkan",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
          text: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            Pesanan #{orderId.substring(0, 8)}...
          </h1>
          <p className="text-sm text-gray-600">
            Dibuat pada {formatDate(createdAt)}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${statusInfo.color} w-fit`}
        >
          {statusInfo.icon}
          <span>{statusInfo.text}</span>
        </div>
      </div>
    </div>
  );
}
