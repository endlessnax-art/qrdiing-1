"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Store,
  Users,
  QrCode,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  Eye,
  Lock,
  Plus,
  RefreshCw,
  Sliders,
  Sparkles,
  Server,
  Layers,
} from "lucide-react";
import SupabaseConfigBanner from "../../components/SupabaseConfigBanner";
import { isSupabaseConfigured } from "../../lib/supabase/config";
import { formatCurrency } from "../../lib/utils";

// Sample registered restaurants for demonstration
const initialRestaurants = [
  {
    id: "res-1",
    name: "The Royal Plate",
    slug: "the-royal-plate",
    ownerName: "Chef Vikram Rathore",
    email: "contact@royalplate.com",
    phone: "+91 98765 43210",
    city: "Hyderabad",
    category: "Fine Dining",
    plan: "Pro Restaurant",
    mrr: 1499,
    itemsCount: 32,
    qrCount: 12,
    scansCount: 1482,
    isActive: true,
  },
  {
    id: "res-2",
    name: "Café Azure",
    slug: "cafe-azure",
    ownerName: "Ananya Sharma",
    email: "hello@cafeazure.in",
    phone: "+91 98111 22334",
    city: "Bangalore",
    category: "Café & Bakery",
    plan: "Starter",
    mrr: 0,
    itemsCount: 18,
    qrCount: 6,
    scansCount: 640,
    isActive: true,
  },
  {
    id: "res-3",
    name: "Spice Symphony",
    slug: "spice-symphony",
    ownerName: "Rajesh Malhotra",
    email: "info@spicesymphony.com",
    phone: "+91 99222 33445",
    city: "Mumbai",
    category: "Casual Dining",
    plan: "Pro Restaurant",
    mrr: 1499,
    itemsCount: 45,
    qrCount: 20,
    scansCount: 3210,
    isActive: true,
  },
  {
    id: "res-4",
    name: "Biryani & Beyond",
    slug: "biryani-and-beyond",
    ownerName: "Mohammed Farhan",
    email: "farhan@biryanibeyond.com",
    phone: "+91 97333 44556",
    city: "Hyderabad",
    category: "Biryani & Kebab",
    plan: "Enterprise",
    mrr: 3999,
    itemsCount: 62,
    qrCount: 35,
    scansCount: 5120,
    isActive: true,
  },
  {
    id: "res-5",
    name: "Wok Express Cloud Kitchen",
    slug: "wok-express",
    ownerName: "David Lee",
    email: "david@wokexpress.com",
    phone: "+91 96444 55667",
    city: "Delhi",
    category: "Cloud Kitchen",
    plan: "Starter",
    mrr: 0,
    itemsCount: 24,
    qrCount: 2,
    scansCount: 180,
    isActive: false, // Suspended / inactive demo
  },
];

