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

    // Create a new Supabase client - properly awaited
    const supabase = await createClient()

    // Create the order record in Supabase with buyer_name, phone_number, email and pickup_time
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        outlet_id: outletId,
        outlet_name: outletName,
        total_amount: amount,
        status: "pending",
        payment_token: transactionToken,
        buyer_name: buyerName,
        phone_number: phoneNumber,
        email: email,
        pickup_time: pickupTime,
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`Error creating order: ${orderError.message}`)
    }

    // Create order items for each cart item
    const orderItems = items.map((item: any) => ({
      order_id: orderId,
      menu_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      add_ons: item.add_ons || null,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw new Error(`Error creating order items: ${itemsError.message}`)
    }

    return NextResponse.json({
      success: true,
      token: transactionToken,
      redirect_url: redirectUrl,
      order_id: orderId,
    })
  } catch (error) {
    console.error("Midtrans API error:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
