import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, orderDetails } = body

    console.log("Ensuring order exists for ID:", orderId)

    // Create a new Supabase client
    const supabase = await createClient()

    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .single()

    if (existingOrder) {
      console.log("Order already exists:", orderId)
      return NextResponse.json({
        success: true,
        message: "Order already exists",
        order_id: orderId,
        exists: true,
        status: existingOrder.status
      })
    }

    // If orderDetails provided, create the order
    if (orderDetails) {
      console.log("Creating order from provided details:", orderId)
      
      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          id: orderDetails.id,
          outlet_id: orderDetails.outlet_id,
          outlet_name: orderDetails.outlet_name,
          total_amount: orderDetails.total_amount,
          status: "paid",
          payment_status: "settlement",
          payment_token: orderDetails.payment_token,
          buyer_name: orderDetails.buyer_name,          phone_number: orderDetails.phone_number,
          email: orderDetails.email,
          pickup_time: orderDetails.pickup_time,
          user_session_id: orderDetails.user_session_id || `ensure_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Privacy protection
        })
        .select()
        .single()

      if (orderError) {
        console.error("Error creating order:", orderError)
        return NextResponse.json({
          success: false,
          message: `Error creating order: ${orderError.message}`,
          exists: false
        }, { status: 500 })
      }

      // Create order items
      if (orderDetails.items && orderDetails.items.length > 0) {
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
          console.error("Error creating order items:", itemsError)
          // Don't fail completely, order is created
        }
      }

      console.log("Order created successfully:", orderId)
      return NextResponse.json({
        success: true,
        message: "Order created successfully",
        order_id: orderId,
        exists: false,
        status: "paid"
      })
    } else {
      // No order details provided, just check existence
      console.log("No order details provided, order doesn't exist:", orderId)
      return NextResponse.json({
        success: false,
        message: "Order not found and no details provided to create it",
        order_id: orderId,
        exists: false
      }, { status: 404 })
    }

  } catch (error) {
    console.error("Error in ensure order:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error",
        exists: false
      },
      { status: 500 }
    )
  }
}
