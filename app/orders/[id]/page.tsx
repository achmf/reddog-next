"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useAlert } from "@/context/AlertContext";
import {
  OrderHeader,
  OrderTracking,
  CustomerInfo,
  PickupInfo,
  OrderItems,
  OrderActions,
  OrderStatusNotice,
  OrderLoadingState,
  OrderErrorState,
  BackToTopButton,
  OrderValidationDisplay,
  InvoiceDownload
} from "@/components/Orders";
import { ArrowLeft } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

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

export default function OrderDetailsPage() {  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { showError, showSuccess, showWarning, showInfo } = useAlert();
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const [userSessionId, setUserSessionId] = useState<string>(""); // User session untuk privacy
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const supabase = createClient();
  const maxRetries = 3;

  // Generate atau ambil session ID dari localStorage untuk privacy
  useEffect(() => {
    let sessionId = localStorage.getItem("user_session_id")
    if (!sessionId) {
      sessionId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("user_session_id", sessionId)
    }
    setUserSessionId(sessionId)
  }, [])
  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        if (!orderId) {
          setError("ID pesanan tidak ada");
          setLoading(false);
          return;
        }

        if (!userSessionId) {
          return; // Wait for user session ID to be loaded
        }

        // Fetch order details dengan filter user_session_id untuk privacy
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*, validation_code")
          .eq("id", orderId)
          .eq("user_session_id", userSessionId) // Privacy filter
          .single();if (orderError || !orderData) {
          // If order not found, try to ensure it exists (for recently paid orders)
          if (!orderData && fetchAttempts < maxRetries) {
            console.log(`Order not found, trying to ensure order exists... (attempt ${fetchAttempts + 1}/${maxRetries})`);
            
            try {
              // Try to ensure the order exists
              const ensureResponse = await fetch("/api/orders/ensure", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: orderId
                }),
              });
              
              const ensureData = await ensureResponse.json();
              
              if (ensureData.success && ensureData.exists) {
                console.log("Order found via ensure endpoint, retrying fetch...");
                setFetchAttempts(prev => prev + 1);
                setTimeout(() => {
                  fetchOrderDetails();
                }, 1000);
                return;
              }
            } catch (ensureError) {
              console.error("Error ensuring order:", ensureError);
            }
            
            // If ensure didn't work, retry with delay
            setFetchAttempts(prev => prev + 1);
            setTimeout(() => {
              fetchOrderDetails();
            }, 2000);
            return;
          }
          
          if (orderError) {
            throw orderError;
          }
            setError("Pesanan tidak ditemukan");
          showError("Pesanan tidak ditemukan atau sudah tidak valid", "Pesanan Tidak Ditemukan");
          setLoading(false);
          return;
        }

        setOrder(orderData);
        showInfo("Detail pesanan berhasil dimuat", "Berhasil");

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
        setError("Gagal memuat detail pesanan");
        showError("Gagal memuat detail pesanan. Silakan coba lagi nanti.", "Error");
      } finally {
        setLoading(false);
      }
    }    fetchOrderDetails();
  }, [orderId, supabase, fetchAttempts, userSessionId]);  const handleCancelOrder = async () => {
    if (!order) return;
    setShowCancelDialog(true);
  };

  const confirmCancelOrder = async () => {
    if (!order) return;

    setCancelLoading(true);
    setShowCancelDialog(false);
    
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
      showSuccess("Pesanan berhasil dibatalkan", "Pembatalan Berhasil");
    } catch (error) {
      console.error("Error canceling order:", error);
      showError("Gagal membatalkan pesanan. Silakan coba lagi.", "Gagal Membatalkan");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return <OrderLoadingState />;
  }

  if (error || !order) {
    return <OrderErrorState error={error || undefined} />;
  }

  const pickupTime = new Date(order.pickup_time);
  const isPastPickupTime = new Date() > pickupTime;
  const canCancel = order.status === "pending" || order.status === "paid";
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-secondary">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-primary via-red-600 to-primary py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>        <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
            Detail <span className="text-accent">Pesanan</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 animate-slideUp opacity-90">
            Lihat status dan detail pesanan kamu di sini
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 right-20 w-20 h-20 border-4 border-accent/30 rounded-full animate-float"></div>
        <div
          className="absolute bottom-10 left-20 w-16 h-16 border-4 border-white/30 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Pesanan
          </Link>
        </div>

        {/* Header Section */}
        <OrderHeader 
          orderId={order.id}
          createdAt={order.created_at}
          status={order.status}
        />

        {/* Order Tracking System */}
        <OrderTracking status={order.status} />

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
          <CustomerInfo 
            buyerName={order.buyer_name}
            phoneNumber={order.phone_number}
            email={order.email}
            orderId={order.id}
          />

          {/* Pickup Information */}
          <PickupInfo 
            outletName={order.outlet_name}
            pickupTime={order.pickup_time}
          />
        </div>        {/* Order Items */}
        <OrderItems 
          items={orderItems}
          totalAmount={order.total_amount}
        />

        {/* Invoice Download Section */}
        <InvoiceDownload 
          order={order}
          orderItems={orderItems}
        />

        {/* Cancel Order Section */}
        <OrderActions 
          canCancel={canCancel}
          isPastPickupTime={isPastPickupTime}
          cancelLoading={cancelLoading}
          onCancelOrder={handleCancelOrder}
        />        {/* Order Status Notice */}
        <OrderStatusNotice status={order.status} />
      </div>
      
      {/* Back to Top Button */}
      <BackToTopButton />

      {/* Cancel Order Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancelOrder}
        title="Batalkan Pesanan"
        message={`Apakah Anda yakin ingin membatalkan pesanan #${order?.id?.slice(0, 8)}? Tindakan ini tidak dapat dibatalkan dan uang akan dikembalikan sesuai kebijakan refund.`}
        confirmText="Ya, Batalkan Pesanan"
        cancelText="Tidak, Tetap Pertahankan"
        type="danger"
        isLoading={cancelLoading}
      />
    </div>
  );
}
