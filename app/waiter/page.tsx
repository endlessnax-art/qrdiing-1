"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  BellRing,
  Receipt,
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  RefreshCw,
  UserCheck,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  X,
  CreditCard,
  IndianRupee,
} from "lucide-react";
import { RestaurantTable, WaiterCall, Order, TableStatus } from "@/lib/db/types";
import { formatCurrency, formatDate } from "@/lib/utils";

function WaiterContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "arabian-delight";

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [prevCallsCount, setPrevCallsCount] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const playWaiterChime = () => {
    if (!audioEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio autoplay policy catch
    }
  };

  const fetchFloorData = async () => {
    try {
      const [tablesRes, callsRes, ordersRes] = await Promise.all([
        fetch(`/api/restaurants/${slug}/tables`),
        fetch(`/api/waiter-calls?slug=${slug}`),
        fetch(`/api/orders?slug=${slug}`),
      ]);

      if (tablesRes.status === 401 || tablesRes.status === 403) {
        window.location.href = `/login?redirect=/waiter?slug=${slug}`;
        return;
      }

      const [tablesJson, callsJson, ordersJson] = await Promise.all([
        tablesRes.json(),
        callsRes.json(),
        ordersRes.json(),
      ]);

      if (tablesJson.success) setTables(tablesJson.data);
      if (callsJson.success) {
        if (callsJson.data.length > prevCallsCount) {
          playWaiterChime();
        }
        setPrevCallsCount(callsJson.data.length);
        setWaiterCalls(callsJson.data);
      }
      if (ordersJson.success) setOrders(ordersJson.data);
    } catch (err) {
      console.error("Failed to fetch waiter floor data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloorData();
    const interval = setInterval(fetchFloorData, 4000);
    return () => clearInterval(interval);
  }, [slug]);

  const handleResolveCall = async (callId: string) => {
    try {
      const targetTable = tables[0];
      await fetch("/api/waiter-calls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: targetTable?.restaurantId,
          callId,
        }),
      });
      fetchFloorData();
    } catch {
      alert("Failed to resolve call");
    }
  };

  const handleUpdateTableStatus = async (tableNumber: string, status: TableStatus) => {
    try {
      await fetch(`/api/restaurants/${slug}/tables`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          tableNumber,
          status,
        }),
      });
      fetchFloorData();
      if (selectedTable && selectedTable.tableNumber === tableNumber) {
        setSelectedTable({ ...selectedTable, status });
      }
    } catch {
      alert("Failed to update table status");
    }
  };

  // Status badge config
  const statusConfig: Record<TableStatus, { label: string; bg: string; text: string; border: string }> = {
    available: { label: "Available", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
    occupied: { label: "Occupied", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
    order_pending: { label: "Order Pending", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
    preparing: { label: "Cooking", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
    ready: { label: "Ready to Serve", bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-400 ring-2 ring-emerald-400/30" },
    bill_requested: { label: "Bill Requested", bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500 animate-pulse" },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">Waiter & Floor Management</h1>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Floor Staff
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Restaurant: <strong className="text-slate-900 capitalize">{slug.replace(/-/g, " ")}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={slug}
              onChange={(e) => (window.location.href = `/waiter?slug=${e.target.value}`)}
              className="bg-stone-100 border border-stone-300 text-xs font-bold text-slate-800 rounded-lg px-3 py-2"
            >
              <option value="arabian-delight">Arabian Delight</option>
              <option value="royal-biryani">Royal Biryani House</option>
              <option value="food-corner">Food Corner & Café</option>
            </select>

            <Link
              href={`/kitchen?slug=${slug}`}
              className="bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg border border-stone-300 transition"
            >
              Kitchen KDS →
            </Link>
          </div>
        </div>
      </header>

      {/* 2. LIVE WAITER CALL ALERTS BANNER */}
      {waiterCalls.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 p-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-amber-400 animate-bounce" />
              <span className="text-sm font-bold text-slate-900">
                Active Staff Calls ({waiterCalls.length}):
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {waiterCalls.map((call) => (
                <div
                  key={call.id}
                  className="bg-white text-slate-900 border border-amber-500/40 rounded-xl px-3 py-1.5 flex items-center gap-3 text-xs"
                >
                  <span className="font-black text-amber-400">
                    Table {call.tableNumber}:
                  </span>
                  <span className="text-slate-800">
                    {call.type === "bill_request" ? "🧾 Bill Requested" : "🛎️ Call Waiter"}
                  </span>
                  <button
                    onClick={() => handleResolveCall(call.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20 px-2 py-0.5 rounded text-[11px]"
                  >
                    Done ✓
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TABLE FLOOR GRID */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Floor Table Overview</h2>
            <p className="text-xs text-slate-500">Click any table to view active orders and update table state</p>
          </div>
          <button
            onClick={fetchFloorData}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh (4s)
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tables.map((table) => {
            const conf = statusConfig[table.status] || statusConfig.available;
            const activeOrder = orders.find(
              (o) =>
                (o.tableNumber === table.tableNumber || parseInt(o.tableNumber || "0") === parseInt(table.tableNumber)) &&
                o.orderStatus !== "completed" &&
                o.orderStatus !== "cancelled"
            );

            return (
              <div
                key={table.id}
                onClick={() => setSelectedTable(table)}
                className={`bg-white text-slate-900 rounded-2xl p-4 border-2 ${conf.border} cursor-pointer hover:scale-[1.02] transition flex flex-col justify-between shadow-xl relative`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-black text-slate-900">
                      T-{table.tableNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {table.capacity} seats
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium truncate">
                    {table.tableName || `Table ${table.tableNumber}`}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-md block text-center ${conf.bg} ${conf.text}`}
                  >
                    {conf.label}
                  </span>

                  {activeOrder && (
                    <div className="mt-2 text-[10px] text-slate-500 text-center">
                      <p className="font-bold text-slate-900">{activeOrder.orderNumber}</p>
                      <p>{formatCurrency(activeOrder.totalAmount)}</p>
                    </div>
                  )}

                  {table.status === "ready" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateTableStatus(table.tableNumber, "occupied");
                      }}
                      className="mt-2 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg text-[10px] uppercase shadow transition"
                    >
                      Mark Served ✓
                    </button>
                  )}

                  {table.status === "bill_requested" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateTableStatus(table.tableNumber, "available");
                      }}
                      className="mt-2 w-full bg-rose-500 hover:bg-rose-400 text-white font-black py-1.5 rounded-lg text-[10px] uppercase shadow transition"
                    >
                      Clear Table ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* TABLE DETAILS MODAL */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-white text-slate-900 border border-stone-200 rounded-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelectedTable(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Table {selectedTable.tableNumber} Management
                </h3>
                <p className="text-xs text-slate-500">{selectedTable.tableName} • Capacity: {selectedTable.capacity} guests</p>
              </div>
              <Link
                href={`/restaurant/${slug}?table=${selectedTable.tableNumber}`}
                target="_blank"
                className="bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-300 flex items-center gap-1"
              >
                Preview Menu <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Set Table Status */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Update Table State:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["available", "occupied", "order_pending", "preparing", "ready", "bill_requested"] as TableStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateTableStatus(selectedTable.tableNumber, st)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold capitalize transition border ${
                      selectedTable.status === st
                        ? "bg-emerald-500 text-slate-950 border-emerald-400"
                        : "bg-stone-100 text-slate-700 border-stone-200 hover:bg-stone-200"
                    }`}
                  >
                    {st.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Table Order */}
            <div className="mt-6 pt-4 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                Active Table Orders
              </h4>
              {orders.filter(
                (o) =>
                  (o.tableNumber === selectedTable.tableNumber || parseInt(o.tableNumber || "0") === parseInt(selectedTable.tableNumber)) &&
                  o.orderStatus !== "completed" &&
                  o.orderStatus !== "cancelled"
              ).length === 0 ? (
                <p className="text-xs text-slate-500 py-3">No active orders on Table {selectedTable.tableNumber}.</p>
              ) : (
                <div className="space-y-3">
                  {orders
                    .filter(
                      (o) =>
                        (o.tableNumber === selectedTable.tableNumber || parseInt(o.tableNumber || "0") === parseInt(selectedTable.tableNumber)) &&
                        o.orderStatus !== "completed" &&
                        o.orderStatus !== "cancelled"
                    )
                    .map((ord) => (
                      <div key={ord.id} className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-900 text-sm">{ord.orderNumber}</span>
                          <span className="uppercase font-bold text-emerald-400">{ord.orderStatus}</span>
                        </div>
                        <div className="space-y-1 text-slate-700">
                          {ord.items.map((i, idx) => (
                            <p key={idx}>{i.quantity}x {i.name} ({formatCurrency(i.totalPrice)})</p>
                          ))}
                        </div>
                        <div className="mt-3 pt-2 border-t border-stone-200 flex justify-between items-center font-bold">
                          <span>Total Bill: {formatCurrency(ord.totalAmount)}</span>
                          <span className={ord.paymentStatus === "paid" ? "text-emerald-400" : "text-amber-400"}>
                            {ord.paymentStatus === "paid" ? "PAID" : "UNPAID"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WaiterDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-slate-900">Loading Waiter Floor...</div>}>
      <WaiterContent />
    </Suspense>
  );
}
