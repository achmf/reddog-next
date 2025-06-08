"use client";

interface OrderActionsProps {
  canCancel: boolean;
  isPastPickupTime: boolean;
  cancelLoading: boolean;
  onCancelOrder: () => void;
}

export default function OrderActions({ 
  canCancel, 
  isPastPickupTime, 
  cancelLoading, 
  onCancelOrder 
}: OrderActionsProps) {
  if (!canCancel || isPastPickupTime) {
    return null;
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Pesanan</h3>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-700 font-medium mb-2">
          Batalkan pesanan ini?
        </p>
        <p className="text-red-600 text-sm">
          Kamu bisa batalkan pesanan sebelum waktu ambil. Aksi ini 
          tidak bisa dibatalkan lagi.
        </p>
      </div>
      <button
        onClick={onCancelOrder}
        disabled={cancelLoading}
        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto font-medium"
      >
        {cancelLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Memproses...
          </>
        ) : (
          <>Batalkan Pesanan</>
        )}
      </button>
    </div>
  );
}
