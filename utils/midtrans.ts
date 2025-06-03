import { v4 as uuidv4 } from "uuid"
import type { CartItem } from "@/context/CartContext"

export const generateOrderId = () => {
  // Generate a standard UUID that will work with PostgreSQL's UUID type
  return uuidv4()
}

export const formatMidtransItems = (cartItems: CartItem[]) => {
  return cartItems.map((item) => {
    return {
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
      add_ons: item.addOns,
    }
  })
}

export const formatCustomerDetails = (buyerName: string, outletName: string) => {
  return {
    first_name: buyerName,
    last_name: "",
    email: "customer@example.com",
    phone: "08111222333",
    billing_address: {
      first_name: buyerName,
      last_name: "",
      email: "customer@example.com",
      phone: "08111222333",
      address: outletName,
    },
    shipping_address: {
      first_name: buyerName,
      last_name: "",
      email: "customer@example.com",
      phone: "08111222333",
      address: outletName,
    },
  }
}
