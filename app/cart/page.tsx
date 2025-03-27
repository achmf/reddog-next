"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type CartItemType = {
  id: string;
  name: string;
  price: string;
  quantity: number;
};

export default function CartPage() {
  const { clearCart, getTotalPrice } = useCart();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Fetch cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
    
    // Calculate total price with explicit type annotations
    const total = storedCart.reduce((acc: number, item: CartItemType) => 
      acc + (parseFloat(item.price) * item.quantity), 0
    );
    setTotalPrice(total);
  }, []);

  const handleCheckout = () => {
    alert("Checkout successful!");
    localStorage.removeItem("cart");
    clearCart();
    setCartItems([]);
    setTotalPrice(0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/menu">
          <button className="bg-red-500 text-white px-6 py-3 rounded-md">
            Back to Menu
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold text-red-500 mb-6">Order Summary</h1>
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        {/* Order Items Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Your Items</h2>
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="flex justify-between items-center border-b py-4"
            >
              <div className="flex-grow">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  Price: Rp{item.price} x {item.quantity}
                </p>
              </div>
              <div className="font-bold">
                Rp{(parseFloat(item.price) * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown Section */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-lg">Subtotal</span>
            <span className="text-lg font-bold">
              Rp{totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg">Tax (10%)</span>
            <span className="text-lg font-bold">
              Rp{(totalPrice * 0.1).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-t pt-4">
            <span className="text-2xl font-bold">Total</span>
            <span className="text-2xl font-bold text-red-500">
              Rp{(totalPrice * 1.1).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="mt-6 w-full bg-green-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-600 transition"
        >
          Complete Order
        </button>
      </div>
    </div>
  );
}