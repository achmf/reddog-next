"use client";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  add_ons: any;
};

interface OrderItemsProps {
  items: OrderItem[];
  totalAmount: number;
}

export default function OrderItems({ items, totalAmount }: OrderItemsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Pesanan ({items.length})</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-start gap-4">
              <div className="bg-white rounded-lg w-12 h-12 flex-shrink-0 flex items-center justify-center border border-gray-200">
                <span className="text-sm font-semibold text-gray-900">
                  {item.quantity}x
                </span>
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-gray-900">{item.name}</h4>                <p className="text-sm text-gray-600">
                  {formatPrice(item.price)} per item
                </p>

                {/* Add-ons */}
                {item.add_ons && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {item.add_ons.freeSauce &&
                      item.add_ons.freeSauce.length > 0 && (                      <div className="bg-white px-3 py-2 rounded border border-gray-200">
                          <span className="font-medium text-gray-700">
                            Saus:
                          </span>
                          <span className="text-gray-600 ml-1">
                            {item.add_ons.freeSauce.join(", ")}
                          </span>
                        </div>
                      )}
                    {item.add_ons.topping &&
                      item.add_ons.topping.length > 0 && (
                        <div className="bg-white px-3 py-2 rounded border border-gray-200">
                          <span className="font-medium text-gray-700">
                            Topping:
                          </span>
                          <span className="text-gray-600 ml-1">
                            {item.add_ons.topping.join(", ")}
                          </span>
                        </div>
                      )}
                    {item.add_ons.spicyLevel && (
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">
                        <span className="font-medium text-gray-700">
                          Level Pedas:
                        </span>
                        <span className="text-gray-600 ml-1">
                          {item.add_ons.spicyLevel}
                        </span>
                      </div>
                    )}
                    {item.add_ons.addOnToppoki &&
                      item.add_ons.addOnToppoki.length > 0 && (
                        <div className="bg-white px-3 py-2 rounded border border-gray-200">
                          <span className="font-medium text-gray-700">
                            Add-On Toppoki:
                          </span>
                          <span className="text-gray-600 ml-1">
                            {item.add_ons.addOnToppoki.join(", ")}
                          </span>
                        </div>
                      )}
                    {item.add_ons.size && (
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">
                        <span className="font-medium text-gray-700">
                          Ukuran:
                        </span>
                        <span className="text-gray-600 ml-1">
                          {item.add_ons.size}
                        </span>
                      </div>
                    )}
                    {item.add_ons.iceLevel && (
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">
                        <span className="font-medium text-gray-700">
                          Level Es:
                        </span>
                        <span className="text-gray-600 ml-1">
                          {item.add_ons.iceLevel}
                        </span>
                      </div>
                    )}
                    {item.add_ons.specialInstructions && (
                      <div className="bg-white px-3 py-2 rounded border border-gray-200 sm:col-span-2">
                        <span className="font-medium text-gray-700">
                          Catatan Khusus:
                        </span>
                        <span className="text-gray-600 ml-1">
                          {item.add_ons.specialInstructions}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>      {/* Total */}
      <div className="border-t border-gray-200 mt-6 pt-6">
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Pembayaran</span>
            <span className="text-xl font-bold">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
