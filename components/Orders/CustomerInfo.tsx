"use client";

import { User, Phone, Mail } from "lucide-react";

interface CustomerInfoProps {
  buyerName: string;
  phoneNumber?: string;
  email?: string;
  orderId: string;
}

export default function CustomerInfo({ 
  buyerName, 
  phoneNumber, 
  email, 
  orderId 
}: CustomerInfoProps) {  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Info Pemesan</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-xs text-gray-500">Nama</div>
            <div className="font-medium text-gray-900">
              {buyerName}
            </div>
          </div>
        </div>

        {phoneNumber && (
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <div>
              <div className="text-xs text-gray-500">No. Telepon</div>
              <div className="font-medium text-gray-900">
                {phoneNumber}
              </div>
            </div>
          </div>
        )}

        {email && (
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-medium text-gray-900">
                {email}
              </div>
            </div>
          </div>
        )}        <div className="pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">ID Pesanan</div>
          <div className="font-mono text-sm text-gray-900">
            {orderId}
          </div>
        </div>
      </div>
    </div>
  );
}
