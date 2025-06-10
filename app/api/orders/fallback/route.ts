import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, customerData, cartItems, outletData, totalAmount } = body

    console.log("Fallback order creation request:", { orderId, customerData, outletData })

    if (!orderId || !customerData || !cartItems || !outletData) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required data for fallback order creation" 
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("id", orderId)
      .single()

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: "Order already exists",
        order_id: orderId,
      })
    }

    // Create order with fallback method
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        outlet_id: outletData.id,
        outlet_name: outletData.name,
        total_amount: totalAmount,
        status: "paid", // Assume paid if using fallback
        payment_status: "settlement",
        buyer_name: customerData.name,        phone_number: customerData.phone || '',
        email: customerData.email || '',
        pickup_time: customerData.pickup_time || new Date().toISOString(),
        user_session_id: customerData.user_session_id || `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Privacy protection

      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`Error creating fallback order: ${orderError.message}`)
    }

    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: orderId,
      menu_id: item.menu_id || item.id?.toString() || 'unknown',
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      add_ons: item.add_ons || null,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating fallback order items:", itemsError)
      // Don't fail completely, order is created
    }

    console.log("Fallback order created successfully:", orderId)

    return NextResponse.json({
      success: true,
      message: "Fallback order created successfully",
      order_id: orderId,
      method: "fallback"
    })

  } catch (error) {
    console.error("Fallback order creation error:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
