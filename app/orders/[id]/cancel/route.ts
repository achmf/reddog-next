import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 })
    }

    // Create a new Supabase client
    const supabase = await createClient()

    // Get the current order status
    const { data: order, error: fetchError } = await supabase.from("orders").select("status").eq("id", orderId).single()

    if (fetchError) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    // Check if the order can be canceled
    if (order.status !== "pending" && order.status !== "paid") {
      return NextResponse.json({ success: false, message: "This order cannot be canceled" }, { status: 400 })
    }

    // Update the order status to canceled
    const { error: updateError } = await supabase.from("orders").update({ status: "canceled" }).eq("id", orderId)

    if (updateError) {
      throw new Error(`Error canceling order: ${updateError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: "Order canceled successfully",
    })
  } catch (error) {
    console.error("Error canceling order:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
