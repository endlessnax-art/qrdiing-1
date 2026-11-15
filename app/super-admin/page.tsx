"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Store,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Users,
  Settings,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Edit2,
  DollarSign,
  IndianRupee,
  Layers,
  FileText,
  Sliders,
  Plus,
  X,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    ownerName: "",
    phone: "",
    email: "",
    city: "Hyderabad",
    category: "Casual Dining",
    planId: "free_trial",
    address: "Banjara Hills",
  });

  const fetchSuperAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/super-admin");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch super admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestaurant.name || !newRestaurant.ownerName || !newRestaurant.phone || !newRestaurant.email) {
      alert("Please fill in all required restaurant and owner fields.");
      return;
    }
    setOnboarding(true);
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRestaurant),
      });
      const json = await res.json();
      if (json.success) {
        setIsOnboardOpen(false);
        setNewRestaurant({
          name: "",
          ownerName: "",
          phone: "",
          email: "",
          city: "Hyderabad",
          category: "Casual Dining",
          planId: "free_trial",
          address: "Banjara Hills",
        });
        fetchSuperAdminData();
      } else {
        alert(json.error || "Failed to onboard restaurant");
      }
    } catch {
      alert("Error onboarding restaurant");
    } finally {
      setOnboarding(false);
    }
  };

  const handleToggleVerification = async (restaurantId: string) => {
    try {
      await fetch("/api/super-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_verification",
          restaurantId,
        }),
      });
      fetchSuperAdminData();
    } catch {
      alert("Failed to toggle verification");
    }
  };

  const handleToggleActive = async (restaurantId: string) => {
    try {
      await fetch("/api/super-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_active",
          restaurantId,
        }),
      });
      fetchSuperAdminData();
    } catch {
      alert("Failed to toggle status");
    }
  };

  const handleSavePlanPricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      await fetch("/api/super-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_plan_pricing",
          planId: editingPlan.id,
          monthlyPrice: editingPlan.monthlyPrice,
          yearlyPrice: editingPlan.yearlyPrice,
          menuItemLimit: editingPlan.menuItemLimit,
        }),
      });
      setEditingPlan(null);
      fetchSuperAdminData();
    } catch {
      alert("Failed to save plan pricing");
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-400">Loading Super Admin Control Panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">QRDening Super Admin</h1>
                <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Platform Owner
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Centralized Multi-Tenant Multi-Restaurant Infrastructure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 transition"
            >
              Public Landing Page →
            </Link>
            <button
              onClick={fetchSuperAdminData}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync Global Data
            </button>
          </div>
        </div>
      </header>

      {/* 2. IMPORTANT FINANCIAL DISTINCTION NOTICE */}
      <div className="bg-indigo-950/40 border-b border-indigo-500/20 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs text-indigo-200">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Architectural Rule Enforced:</strong> Platform Restaurant Sales GMV ({formatCurrency(data.totalPlatformSalesVolume)}) is isolated from QRDening SaaS Actual Subscription Revenue ({formatCurrency(data.totalPlatformRevenue)}/mo). Customer order payments never count as platform earnings.
          </span>
        </div>
      </div>

      {/* 3. PLATFORM TELEMETRY KPIS */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">QRDening SaaS Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-400 mt-2">
              {formatCurrency(data.totalPlatformRevenue)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Subs: {formatCurrency(data.monthlySubscriptionRevenue)} • Addon Packs: {formatCurrency(data.addonPackageRevenue)}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Registered Restaurants</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-2">
              {data.totalRestaurants}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              <strong className="text-emerald-400">{data.activeRestaurants}</strong> Active & Verified • {data.inactiveRestaurants} Pending
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Platform Sales Volume (GMV)</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-2">
              {formatCurrency(data.totalPlatformSalesVolume)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Across {data.totalOrders} total diner orders
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Diner Customers CRM</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-2">
              {data.totalCustomers}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Unique customer profiles with stamps
            </p>
          </div>
        </div>

        {/* 4. RESTAURANT TENANT MANAGEMENT TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white">Registered Restaurant Accounts</h2>
              <p className="text-xs text-slate-400">Inspect performance, verify accounts, and toggle tenant access</p>
            </div>
            <button
              onClick={() => setIsOnboardOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
            >
              <Plus className="w-4 h-4" /> Onboard New Restaurant
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Restaurant</th>
                  <th className="p-3.5">City & Category</th>
                  <th className="p-3.5">Active Plan</th>
                  <th className="p-3.5">Total Orders</th>
                  <th className="p-3.5">Sales GMV</th>
                  <th className="p-3.5">Verification</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {data.restaurantPerformance.map((rest: any) => (
                  <tr key={rest.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-bold text-white">
                      {rest.name}
                      <p className="text-[10px] font-mono text-slate-500">{rest.slug}</p>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {rest.city} • {rest.category}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-800 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        {rest.plan}
                      </span>
                    </td>
                    <td className="p-3.5 text-white font-semibold">{rest.totalOrders} orders</td>
                    <td className="p-3.5 font-black text-emerald-400">{formatCurrency(rest.salesVolume)}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleVerification(rest.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition ${
                          rest.isVerified
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {rest.isVerified ? "Verified ✓" : "Pending Verify"}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleActive(rest.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                          rest.isActive
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-rose-500/20 text-rose-400"
                        }`}
                      >
                        {rest.isActive ? "Active" : "Suspended"}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Link
                        href={`/admin/dashboard?slug=${rest.slug}`}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border border-slate-700"
                      >
                        Inspect Admin <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. SUBSCRIPTION PLANS & PRICING CONTROLLER (NO CODE CHANGE REQUIRED) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Subscription Tier & Pricing Control</h2>
              <p className="text-xs text-slate-400">
                Super Admin can dynamically update subscription prices and menu limits without code changes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.subscriptionPlans.map((plan: any) => (
              <div key={plan.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{plan.name}</span>
                    <button
                      onClick={() => setEditingPlan(plan)}
                      className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                      title="Edit Tier Pricing"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-black text-emerald-400">
                      {formatCurrency(plan.monthlyPrice)} <span className="text-xs font-normal text-slate-400">/ mo</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Yearly: {formatCurrency(plan.yearlyPrice)}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/80 text-xs space-y-1.5 text-slate-300">
                    <p>Allowed Items: <strong className="text-white">{plan.menuItemLimit}</strong></p>
                    <p>Table Limit: <strong className="text-white">{plan.tableLimit}</strong></p>
                    <p>Staff Limit: <strong className="text-white">{plan.staffLimit}</strong></p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingPlan(plan)}
                  className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-1.5 rounded-lg text-xs"
                >
                  Configure Tier
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 6. PLATFORM AUDIT LOGS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">Platform Security & Audit Logs</h2>
            <span className="text-xs text-slate-400">Real-time administrator audit trail</span>
          </div>

          <div className="space-y-2">
            {data.auditLogs.map((log: any) => (
              <div key={log.id} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-[10px] text-indigo-400 font-bold">
                    {log.action}
                  </span>
                  <span className="text-white font-semibold">{log.details}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {log.userName} ({log.userRole}) • {formatDate(log.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* EDIT PLAN MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-left">
            <h3 className="text-base font-bold text-white">
              Configure {editingPlan.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Changes reflect instantly for all new subscriptions</p>

            <form onSubmit={handleSavePlanPricing} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Price (₹)</label>
                <input
                  type="number"
                  required
                  value={editingPlan.monthlyPrice}
                  onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPrice: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Yearly Price (₹)</label>
                <input
                  type="number"
                  required
                  value={editingPlan.yearlyPrice}
                  onChange={(e) => setEditingPlan({ ...editingPlan, yearlyPrice: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Allowed Menu Items Limit</label>
                <input
                  type="number"
                  required
                  value={editingPlan.menuItemLimit}
                  onChange={(e) => setEditingPlan({ ...editingPlan, menuItemLimit: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-black"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ONBOARD NEW RESTAURANT MODAL */}
      {isOnboardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl my-8">
            <button
              onClick={() => setIsOnboardOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <Store className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-black text-white">Onboard New Restaurant Tenant</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Instantly create restaurant profile, isolated database account, default categories, and 5 initial tables.
            </p>

            <form onSubmit={handleCreateRestaurant} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Restaurant Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Copper Chimney"
                    value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newRestaurant.category}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Casual Dining">Casual Dining</option>
                    <option value="Fine Dining">Fine Dining</option>
                    <option value="Fast Food / QSR">Fast Food / QSR</option>
                    <option value="Café & Bakery">Café & Bakery</option>
                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                    <option value="Biryani & Kebabs">Biryani & Kebabs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad"
                    value={newRestaurant.city}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, city: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Neighborhood / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Jubilee Hills"
                    value={newRestaurant.address}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajiv Mehra"
                    value={newRestaurant.ownerName}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, ownerName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newRestaurant.phone}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="owner@restaurant.in"
                    value={newRestaurant.email}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Subscription Plan</label>
                <select
                  value={newRestaurant.planId}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, planId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="free_trial">14-Day Free Trial (₹0)</option>
                  <option value="starter">Starter Plan (₹999/mo • 30 items)</option>
                  <option value="growth">Growth Plan (₹2,499/mo • 100 items)</option>
                  <option value="enterprise_pro">Enterprise Pro (₹4,999/mo • Unlimited items)</option>
                </select>
              </div>

              <div className="mt-6 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={onboarding}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 rounded-xl text-xs transition"
                >
                  {onboarding ? "Creating Tenant..." : "Complete Onboarding"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
