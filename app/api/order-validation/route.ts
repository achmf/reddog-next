import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { validationCode } = await request.json();

    if (!validationCode) {
      return NextResponse.json(
        { success: false, message: "Validation code is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get order by validation code
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          name,
          price,
          quantity,
          add_ons
        )
      `)
      .eq("validation_code", validationCode.toUpperCase())
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, message: "Invalid validation code" },
        { status: 404 }
      );
    }

    // Check if order can be validated (must be ready or completed)
    if (order.status !== "ready" && order.status !== "completed") {
      return NextResponse.json(
        { 
          success: false, 
          message: `Order cannot be validated. Current status: ${order.status}` 
        },
        { status: 400 }
      );
    }

    // Return order data for validation
    return NextResponse.json({
      success: true,
      message: "Order validated successfully",
      order: {
        id: order.id,
        buyer_name: order.buyer_name,
        total_amount: order.total_amount,
        status: order.status,
        outlet_name: order.outlet_name,
        pickup_time: order.pickup_time,
        created_at: order.created_at,
        items: order.order_items || []
      }
    });

  } catch (error) {
    console.error("Error validating order:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
