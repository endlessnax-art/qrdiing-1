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
  Star,
  X,
  Printer,
  AlertTriangle,
  HeartHandshake,
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

  // Cancel order modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("Change of plans");

  // Printable Tax Invoice
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Customer Feedback & 5-Star Rating
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Delicious Food", "Fast Service"]);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const feedbackTagOptions = [
    "Delicious Food",
    "Fast Service",
    "Authentic Flavor",
    "Great Ambience",
    "Polite Staff",
    "Clean & Hygienic",
    "Easy QR Ordering",
  ];

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

  const handleCancelOrder = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: order.restaurantId,
          orderId: order.id,
          action: "cancel",
          reason: cancelReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCancelModal(false);
        setAlertMsg("Order successfully cancelled.");
        fetchOrder();
      } else {
        alert(data.error || "Cannot cancel order at this stage.");
      }
    } catch {
      alert("Error cancelling order");
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!order) return;
    setSubmittingFeedback(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: order.restaurantId,
          orderId: order.id,
          tableNumber: order.tableNumber,
          customerName: order.customerName,
          rating,
          comment: reviewComment,
          tags: selectedTags,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackSubmitted(true);
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch {
      alert("Network error submitting review");
    } finally {
      setSubmittingFeedback(false);
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

          {order.orderStatus === "cancelled" ? (
            <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <p className="font-bold text-sm flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" /> Order Cancelled
              </p>
              {order.cancellationReason && (
                <p className="text-xs text-rose-300/80 mt-1">Reason: {order.cancellationReason}</p>
              )}
            </div>
          ) : (
            /* Stepper Progress */
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
          )}
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

        {/* Quick Staff Interaction & Actions */}
        <div className="space-y-3">
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

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 p-3 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition"
            >
              <Printer className="w-4 h-4 text-emerald-400" /> View GST Tax Invoice
            </button>

            {order.orderStatus !== "cancelled" && (order.orderStatus === "new" || order.orderStatus === "accepted") && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <AlertTriangle className="w-4 h-4" /> Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* 5-STAR CUSTOMER FEEDBACK & RATING */}
        {order.orderStatus !== "cancelled" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Rate Your Dining Experience</h3>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Table {order.tableNumber || "Guest"}
              </span>
            </div>

            {feedbackSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center my-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                <h4 className="font-bold text-white text-sm">Thank You for Your Review!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Your feedback helps {order.restaurantName} maintain top quality cuisine & service.
                </p>
              </div>
            ) : (
              <div className="space-y-4 mt-3">
                {/* Star rating selector */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                            : "text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Quick Tags */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 mb-2">What did you like most?</p>
                  <div className="flex flex-wrap gap-1.5">
                    {feedbackTagOptions.map((tag) => {
                      const isSel = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (isSel) {
                              setSelectedTags(selectedTags.filter((t) => t !== tag));
                            } else {
                              setSelectedTags([...selectedTags, tag]);
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full border transition ${
                            isSel
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold"
                              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Review Textarea */}
                <div>
                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share any special comments about your food or staff service..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="button"
                  disabled={submittingFeedback}
                  onClick={handleSubmitFeedback}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
                >
                  {submittingFeedback ? "Submitting Review..." : "Submit 5-Star Review"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* CANCEL ORDER MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-sm w-full p-6 text-center relative shadow-2xl">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">Cancel Order {order.orderNumber}?</h3>
            <p className="text-xs text-slate-400 mt-1">
              You can cancel this order because the kitchen has not started preparing it yet.
            </p>

            <div className="mt-4 text-left">
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Cancellation Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Change of plans">Change of plans</option>
                <option value="Ordered wrong item">Ordered wrong item</option>
                <option value="Wait time too long">Wait time too long</option>
                <option value="Leaving restaurant">Leaving restaurant</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black py-2.5 rounded-xl text-xs transition"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GST TAX INVOICE MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 relative shadow-2xl my-8">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Bill Header */}
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="inline-block bg-slate-900 text-white font-black text-xs px-2.5 py-0.5 rounded uppercase tracking-wider mb-2">
                Tax Invoice
              </div>
              <h2 className="text-xl font-black text-slate-950">{order.restaurantName}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                GSTIN: 36AAECR9988D1Z2 • FSSAI Lic: 13621014000321
              </p>
              <p className="text-[11px] text-slate-500">
                Plot 14, Road 2, Banjara Hills, Hyderabad - 500034
              </p>
            </div>

            {/* Invoice Meta */}
            <div className="py-3 border-b border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Invoice No</span>
                <span className="font-bold text-slate-900">{order.orderNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Date & Time</span>
                <span className="font-semibold text-slate-800">{formatDate(order.createdAt)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Order Type / Table</span>
                <span className="font-bold text-slate-900">
                  {order.orderType === "dine_in" ? `Table ${order.tableNumber}` : "Takeaway"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Customer</span>
                <span className="font-semibold text-slate-800">{order.customerName}</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="py-3 border-b border-slate-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                    <th className="text-left pb-1 font-bold">Item</th>
                    <th className="text-center pb-1 font-bold">Qty</th>
                    <th className="text-right pb-1 font-bold">Rate</th>
                    <th className="text-right pb-1 font-bold">Amt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="py-1">
                      <td className="py-1 text-slate-900 font-semibold">
                        {item.name}
                        {item.selectedVariant && (
                          <span className="text-[10px] text-slate-500 block">({item.selectedVariant.name})</span>
                        )}
                      </td>
                      <td className="text-center py-1 text-slate-600">{item.quantity}</td>
                      <td className="text-right py-1 text-slate-600">₹{item.unitPrice}</td>
                      <td className="text-right py-1 font-bold text-slate-900">₹{item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations */}
            <div className="py-3 border-b border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Promo ({order.couponCode})</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>CGST @ 2.5%</span>
                <span>{formatCurrency(order.taxAmount / 2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST @ 2.5%</span>
                <span>{formatCurrency(order.taxAmount / 2)}</span>
              </div>
              <div className="flex justify-between text-slate-950 font-black text-sm pt-2 border-t border-slate-200">
                <span>Total Amount Due / Paid</span>
                <span className="text-emerald-700">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            {/* Payment footer info */}
            <div className="pt-3 text-[11px] text-slate-500 flex justify-between items-center">
              <div>
                <span>Payment Mode: </span>
                <strong className="text-slate-800 uppercase">{order.paymentMethod}</strong>
              </div>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {order.paymentStatus === "paid" ? "PAID" : "PENDING"}
              </span>
            </div>

            {/* Print Trigger */}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" /> Print Tax Receipt
              </button>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
