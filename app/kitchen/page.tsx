"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Utensils,
  Volume2,
  VolumeX,
  ExternalLink,
  Store,
  Filter,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/db/types";
import { formatCurrency } from "@/lib/utils";

function KitchenContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "arabian-delight";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"active" | "all" | "ready">("active");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("Out of required ingredients");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchKitchenOrders = async () => {
    try {
      const res = await fetch(`/api/orders?slug=${slug}`);
      const json = await res.json();
      if (json.success && json.data) {
        setOrders(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch kitchen orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 4000);
    return () => clearInterval(interval);
  }, [slug]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const targetOrder = orders.find((o) => o.id === orderId);
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: targetOrder?.restaurantId,
          orderId,
          newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchKitchenOrders();
      }
    } catch {
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return;
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: cancelModalOrder.restaurantId,
          orderId: cancelModalOrder.id,
          newStatus: "cancelled",
          reason: cancelReason,
        }),
      });
      setCancelModalOrder(null);
      fetchKitchenOrders();
    } catch {
      alert("Failed to cancel order");
    }
  };

  // Filter orders
  const displayedOrders = orders.filter((o) => {
    if (filter === "active") {
      return o.orderStatus === "new" || o.orderStatus === "accepted" || o.orderStatus === "preparing";
    }
    if (filter === "ready") {
      return o.orderStatus === "ready";
    }
    return true; // all
  });

  const getMinutesAgo = (isoDate: string) => {
    const mins = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000);
    return mins;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. KITCHEN HEADER */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">Live Kitchen Display (KDS)</h1>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Chef Terminal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Active Restaurant: <strong className="text-white capitalize">{slug.replace(/-/g, " ")}</strong>
              </p>
            </div>
          </div>

          {/* Quick links & Sound toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition ${
                audioEnabled
                  ? "bg-slate-800 border-slate-700 text-emerald-400"
                  : "bg-slate-800 border-slate-700 text-slate-500"
              }`}
              title={audioEnabled ? "Sound Alert Enabled" : "Sound Muted"}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{audioEnabled ? "Chime On" : "Muted"}</span>
            </button>

            {/* Switch Restaurant */}
            <select
              value={slug}
              onChange={(e) => (window.location.href = `/kitchen?slug=${e.target.value}`)}
              className="bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-lg px-3 py-2"
            >
              <option value="arabian-delight">Arabian Delight</option>
              <option value="royal-biryani">Royal Biryani House</option>
              <option value="food-corner">Food Corner & Café</option>
            </select>

            <Link
              href={`/waiter?slug=${slug}`}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition"
            >
              Floor Waiter View →
            </Link>
          </div>
        </div>

        {/* Filter bar */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                filter === "active"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Active Kitchen Queue ({orders.filter((o) => o.orderStatus === "new" || o.orderStatus === "accepted" || o.orderStatus === "preparing").length})
            </button>
            <button
              onClick={() => setFilter("ready")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                filter === "ready"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Ready to Serve ({orders.filter((o) => o.orderStatus === "ready").length})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filter === "all"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All Recent Orders
            </button>
          </div>

          <button
            onClick={fetchKitchenOrders}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Auto-sync (4s)
          </button>
        </div>
      </header>

      {/* 2. LIVE ORDER CARDS GRID */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mr-2" /> Loading kitchen tickets...
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/50 border border-slate-800 rounded-3xl">
            <ChefHat className="w-16 h-16 text-slate-700 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">All orders cleared!</h3>
            <p className="text-xs text-slate-400 mt-1">
              Kitchen is idle. Incoming table QR orders will appear here automatically.
            </p>
            <div className="mt-6">
              <Link
                href={`/restaurant/${slug}?table=03`}
                target="_blank"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow"
              >
                Place Test Order from Table 03 <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedOrders.map((order) => {
              const elapsedMins = getMinutesAgo(order.createdAt);
              const isUrgent = elapsedMins >= 15;
              const isWarning = elapsedMins >= 8 && elapsedMins < 15;

              return (
                <div
                  key={order.id}
                  className={`bg-slate-900 rounded-2xl border-2 flex flex-col justify-between overflow-hidden shadow-2xl transition ${
                    order.orderStatus === "new"
                      ? "border-amber-400 ring-2 ring-amber-400/20"
                      : order.orderStatus === "ready"
                      ? "border-emerald-500"
                      : isUrgent
                      ? "border-rose-500"
                      : "border-slate-800"
                  }`}
                >
                  {/* Card Header */}
                  <div
                    className={`p-3.5 flex items-center justify-between border-b ${
                      order.orderStatus === "new"
                        ? "bg-amber-400/10 border-amber-400/30"
                        : order.orderStatus === "ready"
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-slate-800/60 border-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-base">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            order.orderType === "dine_in"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-purple-500/20 text-purple-300"
                          }`}
                        >
                          {order.orderType === "dine_in" ? `T-${order.tableNumber}` : "Takeaway"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{order.customerName}</p>
                    </div>

                    {/* Timer */}
                    <div
                      className={`text-right text-xs font-black px-2 py-1 rounded-lg flex items-center gap-1 ${
                        isUrgent
                          ? "bg-rose-500 text-white animate-pulse"
                          : isWarning
                          ? "bg-amber-400 text-slate-950"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{elapsedMins}m</span>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="p-4 flex-1 space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="border-b border-slate-800/60 pb-2.5 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between">
                          <span className="font-bold text-white text-sm">
                            <span className="text-amber-400 font-black mr-1.5">{item.quantity}x</span>
                            {item.name}
                          </span>
                        </div>

                        {item.selectedVariant && (
                          <p className="text-xs text-slate-400 ml-5">
                            Portion: <strong className="text-slate-300">{item.selectedVariant.name}</strong>
                          </p>
                        )}
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <p className="text-xs text-emerald-400 ml-5">
                            + {item.selectedAddons.map((a) => a.name).join(", ")}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <div className="mt-1 ml-5 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1 text-[11px] text-amber-300 font-medium">
                            Note: "{item.specialInstructions}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-3 bg-slate-950/70 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>Status: <strong className="uppercase text-white">{order.orderStatus}</strong></span>
                      <span className={order.paymentStatus === "paid" ? "text-emerald-400 font-bold" : "text-amber-400"}>
                        {order.paymentStatus === "paid" ? "PAID" : "UNPAID"}
                      </span>
                    </div>

                    {/* Dynamic Action Buttons based on state */}
                    <div className="flex gap-2">
                      {order.orderStatus === "new" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(order.id, "accepted")}
                            className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 rounded-xl text-xs transition"
                          >
                            Accept Order
                          </button>
                          <button
                            onClick={() => setCancelModalOrder(order)}
                            className="bg-slate-800 hover:bg-rose-500/20 text-rose-400 px-3 py-2.5 rounded-xl text-xs font-bold border border-slate-700"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {order.orderStatus === "accepted" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "preparing")}
                          className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-2.5 rounded-xl text-xs transition"
                        >
                          Start Preparing 🔥
                        </button>
                      )}

                      {order.orderStatus === "preparing" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "ready")}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
                        >
                          Mark Ready to Serve 🛎️
                        </button>
                      )}

                      {order.orderStatus === "ready" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "completed")}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs border border-slate-700 transition"
                        >
                          Mark Delivered / Completed ✓
                        </button>
                      )}

                      {order.orderStatus === "completed" && (
                        <div className="text-center text-xs text-slate-500 py-1">
                          Order Completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* REJECT / CANCEL MODAL */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-base font-bold text-white">
              Reject / Cancel {cancelModalOrder.orderNumber}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select reason for cancellation (customer and waiter will be notified):
            </p>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="mt-4 w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            >
              <option value="Out of required ingredients">Out of required ingredients</option>
              <option value="Kitchen overloaded with queue">Kitchen overloaded with queue</option>
              <option value="Customer requested cancellation">Customer requested cancellation</option>
              <option value="Closing time reached">Closing time reached</option>
            </select>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 bg-rose-500 hover:bg-rose-400 text-white py-2 rounded-xl text-xs font-black"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KitchenDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Kitchen...</div>}>
      <KitchenContent />
    </Suspense>
  );
}
