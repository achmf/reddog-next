import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// Import midtrans-client with the correct module name
import midtransClient from "midtrans-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, amount, customerDetails, items, outletId, outletName, buyerName, phoneNumber, email, pickupTime } = body

    // Validate required fields
    if (!orderId || !amount || !outletId || !outletName || !buyerName || !phoneNumber || !email || !pickupTime) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Get the origin for redirect URLs
    const origin = request.headers.get("origin") || "http://localhost:3000"

    // Create Snap API instance
    const snap = new midtransClient.Snap({
      // Set to true if you want Production Environment (accept real transaction).
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-TvttKE1eMdnC4ZWlEVclI8V-",
      clientKey: "SB-Mid-client-wNIhXjTXVqUH5NY4",
    })

    // Create transaction parameter with explicit redirect URLs
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: customerDetails,
      item_details: items,
      callbacks: {
        finish: `${origin}/orders/${orderId}`,
        pending: `${origin}/orders/${orderId}`,
        error: `${origin}/payment/failed?order_id=${orderId}`,
      },
    }

    // Create transaction token
    const transaction = await snap.createTransaction(parameter)

    // Get transaction token and redirect URL
    const transactionToken = transaction.token
    const redirectUrl = transaction.redirect_url

    // Store order details in session/temporary storage for later use
    // We'll create the order in database only when payment is successful
    const orderDetails = {
      id: orderId,
      outlet_id: outletId,
      outlet_name: outletName,
      total_amount: amount,
      payment_token: transactionToken,
      buyer_name: buyerName,
      phone_number: phoneNumber,
      email: email,
      pickup_time: pickupTime,
      items: items.map((item: any) => ({
        menu_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        add_ons: item.add_ons || null,
      }))
    }

    // TODO: Store orderDetails in Redis/cache or return it to client for temporary storage
    // For now, we'll pass it back to the client and handle database insertion on payment success

    return NextResponse.json({
      success: true,
      token: transactionToken,
      redirect_url: redirectUrl,
      order_id: orderId,
      order_details: orderDetails, // Pass order details to client for later use
    })
  } catch (error) {
    console.error("Midtrans API error:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
