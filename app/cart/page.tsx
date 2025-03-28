"use client";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const handleCheckout = () => {
    alert("Checkout functionality to be implemented");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Keranjang Anda kosong</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow p-4 space-y-4 w-full">
        {cart.map((item) => (
          <div 
            key={item.id} 
            className="bg-white w-full rounded-lg shadow-md p-4 flex items-center"
          >
            <button 
              onClick={() => removeFromCart(item.id)}
              className="mr-4 text-red-500"
            >
              <Trash2 size={20} />
            </button>
            
            <Image 
              src={item.image} 
              alt={item.name} 
              width={100} 
              height={100} 
              className="rounded-lg mr-4"
            />
            
            <div className="flex-grow">
              <h2 className="text-black font-bold text-lg">{item.name}</h2>
              <p className="text-gray-500 text-sm">
                {item.description || 'No description available'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-black text-lg font-bold">Rp{item.price}</span>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold w-12 flex items-center justify-center"
                >
                  -
                </button>
                <div className="w-8 text-center text-lg font-bold text-black">
                  {item.quantity}
                </div>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-lg font-bold w-12 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 w-full flex justify-between items-center">
        <span className="text-lg font-bold">Rp{getTotalPrice().toLocaleString()}</span>
        <button
          onClick={handleCheckout}
          className="bg-navy text-white px-6 py-2 rounded-lg font-bold"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}