import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderDetails } = body

    console.log("Order creation request received:", orderDetails)

    // Validate required fields
    if (!orderDetails || !orderDetails.id) {
      console.error("Missing order details or ID")
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
      console.log("Order already exists:", orderDetails.id)
      return NextResponse.json({
        success: true,
        message: "Order already exists",
        order_id: orderDetails.id,
      })
    }

    // Create the order record in Supabase
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderDetails.id,
        outlet_id: orderDetails.outlet_id,
        outlet_name: orderDetails.outlet_name,
        total_amount: orderDetails.total_amount,
        status: "paid", // Set as paid since payment is successful
        payment_status: "paid", // Track payment status separately        payment_token: orderDetails.payment_token,
        buyer_name: orderDetails.buyer_name,
        phone_number: orderDetails.phone_number,
        email: orderDetails.email,
        pickup_time: orderDetails.pickup_time,
        user_session_id: orderDetails.user_session_id || `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Privacy protection

      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      throw new Error(`Error creating order: ${orderError.message}`)
    }

    console.log("Order created successfully:", orderData)    // Create order items for each cart item
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
      throw new Error(`Error creating order items: ${itemsError.message}`)
    }

    console.log("Order items created successfully")

    // Check for any stored webhook data for this order and process it
    const { data: storedWebhooks, error: webhookFetchError } = await supabase
      .from("payment_webhooks")
      .select("*")
      .eq("order_id", orderDetails.id)
      .eq("processed", false)
      .order("created_at", { ascending: true })

    if (!webhookFetchError && storedWebhooks && storedWebhooks.length > 0) {
      console.log(`Found ${storedWebhooks.length} stored webhooks for order ${orderDetails.id}`)
      
      // Process the latest webhook to update order status
      const latestWebhook = storedWebhooks[storedWebhooks.length - 1]
      const { transaction_status, fraud_status } = latestWebhook.webhook_data
      
      let finalStatus = "paid" // Default to paid since we're creating after successful payment
      let finalPaymentStatus = transaction_status
      
      if (transaction_status === "settlement" || 
          (transaction_status === "capture" && fraud_status === "accept")) {
        finalStatus = "paid"
        finalPaymentStatus = "settlement"
      } else if (transaction_status === "pending") {
        finalStatus = "pending"
        finalPaymentStatus = "pending"
      } else if (transaction_status === "deny" || 
                 transaction_status === "cancel" || 
                 transaction_status === "expire") {
        finalStatus = "canceled"
        finalPaymentStatus = transaction_status
      }
      
      // Update order status based on webhook
      const { error: statusUpdateError } = await supabase
        .from("orders")
        .update({ 
          status: finalStatus,
          payment_status: finalPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderDetails.id)

      if (statusUpdateError) {
        console.error("Error updating order status from webhook:", statusUpdateError)
      } else {
        console.log(`Order ${orderDetails.id} status updated to ${finalStatus} based on webhook`)
      }
      
      // Mark webhooks as processed
      const { error: markProcessedError } = await supabase
        .from("payment_webhooks")
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq("order_id", orderDetails.id)
        .eq("processed", false)

      if (markProcessedError) {
        console.error("Error marking webhooks as processed:", markProcessedError)
      } else {
        console.log(`Marked ${storedWebhooks.length} webhooks as processed for order ${orderDetails.id}`)
      }
    } else {
      console.log(`No stored webhooks found for order ${orderDetails.id}`)
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
