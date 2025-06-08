"use client";

import { ClipboardList, ChefHat, PackageCheck, CheckCircle } from "lucide-react";

interface OrderTrackingProps {
  status: string;
}

export default function OrderTracking({ status }: OrderTrackingProps) {
  const getTrackingStep = (status: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "paid":
        return 1;
      case "received":
      case "cooking":
        return 2;
      case "ready":
        return 3;
      case "completed":
        return 4;
      case "canceled":
        return -1;
      default:
        return 0;
    }
  };

  const trackingStep = getTrackingStep(status);
  const trackingSteps = [
    {
      title: "Pesanan Diterima",
      description: "Pesanan dan pembayaran kamu sudah diterima",
      icon: ClipboardList,
      step: 1,
    },
    {
      title: "Sedang Dimasak",
      description: "Dapur kami sedang menyiapkan makanan lezat kamu",
      icon: ChefHat,
      step: 2,
    },
    {
      title: "Siap Diambil",
      description: "Pesanan kamu sudah siap untuk diambil!",
      icon: PackageCheck,
      step: 3,
    },
    {
      title: "Pesanan Selesai",
      description: "Selamat menikmati! Terima kasih sudah memilih kami",
      icon: CheckCircle,
      step: 4,
    },
  ];

  // Don't show tracking for canceled or pending orders
  if (status === "canceled" || status === "pending") {
    return null;
  }

  return (    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress Pesanan</h2>
      
      {/* Line-based tracking */}
      <div className="relative">
        {/* Horizontal line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
        <div 
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-700"
          style={{ width: `${(trackingStep / 4) * 100}%` }}
        ></div>
        
        {/* Status points */}
        <div className="relative flex justify-between">
          {trackingSteps.map((step, index) => {
            const isCompleted = trackingStep >= step.step;
            const isCurrent = trackingStep === step.step;
            const IconComponent = step.icon;
            
            return (
              <div key={step.step} className="flex flex-col items-center">
                {/* Circle indicator */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-red-500 text-white shadow-lg shadow-green-500/25"
                      : isCurrent
                      ? "bg-blue-500 text-white animate-pulse shadow-lg shadow-blue-500/25"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                
                {/* Status text */}
                <div className="text-center mt-3 max-w-[120px]">
                  <h3
                    className={`text-sm font-medium mb-1 ${
                      isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-xs ${
                      isCompleted || isCurrent ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
