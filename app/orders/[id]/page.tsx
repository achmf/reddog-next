"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import OrderValidationDisplay from "@/components/Orders/OrderValidationDisplay";
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
  Truck,
  ClipboardList,
  ChefHat,
  PackageCheck,
  Timer,
  AlertCircle,
  FrownIcon,
  FileText,
  Utensils,
  ShoppingBag
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
  validation_code?: string;
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
          .select("*, validation_code")
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
        return 3;
      case "completed":
        return 4;
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
        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-r from-primary via-red-600 to-primary py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
              Menu <span className="text-accent">Reddog</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-8 animate-slideUp opacity-90">
              Jelajahi kelezatan autentik Korea dengan berbagai pilihan menu spesial
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 right-20 w-20 h-20 border-4 border-accent/30 rounded-full animate-float"></div>
          <div
            className="absolute bottom-10 left-20 w-16 h-16 border-4 border-white/30 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </section>

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
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
              Menu <span className="text-accent">Reddog</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-8 animate-slideUp opacity-90">
              Jelajahi kelezatan autentik Korea dengan berbagai pilihan menu spesial
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
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
              <FrownIcon className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-3">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              {error || "The order you're looking for doesn't exist."}
            </p>
            <Link href="/orders">
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2">
                <FileText className="h-5 w-5" />
                View All Orders
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
      icon: ClipboardList,
      step: 1,
    },
    {
      title: "Preparing Your Order",
      description: "Our kitchen is preparing your delicious meal",
      icon: ChefHat,
      step: 2,
    },
    {
      title: "Ready to Pickup",
      description: "Your order is ready for pickup!",
      icon: PackageCheck,
      step: 3,
    },
    {
      title: "Order Complete",
      description: "Enjoy your meal! Thanks for choosing us",
      icon: CheckCircle,
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
            Menu <span className="text-accent">Reddog</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 animate-slideUp opacity-90">
            Jelajahi kelezatan autentik Korea dengan berbagai pilihan menu spesial
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 right-20 w-20 h-20 border-4 border-accent/30 rounded-full animate-float"></div>
        <div
          className="absolute bottom-10 left-20 w-16 h-16 border-4 border-white/30 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                Order #{order.id.substring(0, 8)}...
              </h1>
              <p className="text-sm text-gray-600">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${statusInfo.color} w-fit`}
            >
              {statusInfo.icon}
              <span>{statusInfo.text}</span>
            </div>
          </div>
        </div>

        {/* Order Tracking System - Line-based 4 Status Track */}
        {order.status !== "canceled" && order.status !== "pending" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Progress</h2>
            
            {/* Line-based tracking */}
            <div className="relative">
              {/* Horizontal line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
              <div 
                className="absolute top-6 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-700"
                style={{ width: `${(trackingStep / 4) * 100}%` }}
              ></div>
              
              {/* Status points */}
              <div className="relative flex justify-between">
                {trackingSteps.map((step, index) => {
                  const isCompleted = trackingStep >= step.step;
                  const isCurrent = trackingStep === step.step;
                  const IconComponent = step.icon;
                  
                  return (
                    <div key={step.step} className="flex flex-col items-center">
                      {/* Circle indicator */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                            : isCurrent
                            ? "bg-blue-500 text-white animate-pulse shadow-lg shadow-blue-500/25"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      
                      {/* Status text */}
                      <div className="text-center mt-3 max-w-[120px]">
                        <h3
                          className={`text-sm font-medium mb-1 ${
                            isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-xs ${
                            isCompleted || isCurrent ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Order Validation Display */}
        {order.validation_code && (order.status === 'ready' || order.status === 'completed') && (
          <OrderValidationDisplay
            orderId={order.id}
            validationCode={order.validation_code}
            buyerName={order.buyer_name}
            totalAmount={order.total_amount}
            status={order.status}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Name</div>
                  <div className="font-medium text-gray-900">
                    {order.buyer_name}
                  </div>
                </div>
              </div>

              {order.phone_number && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Phone</div>
                    <div className="font-medium text-gray-900">
                      {order.phone_number}
                    </div>
                  </div>
                </div>
              )}

              {order.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium text-gray-900">
                      {order.email}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">Order ID</div>
                <div className="font-mono text-sm text-gray-900">
                  {order.id}
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <div className="text-xs text-gray-500">Pickup Location</div>
                  <div className="font-medium text-gray-900">
                    {order.outlet_name}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <div className="text-xs text-gray-500">Pickup Time</div>
                  <div className="font-medium text-gray-900">
                    {formatDate(order.pickup_time)}
                  </div>
                  {isPastPickupTime && (
                    <div className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded inline-flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Pickup time has passed
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items ({orderItems.length})</h3>
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white rounded-lg w-12 h-12 flex-shrink-0 flex items-center justify-center border border-gray-200">
                    <span className="text-sm font-semibold text-gray-900">
                      {item.quantity}x
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price)} each
                    </p>

                    {/* Add-ons */}
                    {item.add_ons && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {item.add_ons.freeSauce &&
                          item.add_ons.freeSauce.length > 0 && (
                            <div className="bg-white px-3 py-2 rounded border border-gray-200">
                              <span className="font-medium text-gray-700">
                                Sauce:
                              </span>
                              <span className="text-gray-600 ml-1">
                                {item.add_ons.freeSauce.join(", ")}
                              </span>
                            </div>
                          )}
                        {item.add_ons.topping &&
                          item.add_ons.topping.length > 0 && (
                            <div className="bg-white px-3 py-2 rounded border border-gray-200">
                              <span className="font-medium text-gray-700">
                                Topping:
                              </span>
                              <span className="text-gray-600 ml-1">
                                {item.add_ons.topping.join(", ")}
                              </span>
                            </div>
                          )}
                        {item.add_ons.spicyLevel && (
                          <div className="bg-white px-3 py-2 rounded border border-gray-200">
                            <span className="font-medium text-gray-700">
                              Spicy Level:
                            </span>
                            <span className="text-gray-600 ml-1">
                              {item.add_ons.spicyLevel}
                            </span>
                          </div>
                        )}
                        {item.add_ons.addOnToppoki &&
                          item.add_ons.addOnToppoki.length > 0 && (
                            <div className="bg-white px-3 py-2 rounded border border-gray-200">
                              <span className="font-medium text-gray-700">
                                Add-On Toppoki:
                              </span>
                              <span className="text-gray-600 ml-1">
                                {item.add_ons.addOnToppoki.join(", ")}
                              </span>
                            </div>
                          )}
                        {item.add_ons.size && (
                          <div className="bg-white px-3 py-2 rounded border border-gray-200">
                            <span className="font-medium text-gray-700">
                              Size:
                            </span>
                            <span className="text-gray-600 ml-1">
                              {item.add_ons.size}
                            </span>
                          </div>
                        )}
                        {item.add_ons.iceLevel && (
                          <div className="bg-white px-3 py-2 rounded border border-gray-200">
                            <span className="font-medium text-gray-700">
                              Ice Level:
                            </span>
                            <span className="text-gray-600 ml-1">
                              {item.add_ons.iceLevel}
                            </span>
                          </div>
                        )}
                        {item.add_ons.specialInstructions && (
                          <div className="bg-white px-3 py-2 rounded border border-gray-200 sm:col-span-2">
                            <span className="font-medium text-gray-700">
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
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 mt-6 pt-6">
            <div className="bg-gray-900 text-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="text-xl font-bold">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Order Section */}
        {canCancel && !isPastPickupTime && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Actions</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
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
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto font-medium"
            >
              {cancelLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              This order has been canceled
            </h3>
            <p className="text-red-600 mb-6">
              If you still want these items, please place a new order from our
              menu.
            </p>
            <Link href="/menu">
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium inline-flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Browse Menu Again
              </button>
            </Link>
          </div>
        )}

        {/* Completed Order Notice */}
        {order.status === "completed" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Order Completed!
            </h3>
            <p className="text-green-600 mb-6">
              Thank you for choosing us! We hope you enjoyed your meal.
            </p>
            <Link href="/menu">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:green-700 transition-colors font-medium inline-flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Order Again
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
            className="w-5 h-5"
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
