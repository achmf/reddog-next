import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderDetails } = body

    // Validate required fields
    if (!orderDetails || !orderDetails.id) {
      return NextResponse.json({ success: false, message: "Missing order details" }, { status: 400 })
    }

    // Create a new Supabase client
    const supabase = await createClient()

    // Check if order already exists to prevent duplicate creation
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("id", orderDetails.id)
      .single()

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: "Order already exists",
        order_id: orderDetails.id,
      })
    }    // Create the order record in Supabase
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderDetails.id,
        outlet_id: orderDetails.outlet_id,
        outlet_name: orderDetails.outlet_name,
        total_amount: orderDetails.total_amount,
        status: "received", // Set as received since payment is successful and order is ready for processing
        payment_status: "paid", // Track payment status separately
        payment_token: orderDetails.payment_token,
        buyer_name: orderDetails.buyer_name,
        phone_number: orderDetails.phone_number,
        email: orderDetails.email,
        pickup_time: orderDetails.pickup_time,
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`Error creating order: ${orderError.message}`)
    }

    // Create order items for each cart item
    const orderItems = orderDetails.items.map((item: any) => ({
      order_id: orderDetails.id,
      menu_id: item.menu_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      add_ons: item.add_ons,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw new Error(`Error creating order items: ${itemsError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order_id: orderDetails.id,
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
