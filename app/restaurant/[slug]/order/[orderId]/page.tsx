"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  UtensilsCrossed,
  BellRing,
  Receipt,
  IndianRupee,
  ArrowLeft,
  QrCode,
  Sparkles,
  Award,
  Check,
  RefreshCw,
} from "lucide-react";
import { Order } from "@/lib/db/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "arabian-delight";
  const orderId = (params?.orderId as string) || "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setOrder(json.data);
      }
    } catch (err) {
      console.error("Error fetching order", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 5s for live kitchen status
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleSimulatePayment = async (method: "cash" | "upi" | "razorpay_online") => {
    if (!order) return;
    setPaying(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: method,
          paymentStatus: "paid",
          paymentReference: `${method.toUpperCase()}-VERIFIED-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowUpiModal(false);
        fetchOrder();
      }
    } catch {
      alert("Payment processing error");
    } finally {
      setPaying(false);
    }
  };

  const handleCallStaff = async (type: "call_waiter" | "bill_request") => {
    if (!order?.tableNumber) return;
    try {
      await fetch("/api/waiter-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          tableNumber: order.tableNumber,
          type,
        }),
      });
      setAlertMsg(type === "call_waiter" ? "Waiter notified!" : "Bill request sent to billing counter!");
      setTimeout(() => setAlertMsg(""), 4000);
    } catch {
      setAlertMsg("Notification sent to staff");
      setTimeout(() => setAlertMsg(""), 3000);
    }
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-400">Loading order status...</p>
      </div>
    );
  }

  // Steps definition
  const steps = [
    { key: "new", label: "Received", icon: Clock },
    { key: "accepted", label: "Accepted", icon: CheckCircle2 },
    { key: "preparing", label: "Cooking", icon: ChefHat },
    { key: "ready", label: "Ready to Serve", icon: UtensilsCrossed },
    { key: "completed", label: "Completed", icon: Award },
  ];

  const statusOrder = ["new", "accepted", "preparing", "ready", "completed"];
  const currentStepIdx = statusOrder.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href={`/restaurant/${slug}?table=${order.tableNumber || "03"}`}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </Link>
          <span className="text-xs font-bold text-emerald-400">
            {order.restaurantName}
          </span>
          <button
            onClick={fetchOrder}
            className="text-slate-400 hover:text-white p-1"
            title="Refresh Status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {alertMsg && (
        <div className="bg-emerald-500 text-slate-950 px-4 py-2 text-xs font-bold text-center">
          {alertMsg}
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 pt-6 w-full space-y-6">
        {/* Order Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center relative overflow-hidden shadow-xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Live Kitchen Tracking
          </div>

          <h1 className="text-2xl font-black text-white">{order.orderNumber}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {order.orderType === "dine_in" ? `Dine-In • Table ${order.tableNumber}` : "Takeaway Order"} • Placed at {formatDate(order.createdAt)}
          </p>

          {/* Stepper Progress */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between relative">
              {/* Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%`,
                }}
              ></div>

              {steps.map((st, i) => {
                const Icon = st.icon;
                const isPassed = i <= currentStepIdx;
                const isCurrent = i === currentStepIdx;

                return (
                  <div key={st.key} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                        isCurrent
                          ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20"
                          : isPassed
                          ? "bg-slate-900 border-emerald-500 text-emerald-400"
                          : "bg-slate-900 border-slate-800 text-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-bold mt-2 text-center whitespace-nowrap ${
                        isCurrent ? "text-emerald-400" : isPassed ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payment Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Payment Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                  order.paymentStatus === "paid"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                }`}
              >
                {order.paymentStatus === "paid" ? "Paid Online" : "Payment Pending"}
              </span>
              <span className="text-sm font-bold text-white">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            {order.paymentReference && (
              <p className="text-[11px] text-slate-400 mt-1">Ref: {order.paymentReference}</p>
            )}
          </div>

          {order.paymentStatus !== "paid" && (
            <button
              onClick={() => setShowUpiModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg transition flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" /> Pay Now via UPI / Gateway
            </button>
          )}
        </div>

        {/* Digital Stamp Card Progress */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950/40 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Digital Stamp Card
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
              +1 Stamp on this order
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Collect 5 stamps for a free dessert or beverage on your next visit!
          </p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((stamp) => (
              <div
                key={stamp}
                className={`h-11 rounded-xl border flex items-center justify-center font-black text-xs ${
                  stamp <= 4
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-500 border-dashed"
                }`}
              >
                {stamp <= 4 ? "★" : stamp}
              </div>
            ))}
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="font-bold text-white text-sm mb-4">Items Ordered</h3>
          <div className="space-y-3 divide-y divide-slate-800/80">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex justify-between items-start text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{item.quantity}x {item.name}</h4>
                  {item.selectedVariant && (
                    <p className="text-slate-400">Variant: {item.selectedVariant.name}</p>
                  )}
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <p className="text-slate-400">
                      Addons: {item.selectedAddons.map((a) => a.name).join(", ")}
                    </p>
                  )}
                  {item.specialInstructions && (
                    <p className="text-amber-300 italic">"{item.specialInstructions}"</p>
                  )}
                </div>
                <span className="font-bold text-white text-sm">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Financial summary */}
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Discount ({order.couponCode})</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Restaurant GST (5%)</span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-slate-800">
              <span>Total Bill</span>
              <span className="text-emerald-400">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Quick Staff Interaction */}
        {order.orderType === "dine_in" && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleCallStaff("call_waiter")}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition"
            >
              <BellRing className="w-4 h-4 text-amber-400" /> Call Waiter
            </button>
            <button
              onClick={() => handleCallStaff("bill_request")}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition"
            >
              <Receipt className="w-4 h-4 text-blue-400" /> Request Printed Bill
            </button>
          </div>
        )}
      </main>

      {/* UPI / PAYMENT MODAL */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-center relative">
            <button
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Scan & Pay via UPI
            </span>
            <h3 className="text-lg font-black text-white mt-1">Instant Restaurant Payment</h3>
            <p className="text-xs text-slate-400 mt-1">
              Amount to Pay: <strong className="text-white">{formatCurrency(order.totalAmount)}</strong>
            </p>

            {/* Simulated UPI QR Card */}
            <div className="my-6 bg-white p-4 rounded-xl max-w-[200px] mx-auto shadow-inner text-slate-950 flex flex-col items-center">
              <QrCode className="w-36 h-36" />
              <p className="text-[10px] font-bold text-slate-600 mt-1">
                UPI ID: {slug}@icici
              </p>
            </div>

            <p className="text-[11px] text-slate-400 mb-4">
              Supports Google Pay, PhonePe, Paytm, BHIM and all banking apps.
            </p>

            <div className="space-y-2">
              <button
                disabled={paying}
                onClick={() => handleSimulatePayment("upi")}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg transition"
              >
                {paying ? "Verifying..." : "Confirm UPI Payment Success"}
              </button>
              <button
                onClick={() => handleSimulatePayment("cash")}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-xl text-xs transition"
              >
                Switch to Pay Cash at Counter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
