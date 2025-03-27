import Image from "next/image";
import { useCart } from "@/context/CartContext";

type MenuCardProps = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
};

export default function MenuCard({ id, name, price, image, category, description }: MenuCardProps) {
  const { addToCart, updateQuantity, cart } = useCart();

  const cartItem = cart.find((item) => item.id === id);

  const handleAddToCart = () => {
    addToCart({ id, name, price, quantity: 1 });
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(id, cartItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(id, cartItem.quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full flex flex-col h-full">
      <div className="relative w-full pt-[100%]">
        <Image
          src={image}
          alt={name}
          fill
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-2 min-h-[2.75rem] text-black">{name}</h3>
        
        {description && (
          <p className="text-sm text-gray-500 mb-2 min-h-[2.75rem] line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="mt-auto">
          {cartItem ? (
            <div className="flex flex-col">
              <div className="text-lg font-bold self-end mb-2 text-black">Rp{price}</div>
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={handleDecreaseQuantity}
                  className="bg-navy text-white px-4 py-2 rounded-lg text-lg font-bold w-12 flex items-center justify-center"
                >
                  -
                </button>
                <div className="w-8 text-center text-lg font-bold">
                  {cartItem.quantity}
                </div>
                <button
                  onClick={handleIncreaseQuantity}
                  className="bg-navy text-white px-4 py-2 rounded-lg text-lg font-bold w-12 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="text-lg font-bold self-end mb-2 text-black">Rp{price}</div>
              <button
                onClick={handleAddToCart}
                className="bg-navy text-white w-full py-2 rounded-lg text-lg font-bold flex items-center justify-center"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}