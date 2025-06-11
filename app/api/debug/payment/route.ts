import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("order_id")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check payment webhooks for this order
    const { data: webhooks, error: webhookError } = await supabase
      .from("payment_webhooks")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })

    // Check if order exists
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, total_amount, payment_status")
      .eq("id", orderId)
      .single()

    return NextResponse.json({
      success: true,
      debug: {
        order_id: orderId,
        order_exists: !!order,
        order_status: order?.status || null,
        payment_status: order?.payment_status || null,
        total_amount: order?.total_amount || null,
        webhooks_count: webhooks?.length || 0,
        latest_webhook: webhooks?.[0] || null,
        all_webhooks: webhooks || [],
        errors: {
          order_error: orderError?.message || null,
          webhook_error: webhookError?.message || null
        },
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("Debug payment error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        debug: {
          error_message: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString()
        }
      }, 
      { status: 500 }
    )
  }
}