import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Verify signature (important for security)
    const signature = request.headers.get("x-signature")
    if (signature) {
      const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-TvttKE1eMdnC4ZWlEVclI8V-"
      const hash = crypto
        .createHash("sha512")
        .update(`${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`)
        .digest("hex")
      
      if (hash !== signature) {
        console.log("Invalid signature")
        return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
      }
    }

    const { order_id, transaction_status, payment_type, fraud_status } = body
    console.log(`Webhook received for order ${order_id}: ${transaction_status}`)

    const supabase = await createClient()

    // Map Midtrans status to our order status
    let orderStatus = "pending"
    if (transaction_status === "settlement" || transaction_status === "capture") {
      orderStatus = fraud_status === "accept" ? "paid" : "pending"
    } else if (transaction_status === "pending") {
      orderStatus = "pending"
    } else if (transaction_status === "deny" || transaction_status === "cancel" || transaction_status === "expire") {
      orderStatus = "canceled"
    }

    // Try to update existing order
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", order_id)
      .single()

    if (existingOrder) {
      // Update existing order
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: orderStatus,
          payment_status: transaction_status,
          updated_at: new Date().toISOString()
        })
        .eq("id", order_id)

      if (updateError) {
        console.error("Error updating order:", updateError)
        return NextResponse.json({ message: "Error updating order" }, { status: 500 })
      }

      console.log(`Order ${order_id} updated to status: ${orderStatus}`)    } else {
      // Order doesn't exist yet - store webhook data temporarily for later processing
      console.log(`Order ${order_id} not found in database, storing webhook data for later processing`)
      
      // Store webhook data in payment_webhooks table
      const { error: webhookError } = await supabase
        .from("payment_webhooks")
        .insert({
          order_id: order_id,
          transaction_status: transaction_status,
          payment_type: payment_type || null,
          fraud_status: fraud_status || null,
          gross_amount: body.gross_amount || 0,
          webhook_data: body,
          processed: false
        })

      if (webhookError) {
        console.error("Error storing webhook data:", webhookError)
        // Don't fail the webhook response, just log the error
      } else {
        console.log(`Webhook data stored for order ${order_id}, will be processed when order is created`)
      }
    }

    return NextResponse.json({ message: "OK" })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}