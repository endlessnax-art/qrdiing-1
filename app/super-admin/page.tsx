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
  Clock,
  Ban,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Sparkles,
  ChevronRight,
  Download,
  Power,
  Trash2,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "pending" | "restaurants" | "plans" | "revenue" | "settings" | "audit"
  >("overview");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantFilter, setRestaurantFilter] = useState<string>("all");

  // Modals
  const [rejectModalRest, setRejectModalRest] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("Incomplete restaurant documentation");
  const [extendModalRest, setExtendModalRest] = useState<any>(null);
  const [extendDays, setExtendDays] = useState(30);

  // Plan Management Modals
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [newPlan, setNewPlan] = useState({
    id: "",
    name: "",
    description: "Ideal for growing food businesses",
    monthlyPrice: 1499,
    yearlyPrice: 14990,
    menuItemLimit: 50,
    tableLimit: 20,
    qrLimit: 20,
    staffLimit: 8,
    supportLevel: "Priority Support",
    trialDays: 14,
    features: "Digital QR Menu, KDS Integration, Analytics Export, WhatsApp Orders",
    isActive: true,
  });

  // Action status message
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  const fetchSuperAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/super-admin");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else if (res.status === 401 || res.status === 403) {
        window.location.href = "/super-admin/login";
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

  const showSuccessBanner = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(""), 4000);
  };

  const handleApprove = async (restaurantId: string) => {
    try {
      const res = await fetch("/api/super-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_restaurant", restaurantId }),
      });
      const json = await res.json();
      if (json.success) {
        showSuccessBanner("Restaurant successfully approved and activated!");
        fetchSuperAdminData();
      }
    } catch {
      alert("Failed to approve restaurant");
    }
  };

  const handleReject = async () => {
    if (!rejectModalRest) return;
    try {
      const res = await fetch("/api/super-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject_restaurant",
          restaurantId: rejectModalRest.id,
          reason: rejectionReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showSuccessBanner(`Restaurant ${rejectModalRest.name} rejected.`);
        setRejectModalRest(null);
        fetchSuperAdminData();
      }
    } catch {
      alert("Failed to reject restaurant");
    }
  };

  const handleSuspend = async (restaurantId: string) => {
    const reason = prompt("Enter suspension reason for restaurant:", "Compliance policy check");
    if (!reason) return;
    try {
      const res = await fetch("/api/super-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "suspend_restaurant", restaurantId, reason }),
      });
      const json = await res.json();
      if (json.success) {
        showSuccessBanner("Restaurant suspended.");
        fetchSuperAdminData();
      }
    } catch {
      alert("Failed to suspend restaurant");
    }
  };

  const handleActivate = async (restaurantId: string) => {
    try {
      const res = await fetch("/api/super-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate_restaurant", restaurantId }),
      });
      const json = await res.json();
      if (json.success) {
        showSuccessBanner("Restaurant reactivated successfully!");
        fetchSuperAdminData();
      }
    } catch {
      alert("Failed to activate restaurant");
    }
  };

  const handleExtendSubscription = async () => {
    if (!extendModalRest) return;
    try {
      const res = await fetch("/api/super-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "extend_subscription",
          restaurantId: extendModalRest.id,
          days: extendDays,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showSuccessBanner(`Subscription extended by ${extendDays} days for ${extendModalRest.name}`);
        setExtendModalRest(null);
        fetchSuperAdminData();
      }
    } catch {
      alert("Failed to extend subscription");
    }
  };

  const handleSaveNewPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const planId = newPlan.name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
      const featuresArr = newPlan.features.split(",").map((f) => f.trim()).filter(Boolean);

      const res = await fetch("/api/super-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_plan",
          planData: {
            ...newPlan,
            id: planId || `plan_${Date.now()}`,
            features: featuresArr,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        showSuccessBanner(`New plan "${newPlan.name}" published!`);
        setIsCreatePlanOpen(false);
        fetchSuperAdminData();
      } else {
        alert(json.error || "Failed to create plan");
      }
    } catch {
      alert("Error saving new plan");
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
      showSuccessBanner("Plan updated successfully!");
      fetchSuperAdminData();
    } catch {
      alert("Failed to save plan pricing");
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 text-slate-900">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-slate-600">Loading QRDENING Super Admin Control Panel...</p>
      </div>
    );
  }

  // Filter restaurants
  const allRestaurantsList = data.restaurants || [];
  const pendingList = allRestaurantsList.filter((r: any) => r.approvalStatus === "pending");
  const filteredRestaurants = allRestaurantsList.filter((r: any) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (restaurantFilter === "pending") return r.approvalStatus === "pending";
    if (restaurantFilter === "approved") return r.approvalStatus === "approved";
    if (restaurantFilter === "suspended") return r.approvalStatus === "suspended" || (!r.isActive && r.approvalStatus !== "pending");
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">QRDENING Super Admin</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Platform Owner
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Multi-Restaurant Platform Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pendingList.length > 0 && (
              <button
                onClick={() => setActiveTab("pending")}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse transition"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{pendingList.length} Pending Approval</span>
              </button>
            )}

            <button
              onClick={fetchSuperAdminData}
              className="p-2 text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 rounded-xl transition"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
            >
              Public Site <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* SUCCESS NOTIFICATION */}
      {actionSuccessMsg && (
        <div className="bg-emerald-600 text-white py-2.5 px-4 text-xs font-bold text-center shadow-inner flex items-center justify-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" /> {actionSuccessMsg}
        </div>
      )}

      {/* 2. SUB-NAV / TABS */}
      <div className="border-b border-emerald-100 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
          {[
            { id: "overview", label: "Dashboard Overview", icon: TrendingUp },
            { id: "pending", label: `Pending Approvals (${pendingList.length})`, icon: Clock, badge: pendingList.length > 0 },
            { id: "restaurants", label: "Restaurant Management", icon: Store },
            { id: "plans", label: "Subscription Plans", icon: Layers },
            { id: "revenue", label: "Revenue & Payments", icon: CreditCard },
            { id: "settings", label: "Platform Settings", icon: Settings },
            { id: "audit", label: "Security Audit Logs", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN TAB CONTENT */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Restaurants</span>
                  <Store className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{data.totalRestaurants}</div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{data.activeRestaurants} Live & Active</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">{data.pendingRestaurants || 0}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">
                  Requires Super Admin review
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Monthly MRR Revenue</span>
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {formatCurrency(data.monthlySubscriptionRevenue)}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">
                  Active SaaS Subscriptions
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Restaurant Orders</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{data.totalOrders}</div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  {data.ordersToday || 0} orders processed today
                </div>
              </div>
            </div>

            {/* Quick Action Pending Notice */}
            {pendingList.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-black">
                    <Clock className="w-5 h-5 text-amber-800" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-amber-950">
                      {pendingList.length} Restaurant Registration{pendingList.length > 1 ? "s" : ""} Awaiting Review
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5">
                      New restaurant owners have registered and are waiting for your approval before their dashboard activates.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("pending")}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                >
                  Review Registrations <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Recent Registrations & Active Restaurants Table */}
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" /> Restaurants Snapshot
                </h3>
                <button
                  onClick={() => setActiveTab("restaurants")}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  View All ({allRestaurantsList.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3">Restaurant</th>
                      <th className="py-2.5 px-3">Owner</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Plan</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Orders</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {allRestaurantsList.slice(0, 6).map((rest: any) => (
                      <tr key={rest.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {rest.name}
                          <span className="block text-[10px] text-slate-400 font-normal">/{rest.slug}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{rest.ownerName}</td>
                        <td className="py-3 px-3 text-slate-600">{rest.city}</td>
                        <td className="py-3 px-3">
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            {rest.subscription?.planName || "Trial"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {rest.approvalStatus === "approved" ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                            </span>
                          ) : rest.approvalStatus === "pending" ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" /> Pending
                            </span>
                          ) : (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Ban className="w-3 h-3 text-rose-600" /> Suspended
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-bold">
                          {rest.totalOrders || 0}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link
                            href={`/restaurant/dashboard?slug=${rest.slug}`}
                            className="text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1"
                          >
                            Inspect <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PENDING APPROVALS */}
        {/* ========================================================================= */}
        {activeTab === "pending" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Pending Restaurant Registrations</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Review restaurant registration details and approve or reject access.
                </p>
              </div>
            </div>

            {pendingList.length === 0 ? (
              <div className="bg-white rounded-3xl border border-emerald-100 p-12 text-center max-w-lg mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">All Registrations Reviewed!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  There are currently no restaurant applications waiting for review.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pendingList.map((rest: any) => (
                  <div
                    key={rest.id}
                    className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rest.logo || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100"}
                          alt="Logo"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{rest.name}</h4>
                          <span className="text-[11px] text-slate-500">{rest.category || "Restaurant"} • {rest.city}</span>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        Pending Approval
                      </span>
                    </div>

                    <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Owner Name:</span>
                        <span className="font-bold text-slate-800">{rest.ownerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact Email:</span>
                        <span className="font-bold text-slate-800">{rest.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Phone Number:</span>
                        <span className="font-bold text-slate-800">{rest.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Address:</span>
                        <span className="font-medium text-slate-800">{rest.address}, {rest.city}</span>
                      </div>
                      {rest.gstNumber && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">GST Number:</span>
                          <span className="font-mono font-bold text-emerald-800">{rest.gstNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                        <span>Submitted on:</span>
                        <span>{formatDate(rest.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(rest.id)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Restaurant
                      </button>

                      <button
                        onClick={() => {
                          setRejectModalRest(rest);
                          setRejectionReason("Application credentials could not be verified.");
                        }}
                        className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ALL RESTAURANTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "restaurants" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">All Registered Restaurants</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage restaurant access, approve pending submissions, suspend accounts, and extend subscriptions.
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search restaurant, owner, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-60 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={restaurantFilter}
                  onChange={(e) => setRestaurantFilter(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved & Live</option>
                  <option value="pending">Pending Approval</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Restaurants Table */}
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Restaurant</th>
                      <th className="py-3 px-4">Owner & Contact</th>
                      <th className="py-3 px-4">Subscription</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredRestaurants.map((rest: any) => (
                      <tr key={rest.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{rest.name}</div>
                          <span className="text-[11px] text-slate-500">{rest.category || "Restaurant"} • {rest.city}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-semibold">{rest.ownerName}</div>
                          <div className="text-slate-500 text-[11px]">{rest.email}</div>
                          <div className="text-slate-400 text-[10px]">{rest.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold text-[11px] border border-emerald-200">
                            {rest.subscription?.planName || "Trial"}
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-0.5">
                            ₹{rest.subscription?.monthlyPrice || 0}/mo
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                          {rest.subscription?.endDate ? formatDate(rest.subscription.endDate) : "N/A"}
                        </td>
                        <td className="py-3.5 px-4">
                          {rest.approvalStatus === "approved" ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                            </span>
                          ) : rest.approvalStatus === "pending" ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                            </span>
                          ) : (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Ban className="w-3 h-3 text-rose-600" /> Suspended
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {rest.approvalStatus === "pending" ? (
                              <button
                                onClick={() => handleApprove(rest.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition"
                              >
                                Approve
                              </button>
                            ) : rest.approvalStatus === "suspended" || !rest.isActive ? (
                              <button
                                onClick={() => handleActivate(rest.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] transition"
                              >
                                Reactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSuspend(rest.id)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-bold text-[11px] transition"
                              >
                                Suspend
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setExtendModalRest(rest);
                                setExtendDays(30);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] transition"
                            >
                              + Extend
                            </button>

                            <Link
                              href={`/restaurant/dashboard?slug=${rest.slug}`}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition flex items-center gap-1"
                            >
                              Panel <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SUBSCRIPTION PLANS DYNAMIC MANAGER */}
        {/* ========================================================================= */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">SaaS Subscription Plans (Database-Driven)</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Create, edit, or configure pricing plans. Changes dynamically reflect on the public landing and pricing page.
                </p>
              </div>

              <button
                onClick={() => setIsCreatePlanOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create New Plan
              </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {(data.subscriptionPlans || []).map((plan: any) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-sm relative ${
                    plan.isPopular ? "border-emerald-500 ring-2 ring-emerald-500/10" : "border-slate-200"
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-black text-slate-900 text-base">{plan.name}</h3>
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="text-slate-400 hover:text-emerald-700 p-1 rounded transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-emerald-800">₹{plan.monthlyPrice}</span>
                        <span className="text-xs text-slate-400 font-medium">/month</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Yearly: ₹{plan.yearlyPrice}/yr
                      </span>
                    </div>

                    <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
                      <div className="flex justify-between">
                        <span>Menu Items:</span>
                        <strong className="text-slate-800">{plan.menuItemLimit} items</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Tables Allowed:</span>
                        <strong className="text-slate-800">{plan.tableLimit} tables</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Staff Accounts:</span>
                        <strong className="text-slate-800">{plan.staffLimit} staff</strong>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-600">
                      <p className="font-bold text-slate-800 text-xs mb-1">Included Features:</p>
                      {plan.features?.slice(0, 5).map((f: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="w-full mt-5 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-emerald-800 font-bold text-xs transition"
                  >
                    Edit Plan Settings
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: REVENUE & PAYMENTS */}
        {/* ========================================================================= */}
        {activeTab === "revenue" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Platform Revenue & Financial Breakdown</h2>
              <p className="text-xs text-slate-500 mt-1">
                Distinction between QRDENING SaaS subscription platform revenue and gross restaurant diner transactions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Monthly Subscription Revenue (MRR)
                </span>
                <div className="text-3xl font-black text-emerald-800">
                  {formatCurrency(data.monthlySubscriptionRevenue)}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Platform recurring software licenses</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Diner Volume Processed
                </span>
                <div className="text-3xl font-black text-slate-900">
                  {formatCurrency(data.totalPlatformSalesVolume)}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Gross restaurant guest dining sales</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Orders Delivered
                </span>
                <div className="text-3xl font-black text-slate-900">{data.totalOrders} orders</div>
                <p className="text-[11px] text-slate-500 mt-1">Across all subscribed establishments</p>
              </div>
            </div>

            {/* Restaurant-wise Revenue Breakdown */}
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600" /> Restaurant-Wise Platform Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3">Restaurant</th>
                      <th className="py-2.5 px-3">Plan Enrolled</th>
                      <th className="py-2.5 px-3">SaaS Fee</th>
                      <th className="py-2.5 px-3">Diner Orders</th>
                      <th className="py-2.5 px-3">Diner Sales Volume</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {data.restaurantPerformance?.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-bold text-slate-900">{p.name}</td>
                        <td className="py-3 px-3 text-slate-600">{p.plan}</td>
                        <td className="py-3 px-3 font-bold text-emerald-800">
                          {p.plan === "14-Day Free Trial" ? "Free" : "₹999 - ₹3,999/mo"}
                        </td>
                        <td className="py-3 px-3 text-slate-700">{p.totalOrders}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{formatCurrency(p.salesVolume)}</td>
                        <td className="py-3 px-3">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: PLATFORM SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-black text-slate-900">Platform Global Settings</h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure brand information, contact details, default currency, and maintenance modes.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Platform Brand Name</label>
                  <input
                    type="text"
                    defaultValue="QRDENING"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Platform Tagline</label>
                  <input
                    type="text"
                    defaultValue="Smart Ordering. Better Restaurant Management."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    defaultValue="support@qrdening.com"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Support Phone</label>
                  <input
                    type="text"
                    defaultValue="+91 90000 00001"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Default Currency</label>
                  <select className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500">
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="AED">AED (د.إ - UAE Dirham)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Maintenance Mode</label>
                  <select className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500">
                    <option value="off">Off (System Normal)</option>
                    <option value="on">On (Under Maintenance)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => showSuccessBanner("Platform settings successfully updated!")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-sm"
                >
                  Save Platform Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SECURITY AUDIT LOGS */}
        {/* ========================================================================= */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Security & Operational Audit Logs</h2>
              <p className="text-xs text-slate-500 mt-1">
                Real-time immutable audit trail of super admin actions, restaurant approvals, suspensions, and logins.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(data.auditLogs || []).map((log: any) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono text-[10px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-semibold">{log.userName}</td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">{log.userRole}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.details}</td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[10px]">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* REJECT MODAL */}
      {/* ========================================================================= */}
      {rejectModalRest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-2">
              Reject Restaurant Application
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Enter the reason why <strong>{rejectModalRest.name}</strong> is being rejected. This reason will be displayed to the owner when they attempt to sign in.
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-red-500 mb-4"
              placeholder="Enter rejection reason..."
            />

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setRejectModalRest(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXTEND SUBSCRIPTION MODAL */}
      {/* ========================================================================= */}
      {extendModalRest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-2">
              Extend Subscription
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Select additional days to extend the active subscription for <strong>{extendModalRest.name}</strong>.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "+30 Days (1 Month)", val: 30 },
                { label: "+90 Days (Quarter)", val: 90 },
                { label: "+180 Days (Half Year)", val: 180 },
                { label: "+365 Days (1 Year)", val: 365 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setExtendDays(opt.val)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                    extendDays === opt.val
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setExtendModalRest(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExtendSubscription}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
              >
                Apply Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE PLAN MODAL */}
      {/* ========================================================================= */}
      {isCreatePlanOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Create New Subscription Plan</h3>
              <button onClick={() => setIsCreatePlanOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Plus"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPlan.monthlyPrice}
                    onChange={(e) => setNewPlan({ ...newPlan, monthlyPrice: Number(e.target.value) })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Yearly Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPlan.yearlyPrice}
                    onChange={(e) => setNewPlan({ ...newPlan, yearlyPrice: Number(e.target.value) })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Menu Items Limit</label>
                  <input
                    type="number"
                    required
                    value={newPlan.menuItemLimit}
                    onChange={(e) => setNewPlan({ ...newPlan, menuItemLimit: Number(e.target.value) })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Table Limit</label>
                  <input
                    type="number"
                    required
                    value={newPlan.tableLimit}
                    onChange={(e) => setNewPlan({ ...newPlan, tableLimit: Number(e.target.value) })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff Limit</label>
                  <input
                    type="number"
                    required
                    value={newPlan.staffLimit}
                    onChange={(e) => setNewPlan({ ...newPlan, staffLimit: Number(e.target.value) })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Features (Comma separated)</label>
                <textarea
                  rows={2}
                  value={newPlan.features}
                  onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatePlanOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  Publish Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT PLAN PRICING MODAL */}
      {/* ========================================================================= */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-3">
              Edit Plan: {editingPlan.name}
            </h3>
            <form onSubmit={handleSavePlanPricing} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Price (₹)</label>
                <input
                  type="number"
                  required
                  value={editingPlan.monthlyPrice}
                  onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPrice: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Yearly Price (₹)</label>
                <input
                  type="number"
                  required
                  value={editingPlan.yearlyPrice}
                  onChange={(e) => setEditingPlan({ ...editingPlan, yearlyPrice: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Menu Items Limit</label>
                <input
                  type="number"
                  required
                  value={editingPlan.menuItemLimit}
                  onChange={(e) => setEditingPlan({ ...editingPlan, menuItemLimit: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
