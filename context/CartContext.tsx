"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the type for cart item
export type CartItem = {
  id: string
  name: string
  price: string
  quantity: number
  image: string
  description?: string
  addOns?: {
    freeSauce: string[]
    topping: string[]
    specialInstructions: string
    quantity: number
    spicyLevel?: string
    addOnToppoki?: string[]
    size?: string
    iceLevel?: string
  }
}

// Define the type for cart context
type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on the client
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  // Function to save cart to localStorage
  const saveCartToLocalStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  // Add item to cart
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      let updatedCart
      if (existingItem) {
        // If item exists, update quantity and add-ons
        updatedCart = prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: item.quantity || 1,
                addOns: item.addOns || { freeSauce: [], topping: [], specialInstructions: "", quantity: 1 },
              } // Ensure addOns has the required structure
            : cartItem,
        )
      } else {
        // If item doesn't exist, add with quantity 1 and add-ons
        updatedCart = [
          ...prevCart,
          {
            ...item,
            quantity: item.quantity || 1,
            addOns: item.addOns || { freeSauce: [], topping: [], specialInstructions: "", quantity: 1 },
          },
        ]
      }
      saveCartToLocalStorage(updatedCart)
      return updatedCart
    })
  }

  // Remove item from cart
  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    saveCartToLocalStorage(updatedCart)
  }

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove the item if quantity is 0 or less
      const updatedCart = cart.filter((item) => item.id !== id)
      saveCartToLocalStorage(updatedCart)
    } else {
      const updatedCart = cart.map((item) => (item.id === id ? { ...item, quantity } : item))
      saveCartToLocalStorage(updatedCart)
    }
  }

  // Clear the cart
  const clearCart = () => {
    saveCartToLocalStorage([])
  }

  // Get total items in the cart
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Get total price of the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + Number.parseFloat(item.price) * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
