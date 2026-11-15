"use client";

import { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  UtensilsCrossed,
  ChefHat,
  Smartphone,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Users,
  Award,
  Zap,
  Globe,
  HelpCircle,
  Clock,
  Sparkles,
  Layers,
  Coins,
  Store,
  ExternalLink,
  X,
  IndianRupee,
  Receipt,
  BellRing,
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"features" | "solutions" | "pricing">("features");
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: "", restaurant: "", phone: "", city: "" });
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [regForm, setRegForm] = useState({
    name: "",
    ownerName: "",
    email: "",
    phone: "",
    city: "Hyderabad",
    category: "Biryani & Arabic",
    planId: "free_trial",
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState<any>(null);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setIsDemoModalOpen(false);
      setDemoSubmitted(false);
      setDemoForm({ name: "", restaurant: "", phone: "", city: "" });
    }, 2500);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm),
      });
      const data = await res.json();
      if (data.success) {
        setRegSuccess(data.data);
      } else {
        alert(data.error || "Failed to register restaurant");
      }
    } catch {
      alert("Error registering restaurant");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT & LIVE DEMO BAR */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-2.5 px-4 text-xs sm:text-sm font-medium text-white shadow-inner flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Live Platform
          </span>
          <span>Explore active multi-tenant system with live kitchens & QR menus:</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 mx-auto sm:mx-0">
          <Link
            href="/restaurant/arabian-delight?table=03"
            className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-white text-xs font-semibold flex items-center gap-1 transition"
          >
            📱 Table 03 Menu <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/kitchen?slug=arabian-delight"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition"
          >
            🍳 Kitchen KDS <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/waiter?slug=arabian-delight"
            className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-white text-xs font-semibold flex items-center gap-1 transition"
          >
            🤵 Waiter Floor <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/admin/dashboard?slug=arabian-delight"
            className="bg-emerald-950/70 hover:bg-emerald-950 text-emerald-200 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition"
          >
            📊 Restaurant Admin <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/super-admin"
            className="bg-slate-900/80 hover:bg-slate-950 text-indigo-300 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition"
          >
            🌐 Super Admin <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-black text-xl">
              QR
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                QRDening<span className="text-emerald-400">.</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                Restaurant SaaS
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a>
            <a href="#features" className="hover:text-emerald-400 transition">Features</a>
            <a href="#solutions" className="hover:text-emerald-400 transition">Solutions</a>
            <a href="#pricing" className="hover:text-emerald-400 transition">Pricing</a>
            <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-sm shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" /> Register Restaurant
            </button>
            <Link
              href="/admin/dashboard?slug=arabian-delight"
              className="border border-slate-700 hover:border-slate-500 text-slate-200 px-3.5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-6">
            <Sparkles className="w-3.5 h-3.5" /> India’s Leading Multi-Restaurant Ordering & KDS Ecosystem
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Transform Your Restaurant Into a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Smart Digital Restaurant.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Manage QR Menus, Table Orders, Kitchen Operations and Sales Reports – All From One Platform.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-8 py-4 rounded-xl text-base shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-7 py-4 rounded-xl text-base border border-slate-700 transition"
            >
              Book Free Demo
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 14-Day Free Trial</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Credit Card Required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Table QR Setup</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Indian GST & UPI Ready</span>
          </div>

          {/* Interactive Multi-Role Demo Switcher Card */}
          <div className="mt-16 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-5xl mx-auto shadow-2xl backdrop-blur-sm text-left">
            <div className="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  Interactive Platform Showcase
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Experience All 5 Sides of QRDening in Action
                </h3>
              </div>
              <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                Multi-Tenant Isolated Architecture
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Customer QR Menu */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 transition flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Customer Table Menu</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Auto-identifies Arabian Delight Table 03, multi-language switcher, instant cart, and UPI.
                  </p>
                </div>
                <Link
                  href="/restaurant/arabian-delight?table=03"
                  className="mt-4 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold py-2 px-3 rounded-lg text-xs text-center transition flex items-center justify-center gap-1"
                >
                  Open Table 03 Menu <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Live Kitchen KDS */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-xl p-5 transition flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Kitchen Display (KDS)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time orders, status flow NEW → PREPARING → READY, audio alerts, and customizations.
                  </p>
                </div>
                <Link
                  href="/kitchen?slug=arabian-delight"
                  className="mt-4 bg-amber-500/10 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold py-2 px-3 rounded-lg text-xs text-center transition flex items-center justify-center gap-1"
                >
                  Open Kitchen KDS <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Waiter Dashboard */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 transition flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Waiter & Floor Staff</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Table statuses (Available, Occupied, Bill Requested), waiter calling alerts, and order delivery.
                  </p>
                </div>
                <Link
                  href="/waiter?slug=arabian-delight"
                  className="mt-4 bg-blue-500/10 hover:bg-blue-400 text-blue-300 hover:text-slate-950 font-bold py-2 px-3 rounded-lg text-xs text-center transition flex items-center justify-center gap-1"
                >
                  Open Waiter Floor <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Restaurant Admin */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-xl p-5 transition flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Restaurant Admin</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Daily sales, monthly analytics, table QR generator, menu editor, coupons & inventory.
                  </p>
                </div>
                <Link
                  href="/admin/dashboard?slug=arabian-delight"
                  className="mt-4 bg-purple-500/10 hover:bg-purple-400 text-purple-300 hover:text-slate-950 font-bold py-2 px-3 rounded-lg text-xs text-center transition flex items-center justify-center gap-1"
                >
                  Open Restaurant Admin <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Super Admin */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 transition flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Super Admin Platform</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-restaurant monitoring, subscription revenue separation, plan pricing & verification.
                  </p>
                </div>
                <Link
                  href="/super-admin"
                  className="mt-4 bg-indigo-500/10 hover:bg-indigo-400 text-indigo-300 hover:text-slate-950 font-bold py-2 px-3 rounded-lg text-xs text-center transition flex items-center justify-center gap-1"
                >
                  Open Super Admin <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Table QR Tent Card Generator */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 rounded-xl p-5 transition flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Printable Table QRs</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Generate tamper-proof table QR codes in PNG or ready-to-print restaurant tent card sheets.
                  </p>
                </div>
                <Link
                  href="/admin/dashboard?slug=arabian-delight&tab=tables"
                  className="mt-4 bg-teal-500/10 hover:bg-teal-400 text-teal-300 hover:text-slate-950 font-bold py-2 px-3 rounded-lg text-xs text-center transition flex items-center justify-center gap-1"
                >
                  View QR Generator <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Streamlined Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              How QRDening Powers Your Restaurant
            </h2>
            <p className="text-slate-400 mt-3 text-base">
              From scanning the table to real-time kitchen preparation, everything works automatically without manual pen-and-paper delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative">
              <span className="absolute -top-4 -left-2 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg">
                1
              </span>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Create Restaurant</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Register online, add food categories, dishes, prices, and configure your tables in under 10 minutes.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative">
              <span className="absolute -top-4 -left-2 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg">
                2
              </span>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Place Table QRs</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Download unique table QR codes. Print beautiful table tents or acrylic stickers for every table.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative">
              <span className="absolute -top-4 -left-2 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg">
                3
              </span>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Guest Scans & Orders</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Customer scans with their mobile camera. No app download needed. Menu opens instantly in their language.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative">
              <span className="absolute -top-4 -left-2 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg">
                4
              </span>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Kitchen Prepares</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Order pops up on the Kitchen screen with sound alert. Chef marks preparing & ready. Waiter serves hot food!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES GRID */}
      <section id="features" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Complete Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Everything You Need to Run a Modern Food Business
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Tamper-Proof Table QR Codes</h3>
              <p className="text-sm text-slate-400 mt-2">
                Every table gets its own encrypted QR token. Customers cannot accidentally order for another table. Regenerate tokens anytime if compromised.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Language Menu Support</h3>
              <p className="text-sm text-slate-400 mt-2">
                Serve guests in their preferred mother tongue: English, Hindi (हिंदी), Telugu (తెలుగు), and Urdu (اردو) with instant one-tap language switching.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant UPI & Online Payments</h3>
              <p className="text-sm text-slate-400 mt-2">
                Direct restaurant payments via dynamic UPI QR (GPay, PhonePe, Paytm) + Cash at counter + Razorpay gateway integration with server-side validation.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Daily & Monthly Sales Management</h3>
              <p className="text-sm text-slate-400 mt-2">
                Know your exact business performance: Gross sales, GST/Tax, discounts, Cash vs UPI split, and hour-by-hour peak sales analysis. Export to Excel & PDF.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Stamp Card & Spin-to-Win Loyalty</h3>
              <p className="text-sm text-slate-400 mt-2">
                Turn one-time diners into regulars. Reward them with digital stamp cards (e.g. 1 stamp per ₹200) and gamified Spin & Win discounts validated on server.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Freemium Menu Item Packages</h3>
              <p className="text-sm text-slate-400 mt-2">
                Start free with 20 items. Buy flexible +10 or +20 dish add-on packs whenever your menu grows. Menu items are never deleted when a subscription expires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SOLUTIONS SECTION */}
      <section id="solutions" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Built For Your Format
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Solutions for Every Food Business
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                🍷 Fine Dining & Family Restaurants
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Elevate guest experience with high-res food photography, dietary tags (Veg/Non-Veg, Halal, Jain), course selection, and waiter call alerts.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                ☕ Cafés, Bakeries & Roasteries
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Faster counter turnarounds. Let guests sit at any table, customize milk & syrups, and pay instantly via UPI.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                🛵 Cloud Kitchens & Takeaway Spots
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Manage high order volumes with digital kitchen tickets, customer phone collection, and live prep status.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                🍔 QSR & Fast Food Counters
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Cut long customer queues. Diners scan QR stickers, order meal combos, customize toppings, and receive pickup tokens.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                🍻 Pubs, Lounges & Microbreweries
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Enable multiple rounds of ordering straight from the table without waiting for busy servers during peak weekend rushes.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                🏨 Hotel Room Service & Buffets
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Place room-specific QR codes on nightstands. Guests order breakfast and midnight snacks directly to their room.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Fair & Transparent SaaS Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Affordable Plans for Every Restaurant Size
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              No hidden commissions on your food orders. Keep 100% of your earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free Trial */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Trial</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-white">₹0</span>
                  <span className="text-xs text-slate-400 ml-1">/ 14 days</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Perfect to test live QR ordering.</p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 20 Menu Items</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 8 Table QR Codes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Kitchen Display System (KDS)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Waiter Dashboard</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> UPI & Cash Orders</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setRegForm({ ...regForm, planId: "free_trial" });
                  setIsRegisterModalOpen(true);
                }}
                className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Start Free Trial
              </button>
            </div>

            {/* Starter Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Starter</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-white">₹999</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">For cafés and quick service outlets.</p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 35 Menu Items</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 15 Table QR Codes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Digital Stamp Card Loyalty</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Daily & Monthly Sales Excel</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Language Menu</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setRegForm({ ...regForm, planId: "starter" });
                  setIsRegisterModalOpen(true);
                }}
                className="mt-8 w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold py-2.5 rounded-xl text-xs transition"
              >
                Choose Starter
              </button>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl shadow-emerald-500/10">
              <span className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Growth</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-white">₹1,999</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">For growing casual & fine dining spots.</p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 80 Menu Items</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 35 Table QR Codes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Spin & Win Gamified Loyalty</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Inventory Ingredient Deduction</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Call Waiter & Table Alerts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Razorpay Gateway Integration</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setRegForm({ ...regForm, planId: "growth" });
                  setIsRegisterModalOpen(true);
                }}
                className="mt-8 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg transition"
              >
                Choose Growth
              </button>
            </div>

            {/* Enterprise Pro */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Enterprise Pro</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-white">₹3,999</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">For large restaurants & multi-chain brands.</p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 250+ Menu Items</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100 Table QR Codes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated Account Manager</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom Domain & White-labeling</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hourly Peak Heatmap Analytics</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setRegForm({ ...regForm, planId: "enterprise" });
                  setIsRegisterModalOpen(true);
                }}
                className="mt-8 w-full bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Choose Enterprise
              </button>
            </div>
          </div>

          {/* Add-on Menu Packages Highlight */}
          <div className="mt-12 bg-slate-900/60 border border-slate-800 rounded-xl p-6 max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" /> Menu Item Add-on Packages
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Need more items on your plan? Super Admin configured packs: +10 items for ₹299 or +20 items for ₹499. No automatic data loss!
              </p>
            </div>
            <Link
              href="/admin/dashboard?slug=arabian-delight&tab=subscription"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline"
            >
              View Package Details →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Trusted Across India
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Loved by Restaurant Owners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "QRDening cut our weekend order turnaround time from 25 minutes down to 11 minutes. Diners love scanning Table 03 and picking their Mandi portion without waiting for a waiter."
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  TM
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Tariq Mansoor</h4>
                  <p className="text-[11px] text-slate-400">Owner, Arabian Delight (Hyderabad)</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "The Live Kitchen KDS is fantastic. Our chefs receive orders instantly with audio chimes. And the Daily Sales dashboard gives me exact cash vs UPI collection every night."
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  RR
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Rajeshwar Rao</h4>
                  <p className="text-[11px] text-slate-400">Managing Partner, Royal Biryani (Bengaluru)</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "The Spin & Win wheel and Stamp Cards increased our repeat footfall by 35%. Guests love seeing their stamps accumulate on their phone without carrying plastic loyalty cards."
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  AF
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Ayesha Fernandes</h4>
                  <p className="text-[11px] text-slate-400">Founder, Food Corner & Café (Mumbai)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Questions & Answers
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group bg-slate-900 border border-slate-800 rounded-xl p-5 [&_summary::-webkit-details-marker]:none">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white font-bold text-base">
                <span>Do customers need to download any mobile app to view the menu or order?</span>
                <span className="shrink-0 rounded-full bg-slate-800 p-1.5 text-slate-300 transition group-open:-rotate-180">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                No! Customers simply open their default phone camera or Google Lens and point it at the table QR code. The digital menu opens instantly in their mobile browser with no sign-up or app download required.
              </p>
            </details>

            <details className="group bg-slate-900 border border-slate-800 rounded-xl p-5 [&_summary::-webkit-details-marker]:none">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white font-bold text-base">
                <span>How does table identification work? Can customers cheat the table number?</span>
                <span className="shrink-0 rounded-full bg-slate-800 p-1.5 text-slate-300 transition group-open:-rotate-180">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Every table QR has an embedded cryptographic token linked directly to that table in the restaurant’s database. Changing URL parameters does not change the secure table identity. Restaurant managers can also regenerate tokens with one click.
              </p>
            </details>

            <details className="group bg-slate-900 border border-slate-800 rounded-xl p-5 [&_summary::-webkit-details-marker]:none">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white font-bold text-base">
                <span>Does QRDening take any percentage commission on restaurant orders?</span>
                <span className="shrink-0 rounded-full bg-slate-800 p-1.5 text-slate-300 transition group-open:-rotate-180">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Zero commission! You only pay the flat SaaS subscription fee (or use the free trial). All customer payments via UPI, Cash, or payment gateway go 100% directly into your restaurant bank account.
              </p>
            </details>

            <details className="group bg-slate-900 border border-slate-800 rounded-xl p-5 [&_summary::-webkit-details-marker]:none">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white font-bold text-base">
                <span>Can we enter translated menu item names for local languages?</span>
                <span className="shrink-0 rounded-full bg-slate-800 p-1.5 text-slate-300 transition group-open:-rotate-180">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Yes! QRDening supports Hindi (हिंदी), Telugu (తెలుగు), and Urdu (اردو) alongside English. You can provide customized regional dish titles and descriptions, and diners can toggle languages instantly.
              </p>
            </details>

            <details className="group bg-slate-900 border border-slate-800 rounded-xl p-5 [&_summary::-webkit-details-marker]:none">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white font-bold text-base">
                <span>What hardware is required in the kitchen?</span>
                <span className="shrink-0 rounded-full bg-slate-800 p-1.5 text-slate-300 transition group-open:-rotate-180">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Any standard Android tablet, iPad, laptop, or budget screen connected to Wi-Fi works as your Kitchen Display System (KDS). No proprietary hardware or expensive POS terminals required!
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 10. CTA FOOTER SECTION */}
      <footer className="bg-slate-950 text-slate-400 text-xs pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm">
                  QR
                </div>
                <span className="text-xl font-bold text-white">QRDening</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                India's premier all-in-one multi-restaurant SaaS ecosystem: Digital QR Menus, Table Ordering, Kitchen KDS, Waiter Calling, Real-time Sales, and Loyalty.
              </p>
              <p className="mt-3 text-emerald-400 font-semibold">
                Scan. Order. Manage. Grow.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Live Demos</h4>
              <ul className="space-y-2">
                <li><Link href="/restaurant/arabian-delight?table=03" className="hover:text-emerald-400 transition">Table 03 Customer Menu</Link></li>
                <li><Link href="/kitchen?slug=arabian-delight" className="hover:text-emerald-400 transition">Kitchen Display System (KDS)</Link></li>
                <li><Link href="/waiter?slug=arabian-delight" className="hover:text-emerald-400 transition">Waiter Floor Dashboard</Link></li>
                <li><Link href="/admin/dashboard?slug=arabian-delight" className="hover:text-emerald-400 transition">Restaurant Admin Panel</Link></li>
                <li><Link href="/super-admin" className="hover:text-emerald-400 transition">Super Admin Platform Control</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-emerald-400 transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a></li>
                <li><a href="#solutions" className="hover:text-emerald-400 transition">Restaurant Solutions</a></li>
                <li><a href="#pricing" className="hover:text-emerald-400 transition">Subscription Pricing</a></li>
                <li><a href="#faq" className="hover:text-emerald-400 transition">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Contact & Support</h4>
              <p className="text-xs leading-relaxed">
                QRDening SaaS Technologies India<br />
                support@qrdening.com<br />
                +91 90000 00001 (Sales & Demos)<br />
                Hyderabad • Bengaluru • Mumbai
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 QRDening SaaS Platform. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>GST Compliance</span>
              <span>Security Policy</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL 1: BOOK FREE DEMO */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md w-full relative">
            <button
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Book a Free Live Demo</h3>
            <p className="text-xs text-slate-400 mt-1">
              See how QRDening automates orders and boosts table turns for your restaurant.
            </p>

            {demoSubmitted ? (
              <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-bold text-white text-sm">Demo Request Received!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Our restaurant specialist will call you shortly on your provided mobile number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Tariq Mansoor"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Restaurant / Brand Name</label>
                  <input
                    type="text"
                    required
                    value={demoForm.restaurant}
                    onChange={(e) => setDemoForm({ ...demoForm, restaurant: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Arabian Delight"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={demoForm.phone}
                    onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={demoForm.city}
                    onChange={(e) => setDemoForm({ ...demoForm, city: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Hyderabad, Bengaluru, etc."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition mt-2"
                >
                  Confirm Demo Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER RESTAURANT */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-lg w-full relative my-8">
            <button
              onClick={() => {
                setIsRegisterModalOpen(false);
                setRegSuccess(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Register Your Restaurant on QRDening</h3>
            <p className="text-xs text-slate-400 mt-1">
              Start your 14-day free trial. Instant digital QR menu & kitchen system.
            </p>

            {regSuccess ? (
              <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="font-bold text-white text-base">Registration Successful!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Your restaurant account <strong className="text-white">{regSuccess.name}</strong> is created.
                </p>
                <div className="mt-4 p-3 bg-slate-800 rounded-lg text-left text-xs space-y-1">
                  <p><strong className="text-slate-400">Public Slug:</strong> {regSuccess.slug}</p>
                  <p><strong className="text-slate-400">Tables Created:</strong> 5 Tables with Auto-generated QRs</p>
                  <p><strong className="text-slate-400">Plan:</strong> {regSuccess.subscription?.planName}</p>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href={`/admin/dashboard?slug=${regSuccess.slug}`}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition"
                  >
                    Go to Your Restaurant Dashboard →
                  </Link>
                  <Link
                    href={`/restaurant/${regSuccess.slug}?table=01`}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-lg text-xs transition"
                  >
                    Preview Customer Table 01 Menu
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-3.5 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Restaurant Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Spice Garden Bistro"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Owner Name *</label>
                    <input
                      type="text"
                      required
                      value={regForm.ownerName}
                      onChange={(e) => setRegForm({ ...regForm, ownerName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. Rajesh Kumar"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      placeholder="+91 98765 00000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="owner@restaurant.in"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={regForm.category}
                      onChange={(e) => setRegForm({ ...regForm, category: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Casual Dining">Casual Dining</option>
                      <option value="Fine Dining">Fine Dining</option>
                      <option value="Café & Bakery">Café & Bakery</option>
                      <option value="Fast Food">Fast Food / QSR</option>
                      <option value="Biryani & Arabic">Biryani & Arabic</option>
                      <option value="Cloud Kitchen">Cloud Kitchen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={regForm.city}
                      onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition mt-3 flex items-center justify-center gap-2"
                >
                  {regLoading ? "Registering Restaurant..." : "Complete Registration & Get QR Codes"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
