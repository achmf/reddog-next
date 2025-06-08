import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import midtransClient from "midtrans-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("order_id")

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 })
    }    // Create Core API instance to check transaction status
    const coreApi = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-TvttKE1eMdnC4ZWlEVclI8V-",
      clientKey: "SB-Mid-client-wNIhXjTXVqUH5NY4",
    })    // Get transaction status from Midtrans
    const transactionStatus = await coreApi.transaction.status(orderId)
    
    console.log(`Payment status check for ${orderId}:`, transactionStatus)

    // Create a new Supabase client
    const supabase = await createClient()

    // Check if order exists in our database
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .single()

    return NextResponse.json({
      success: true,
      midtrans_status: transactionStatus,
      order_exists: !!existingOrder,
      order_status: existingOrder?.status || null,
    })
  } catch (error) {
    console.error("Payment status check error:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