export default function SuperAdminPage() {
  const supabaseConfigured = isSupabaseConfigured();

  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"restaurants" | "plans" | "security">("restaurants");

  const toggleRestaurantStatus = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === "All" || r.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const totalMrr = restaurants.reduce((acc, r) => (r.isActive ? acc + r.mrr : acc), 0);
  const totalScans = restaurants.reduce((acc, r) => acc + r.scansCount, 0);
  const activeCount = restaurants.filter((r) => r.isActive).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Banner */}
      {!supabaseConfigured && <SupabaseConfigBanner />}

      {/* Super Admin Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">QRDine</span>
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Super Admin Control
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Store className="w-4 h-4 text-brand-400" />
              <span>Restaurant Dashboard</span>
            </Link>
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Exit to SaaS Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Restaurants</span>
              <Store className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-3xl font-black text-slate-950">{restaurants.length}</div>
            <div className="mt-1 text-xs text-slate-500">
              {activeCount} Active • {restaurants.length - activeCount} Inactive
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Platform Scans</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-950">{totalScans.toLocaleString()}</div>
            <div className="mt-1 text-xs text-emerald-600 font-semibold">+24% month-over-month</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Monthly Recurring Rev</span>
              <CreditCard className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-3xl font-black text-slate-950">{formatCurrency(totalMrr)}</div>
            <div className="mt-1 text-xs text-slate-500">Active restaurant subscriptions</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">RLS Security Status</span>
              <Lock className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Isolated Tenants
            </div>
            <div className="mt-1 text-xs text-slate-500">Row Level Security enabled</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab("restaurants")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "restaurants"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Restaurant Directory ({restaurants.length})
          </button>
          <button
            onClick={() => setActiveTab("plans")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "plans"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Subscription Plans
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "security"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Platform Architecture & Health
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: RESTAURANT DIRECTORY */}
        {/* ============================================================== */}
        {activeTab === "restaurants" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">All Registered Restaurants</h2>
                <p className="text-xs text-slate-500">
                  Global directory of all restaurant tenants across QRDine
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search restaurant or owner..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Restaurant</th>
                    <th className="py-3 px-4">Owner & Contact</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Plan Tier</th>
                    <th className="py-3 px-4">Scans</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRestaurants.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-sm">{res.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          /menu/{res.slug}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">{res.ownerName}</div>
                        <div className="text-slate-500">{res.email}</div>
                        <div className="text-slate-400">{res.phone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-slate-800 font-medium">{res.city}</div>
                        <div className="text-slate-500">{res.category}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-brand-50 text-brand-700 border border-brand-200/60">
                          {res.plan}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {res.scansCount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleRestaurantStatus(res.id)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                            res.isActive
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                          }`}
                        >
                          {res.isActive ? "Active" : "Suspended"}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <Link
                          href={`/menu/${res.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold p-1"
                          title="View live menu"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Menu</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SUBSCRIPTION PLANS */}
        {/* ============================================================== */}
        {activeTab === "plans" && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tier 1
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Starter Free</h3>
              <div className="text-3xl font-black text-slate-950">₹0</div>
              <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
                <li>• Max 30 menu items</li>
                <li>• 5 Table QR codes</li>
                <li>• 1 Restaurant branch</li>
                <li>• 1 AI Menu conversion</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-brand-600 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Tier 2 (Popular)
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Pro Restaurant</h3>
              <div className="text-3xl font-black text-slate-950">₹1,499<span className="text-xs font-medium text-slate-400">/mo</span></div>
              <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
                <li>• Max 150 menu items</li>
                <li>• 50 Table QR codes</li>
                <li>• 3 Branches</li>
                <li>• 10 AI Menu conversions</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tier 3
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Enterprise Elite</h3>
              <div className="text-3xl font-black text-slate-950">₹3,999<span className="text-xs font-medium text-slate-400">/mo</span></div>
              <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
                <li>• Unlimited items</li>
                <li>• Unlimited QR codes</li>
                <li>• 15 Branches</li>
                <li>• 50 AI Menu conversions</li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SECURITY & ARCHITECTURE */}
        {/* ============================================================== */}
        {activeTab === "security" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-3xl">
            <div>
              <h2 className="text-base font-bold text-slate-900">Platform Security Architecture</h2>
              <p className="text-xs text-slate-500 mt-1">
                Multi-tenant data isolation and database-level security policies
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Lock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">PostgreSQL Row Level Security (RLS)</div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Every database query executed by restaurant owners is automatically filtered by <code className="bg-white px-1 py-0.5 border rounded font-mono">public.is_restaurant_member(restaurant_id)</code>. One restaurant cannot read, update, or delete data belonging to another tenant.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Server className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">Supabase Service Role Guard</div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    The service role key is strictly forbidden from client components. Only server-side route handlers with administrative authorization can execute elevated tasks.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">Public Menu Isolation</div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Customers accessing <code className="bg-white px-1 py-0.5 border rounded font-mono">/menu/[slug]</code> can only read active dishes of active restaurants. They cannot modify or see any private management telemetry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
