"use client";

import { MapPin, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface PickupInfoProps {
  outletName: string;
  pickupTime: string;
}

export default function PickupInfo({ outletName, pickupTime }: PickupInfoProps) {  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, d MMMM yyyy 'jam' H:mm", { locale: id });
  };

  const pickupTimeDate = new Date(pickupTime);
  const isPastPickupTime = new Date() > pickupTimeDate;
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Info Pengambilan</h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-gray-400 mt-1" />
          <div>
            <div className="text-xs text-gray-500">Lokasi Ambil</div>
            <div className="font-medium text-gray-900">
              {outletName}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="h-4 w-4 text-gray-400 mt-1" />
          <div>
            <div className="text-xs text-gray-500">Waktu Ambil</div>
            <div className="font-medium text-gray-900">
              {formatDate(pickupTime)}
            </div>
            {isPastPickupTime && (
              <div className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded inline-flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Waktu ambil sudah terlewat
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
