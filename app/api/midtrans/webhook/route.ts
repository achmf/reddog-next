import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import midtransClient from "midtrans-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Webhook received:", body)    // Extract notification data directly from body
    const orderId = body.order_id
    const transactionStatus = body.transaction_status
    const fraudStatus = body.fraud_status

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`)

    // Create a new Supabase client
    const supabase = await createClient()

    // Check if order exists
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .single()

    // Determine the order status based on Midtrans transaction status
    let orderStatus = "pending"

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept") {
        orderStatus = "paid"
      }
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      orderStatus = "failed"
    } else if (transactionStatus === "pending") {
      orderStatus = "pending"
    }

    if (existingOrder) {
      // Order exists, update the status
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: orderStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId)

      if (error) {
        throw new Error(`Error updating order status: ${error.message}`)
      }

      console.log(`Order ${orderId} status updated to ${orderStatus}`)
    } else {
      // Order doesn't exist yet - this is expected in the new secure flow
      // We'll just log this and return success, as the order will be created by the client
      console.log(`Order ${orderId} not found in database. This is expected for the new secure payment flow.`)
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
