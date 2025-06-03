"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
} from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  add_ons: any;
};

type Order = {
  id: string;
  outlet_id: string;
  outlet_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_token: string;
  buyer_name: string;
  phone_number?: string;
  email?: string;
  pickup_time: string;
  items?: OrderItem[];
};

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const supabase = createClient();

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        if (!orderId) {
          setError("Order ID is missing");
          setLoading(false);
          return;
        }

        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (orderError) {
          throw orderError;
        }

        if (!orderData) {
          setError("Order not found");
          setLoading(false);
          return;
        }

        setOrder(orderData);

        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId);

        if (itemsError) {
          throw itemsError;
        }

        setOrderItems(itemsData || []);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId, supabase]);

  const handleCancelOrder = async () => {
    if (!order) return;

    setCancelLoading(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "canceled" })
        .eq("id", order.id);

      if (error) {
        throw error;
      }

      // Update local state
      setOrder({ ...order, status: "canceled" });
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy 'at' h:mm a");
  };

  // Get tracking step based on status
  const getTrackingStep = (status: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "paid":
        return 1;
      case "received":
      case "cooking":
        return 2;
      case "ready":
      case "completed":
        return 3;
      case "canceled":
        return -1;
      default:
        return 0;
    }
  };

  // Get status badge color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "paid":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
          text: "Payment Confirmed",
        };
      case "received":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          text: "Order Received",
        };
      case "cooking":
        return {
          color: "bg-orange-100 text-orange-800",
          icon: <Clock className="h-5 w-5 text-orange-500" />,
          text: "Preparing Order",
        };
      case "ready":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          text: "Ready to Pickup",
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          text: "Order Completed",
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          text: "Pending Payment",
        };
      case "canceled":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          text: "Order Canceled",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
          text: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-secondary">
        {/* Hero Section Skeleton */}
        <section className="relative w-full bg-gradient-to-r from-primary via-red-600 to-primary py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
            <div className="h-16 bg-white/20 rounded-lg mx-auto mb-4 animate-pulse max-w-md"></div>
            <div className="h-8 bg-white/10 rounded mx-auto mb-8 animate-pulse max-w-2xl"></div>
          </div>
        </section>

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-4 border-red-400 border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-red-500">
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-secondary">
        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-r from-primary via-red-600 to-primary py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
              Detail <span className="text-accent">Pesanan</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-8 animate-slideUp opacity-90">
              Informasi lengkap tentang pesanan Anda
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 right-20 w-20 h-20 border-4 border-accent/30 rounded-full animate-float"></div>
          <div
            className="absolute bottom-10 left-20 w-16 h-16 border-4 border-white/30 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </section>

        <div className="flex items-center justify-center p-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-100">
            <div className="text-8xl mb-6">😞</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              {error || "The order you're looking for doesn't exist."}
            </p>
            <Link href="/orders">
              <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                📋 View All Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const trackingStep = getTrackingStep(order.status);
  const canCancel = order.status === "pending" || order.status === "paid";
  const pickupTime = new Date(order.pickup_time);
  const isPastPickupTime = new Date() > pickupTime;

  const trackingSteps = [
    {
      title: "Order Received",
      description: "We've received your order and payment",
      icon: "📋",
      step: 1,
    },
    {
      title: "Preparing Your Order",
      description: "Our kitchen is preparing your delicious meal",
      icon: "👨‍🍳",
      step: 2,
    },
    {
      title: "Ready to Pickup",
      description: "Your order is ready for pickup!",
      icon: "✅",
      step: 3,
    },
    {
      title: "Order Complete",
      description: "Enjoy your meal! Thanks for choosing us",
      icon: "🎉",
      step: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-secondary">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-primary via-red-600 to-primary py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
            Detail <span className="text-accent">Pesanan</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 animate-slideUp opacity-90">
            Informasi lengkap tentang pesanan Anda
          </p>
        </div>
        {/* Decorative elements - positioned away from text */}
        <div className="absolute top-10 right-20 w-20 h-20 border-4 border-accent/30 rounded-full animate-float"></div>
        <div
          className="absolute bottom-10 left-20 w-16 h-16 border-4 border-white/30 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Orders
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-red-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
                Order #{order.id.substring(0, 8)}...
              </h1>
              <p className="text-gray-600">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-full ${statusInfo.color} w-fit`}
            >
              {statusInfo.icon}
              <span className="font-semibold">{statusInfo.text}</span>
            </div>
          </div>
        </div>

        {/* Order Tracking System */}
        {order.status !== "canceled" && order.status !== "pending" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-red-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              🚚 Order Tracking
            </h2>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-6 top-12 h-full w-1 bg-gray-200"></div>
              <div
                className="absolute left-6 top-12 w-1 bg-gradient-to-b from-red-500 to-orange-500 transition-all duration-1000"
                style={{ height: `${(trackingStep / 3) * 100}%` }}
              ></div>

              {/* Tracking Steps */}
              <div className="space-y-8">
                {trackingSteps.map((step, index) => {
                  const isCompleted = trackingStep >= step.step;
                  const isCurrent = trackingStep === step.step;

                  return (
                    <div
                      key={step.step}
                      className="relative flex items-start gap-6"
                    >
                      {/* Step Circle */}
                      <div
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                          isCompleted
                            ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                            : isCurrent
                              ? "bg-yellow-100 border-2 border-yellow-400 animate-pulse"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.icon}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-lg font-bold transition-colors ${
                            isCompleted
                              ? "text-gray-800"
                              : isCurrent
                                ? "text-yellow-600"
                                : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div
                          className={`text-sm mt-1 transition-colors ${
                            isCompleted
                              ? "text-gray-600"
                              : isCurrent
                                ? "text-yellow-600"
                                : "text-gray-400"
                          }`}
                        >
                          {step.description}
                        </div>

                        {/* Estimated time or completion time */}
                        {isCurrent && order.status === "cooking" && (
                          <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full w-fit">
                            ⏱️ Estimated: 15-20 minutes
                          </div>
                        )}

                        {isCompleted && step.step === trackingStep && (
                          <div className="mt-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                            ✨ Completed
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Customer Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Customer Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-semibold text-gray-800">
                    {order.buyer_name}
                  </div>
                </div>
              </div>

              {order.phone_number && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-semibold text-gray-800">
                      {order.phone_number}
                    </div>
                  </div>
                </div>
              )}

              {order.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-semibold text-gray-800">
                      {order.email}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <div className="text-sm text-gray-600">Order ID</div>
                <div className="font-mono text-sm text-gray-800">
                  {order.id}
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Pickup Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Pickup Location</div>
                  <div className="font-semibold text-gray-800">
                    {order.outlet_name}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-red-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Pickup Time</div>
                  <div className="font-semibold text-gray-800">
                    {formatDate(order.pickup_time)}
                  </div>
                  {isPastPickupTime && (
                    <div className="text-sm text-red-500 mt-1 bg-red-50 px-2 py-1 rounded">
                      ⚠️ Pickup time has passed
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-red-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Order Items ({orderItems.length})
          </h3>
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white rounded-lg w-16 h-16 flex-shrink-0 flex items-center justify-center border border-red-200">
                    <span className="text-lg font-bold text-red-600">
                      {item.quantity}x
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-red-600 font-semibold">
                      {formatPrice(item.price)} each
                    </p>

                    {/* Add-ons */}
                    {item.add_ons && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {item.add_ons.freeSauce &&
                          item.add_ons.freeSauce.length > 0 && (
                            <div className="bg-white px-3 py-2 rounded-lg border border-red-100">
                              <span className="font-semibold text-gray-700">
                                Sauce:
                              </span>
                              <span className="text-gray-600 ml-1">
                                {item.add_ons.freeSauce.join(", ")}
                              </span>
                            </div>
                          )}
                        {item.add_ons.topping &&
                          item.add_ons.topping.length > 0 && (
                            <div className="bg-white px-3 py-2 rounded-lg border border-red-100">
                              <span className="font-semibold text-gray-700">
                                Topping:
                              </span>
                              <span className="text-gray-600 ml-1">
                                {item.add_ons.topping.join(", ")}
                              </span>
                            </div>
                          )}
                        {item.add_ons.spicyLevel && (
                          <div className="bg-white px-3 py-2 rounded-lg border border-red-100">
                            <span className="font-semibold text-gray-700">
                              Spicy Level:
                            </span>
                            <span className="text-gray-600 ml-1">
                              {item.add_ons.spicyLevel}
                            </span>
                          </div>
                        )}
                        {item.add_ons.addOnToppoki &&
                          item.add_ons.addOnToppoki.length > 0 && (
                            <div className="bg-white px-3 py-2 rounded-lg border border-red-100">
                              <span className="font-semibold text-gray-700">
                                Add-On Toppoki:
                              </span>
                              <span className="text-gray-600 ml-1">
                                {item.add_ons.addOnToppoki.join(", ")}
                              </span>
                            </div>
                          )}
                        {item.add_ons.size && (
                          <div className="bg-white px-3 py-2 rounded-lg border border-red-100">
                            <span className="font-semibold text-gray-700">
                              Size:
                            </span>
                            <span className="text-gray-600 ml-1">
                              {item.add_ons.size}
                            </span>
                          </div>
                        )}
                        {item.add_ons.iceLevel && (
                          <div className="bg-white px-3 py-2 rounded-lg border border-red-100">
                            <span className="font-semibold text-gray-700">
                              Ice Level:
                            </span>
                            <span className="text-gray-600 ml-1">
                              {item.add_ons.iceLevel}
                            </span>
                          </div>
                        )}
                        {item.add_ons.specialInstructions && (
                          <div className="bg-white px-3 py-2 rounded-lg border border-red-100 sm:col-span-2">
                            <span className="font-semibold text-gray-700">
                              Instructions:
                            </span>
                            <span className="text-gray-600 ml-1">
                              {item.add_ons.specialInstructions}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-red-200 mt-6 pt-6">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Order Section */}
        {canCancel && !isPastPickupTime && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              Order Actions
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-700 font-medium mb-2">
                Cancel this order?
              </p>
              <p className="text-red-600 text-sm">
                You can cancel your order before the pickup time. This action
                cannot be undone.
              </p>
            </div>
            <button
              onClick={handleCancelOrder}
              disabled={cancelLoading}
              className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto font-semibold"
            >
              {cancelLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>Cancel Order</>
              )}
            </button>
          </div>
        )}

        {/* Canceled Order Notice */}
        {order.status === "canceled" && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-red-800 mb-2">
              This order has been canceled
            </h3>
            <p className="text-red-600 mb-6">
              If you still want these items, please place a new order from our
              menu.
            </p>
            <Link href="/menu">
              <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                🍽️ Browse Menu Again
              </button>
            </Link>
          </div>
        )}

        {/* Completed Order Notice */}
        {order.status === "completed" && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Order Completed!
            </h3>
            <p className="text-green-600 mb-6">
              Thank you for choosing us! We hope you enjoyed your meal.
            </p>
            <Link href="/menu">
              <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                🍽️ Order Again
              </button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary hover:bg-red-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-40 animate-fadeIn"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
