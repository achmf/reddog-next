import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, transaction_status, fraud_status } = body

    // Create a new Supabase client - properly awaited
    const supabase = await createClient()

    // Check if order exists
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", order_id)
      .single()

    // Determine the order status based on Midtrans transaction status
    let orderStatus = "pending"

    if (transaction_status === "capture" || transaction_status === "settlement") {
      if (fraud_status === "accept") {
        orderStatus = "paid"
      }
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      orderStatus = "failed"
    } else if (transaction_status === "pending") {
      orderStatus = "pending"
    }

    if (existingOrder) {
      // Order exists, just update the status
      const { error } = await supabase.from("orders").update({ status: orderStatus }).eq("id", order_id)

      if (error) {
        throw new Error(`Error updating order status: ${error.message}`)
      }
    } else {
      // Order doesn't exist yet (webhook came before client-side creation)
      // This could happen in rare cases where webhook is faster than client
      console.log(`Order ${order_id} not found in database. This is expected for the new secure payment flow.`)
      
      // We'll not create the order here since we don't have the full order details
      // The order should be created by the client after successful payment
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
    })
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
