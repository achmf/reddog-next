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

    // Check order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()

    // Check webhooks
    const { data: webhooks, error: webhookError } = await supabase
      .from("payment_webhooks")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })

    // Check order items
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)

    return NextResponse.json({
      success: true,
      debug: {
        order_id: orderId,
        order_exists: !!order,
        order_data: order,
        order_error: orderError?.message || null,
        webhooks_count: webhooks?.length || 0,
        webhooks_data: webhooks,
        webhooks_error: webhookError?.message || null,
        order_items_count: orderItems?.length || 0,
        order_items_data: orderItems,
        items_error: itemsError?.message || null,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
