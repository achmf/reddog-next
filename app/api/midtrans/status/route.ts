import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, transaction_status, fraud_status } = body

    // Create a new Supabase client - properly awaited
    const supabase = await createClient()

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

    // Update the order status in Supabase
    const { error } = await supabase.from("orders").update({ status: orderStatus }).eq("id", order_id)

    if (error) {
      throw new Error(`Error updating order status: ${error.message}`)
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
