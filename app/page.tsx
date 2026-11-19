"use client";

import { useState, useEffect } from "react";
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
  Menu as MenuIcon,
  ShoppingBag,
  Star,
  Check,
  Flame,
  Coffee,
  Beer,
  Building2,
} from "lucide-react";
import QRCode from "qrcode";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"qr" | "ordering" | "kds" | "waiter" | "reports">("qr");
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: "", restaurant: "", phone: "", city: "" });
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroQrUrl, setHeroQrUrl] = useState<string>("");

  // Generate real camera-scannable QR code for Table 03 preview
  useEffect(() => {
    const targetUrl = "https://qrdineing.vercel.app/restaurant/arabian-delight?table=03";
    QRCode.toDataURL(targetUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: "#064E3B",
        light: "#FFFFFF",
      },
    })
      .then((url) => setHeroQrUrl(url))
      .catch((err) => console.error("Error generating hero QR:", err));
  }, []);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setIsDemoModalOpen(false);
      setDemoSubmitted(false);
      setDemoForm({ name: "", restaurant: "", phone: "", city: "" });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT & LIVE DEMO BAR */}
      <div className="bg-emerald-900 text-emerald-100 py-2 px-4 text-xs font-medium shadow-inner border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live Demo
            </span>
            <span>Multi-Tenant Dining System Active:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mx-auto sm:mx-0 text-[11px]">
            <Link
              href="/restaurant/arabian-delight?table=03"
              className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-white font-medium flex items-center gap-1 transition"
            >
              📱 Table 03 Menu <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/kitchen?slug=arabian-delight"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-2 py-0.5 rounded font-bold flex items-center gap-1 transition"
            >
              🍳 Kitchen KDS <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/waiter?slug=arabian-delight"
              className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-white font-medium flex items-center gap-1 transition"
            >
              🤵 Waiter Floor <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/restaurant/arabian-delight?table=03"
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1 transition"
            >
              🍽️ Customer QR Menu <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION BAR (AppLova Style) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                QRD<span className="text-emerald-600">ening</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 -mt-1">
                Smart Dine-In SaaS
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#hero" className="hover:text-emerald-600 transition">Home</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition">How It Works</a>
            <a href="#features" className="hover:text-emerald-600 transition">Features</a>
            <a href="#solutions" className="hover:text-emerald-600 transition">Solutions</a>
            <a href="#pricing" className="hover:text-emerald-600 transition">Pricing</a>
            <a href="#faq" className="hover:text-emerald-600 transition">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-emerald-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-emerald-600/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>Register Restaurant</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-stone-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-stone-50"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-stone-50"
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-stone-50"
            >
              Features
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-stone-50"
            >
              Solutions
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-stone-50"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-stone-50"
            >
              FAQ
            </a>
            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-xl border border-stone-300 font-bold text-sm text-slate-700"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full text-center py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-600/20"
              >
                Register Restaurant Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 3. SPLIT-LAYOUT HERO SECTION (AppLova Style) */}
      <section id="hero" className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Description & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-300 text-emerald-800 rounded-full px-3.5 py-1 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Modern Multi-Restaurant QR Dine-In Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Get Your Restaurant Online with{" "}
                <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">
                  QRDening
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                Manage QR Menus, Online Table Ordering, Kitchen Operations, Restaurant Staff and Sales Reports – All From One Powerful Platform.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/signup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 py-4 rounded-2xl text-base shadow-xl shadow-emerald-600/25 transition transform hover:-translate-y-0.5 flex items-center gap-2.5 group"
                >
                  <span>Create Your Free Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="bg-white hover:bg-stone-50 text-slate-800 font-bold px-7 py-4 rounded-2xl text-base border-2 border-stone-200 hover:border-emerald-300 shadow-sm transition"
                >
                  Book Free Demo
                </button>
              </div>

              {/* 4 Feature Badges Below Buttons */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <QrCode className="w-3.5 h-3.5" />
                  </div>
                  <span>Easy QR Menu Setup</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <span>Smart Table Ordering</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                    <ChefHat className="w-3.5 h-3.5" />
                  </div>
                  <span>Live Kitchen KDS</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Multi-Restaurant</span>
                </div>
              </div>

              {/* Trust Subtext */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 14-Day Free Trial
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No Credit Card Required
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 0% Food Commission
                </span>
              </div>
            </div>

            {/* Right Column: Premium Product Visual Mockup (AppLova SaaS Style) */}
            <div className="lg:col-span-5 relative">
              {/* Decorative background glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-200/40 via-teal-100/30 to-amber-100/40 rounded-3xl filter blur-2xl -z-10" />

              <div className="relative mx-auto max-w-[380px]">
                {/* 1. Main Mobile Phone Frame Preview */}
                <div className="bg-slate-900 rounded-[38px] p-3 shadow-2xl shadow-emerald-950/20 ring-1 ring-slate-800">
                  {/* Phone Screen Container */}
                  <div className="bg-[#FAF9F5] rounded-[30px] overflow-hidden border border-stone-300 relative text-slate-900">
                    {/* Top Phone Notch / Dynamic Island */}
                    <div className="bg-slate-900 h-5 w-32 mx-auto rounded-b-xl flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-slate-800" />
                    </div>

                    {/* Restaurant Mini Header */}
                    <div className="p-3.5 bg-white border-b border-stone-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1544025162-d76694265947?w=100&auto=format&fit=crop&q=80"
                            alt="Arabian Delight"
                            className="w-8 h-8 rounded-lg object-cover border border-stone-200"
                          />
                          <div>
                            <div className="font-extrabold text-xs text-slate-900">Arabian Delight</div>
                            <div className="text-[10px] text-emerald-700 font-bold">Table 03 • Central Majlis</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          Live Menu
                        </span>
                      </div>
                    </div>

                    {/* Sample Menu Items List */}
                    <div className="p-3 space-y-2.5 max-h-[300px] overflow-hidden">
                      {/* Dish Card 1 */}
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs flex items-center gap-2.5">
                        <img
                          src="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=160&auto=format&fit=crop&q=80"
                          alt="Chicken Mandi"
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 border border-red-500 flex items-center justify-center p-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 block" />
                            </span>
                            <span className="font-bold text-xs truncate">Chicken Mandi</span>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1">Aged basmati & tender slow-cooked chicken</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-black text-xs text-slate-900">₹420</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                              Add +
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dish Card 2 */}
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs flex items-center gap-2.5">
                        <img
                          src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=120&auto=format&fit=crop&q=80"
                          alt="Shawarma"
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 border border-red-500 flex items-center justify-center p-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 block" />
                            </span>
                            <span className="font-bold text-xs truncate">Jumbo Shawarma</span>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1">Charcoal grilled with garlic toum</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-black text-xs text-slate-900">₹160</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                              Add +
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Floating Cart Bar inside phone */}
                      <div className="bg-emerald-600 text-white p-2 rounded-xl flex items-center justify-between text-xs shadow-md">
                        <div className="flex items-center gap-1.5 font-bold">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>2 Items • ₹580</span>
                        </div>
                        <span className="text-[10px] bg-white text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                          View Order →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Floating Scannable QR Code Card (Overlapping Top-Right) */}
                <div className="absolute -top-6 -right-6 sm:-right-8 bg-white p-3 rounded-2xl border border-stone-200 shadow-xl shadow-stone-300/60 max-w-[155px] text-center animate-bounce-slow">
                  <div className="w-full aspect-square bg-white rounded-lg flex items-center justify-center border border-stone-100 p-1">
                    {heroQrUrl ? (
                      <img src={heroQrUrl} alt="Scan Table 03 QR" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-24 h-24 text-emerald-700 animate-pulse" />
                    )}
                  </div>
                  <div className="mt-1.5 font-extrabold text-[11px] text-slate-900 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Table 03 QR</span>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-tight">Point camera to test live menu</p>
                </div>

                {/* 3. Floating KDS Badge (Overlapping Bottom-Left) */}
                <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-white p-3 rounded-2xl border border-stone-200 shadow-xl shadow-stone-300/60 max-w-[170px] text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700">
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Live Kitchen KDS</span>
                  </div>
                  <div className="mt-1 font-extrabold text-xs text-slate-900">Order #AD-1042</div>
                  <div className="mt-0.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Table 03</span>
                    <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                      PREPARING
                    </span>
                  </div>
                </div>

                {/* 4. Floating Sales Metric Badge */}
                <div className="absolute top-1/2 -left-8 sm:-left-12 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-3 rounded-2xl border border-stone-200 shadow-xl shadow-stone-300/60 text-left hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Today's Sales</div>
                      <div className="text-xs font-black text-slate-900">₹28,450</div>
                    </div>
                  </div>
                  <div className="mt-1 text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <span>↑ +18.4%</span>
                    <span className="text-slate-400 font-normal">42 orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              How QRDening Modernizes Your Dining Room
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Zero complicated POS setup or expensive hardware. Go live in under 15 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 transition shadow-sm text-left relative">
              <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-emerald-600/30">
                1
              </span>
              <h3 className="text-lg font-bold text-slate-900">Create Menu & Tables</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Add food categories, portion pricing, veg/non-veg tags, and photos in your restaurant dashboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 transition shadow-sm text-left relative">
              <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-emerald-600/30">
                2
              </span>
              <h3 className="text-lg font-bold text-slate-900">Print Table Standees</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Download printable A5 acrylic standees or 12-sticker sheets with cryptographic tokens for each table.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 transition shadow-sm text-left relative">
              <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-emerald-600/30">
                3
              </span>
              <h3 className="text-lg font-bold text-slate-900">Guests Scan & Order</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Diners scan with default iPhone or Android camera. No app download. They order and pay via UPI or Cash.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 transition shadow-sm text-left relative">
              <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-emerald-600/30">
                4
              </span>
              <h3 className="text-lg font-bold text-slate-900">Kitchen KDS & Reports</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Chef receives audio chime alert, prepares order, and waiters mark served. Daily 5% GST sales are reconciled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PLATFORM FEATURES SHOWCASE */}
      <section id="features" className="py-20 bg-[#FAF9F5] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
              Complete Feature Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Everything Your Restaurant Needs to Run Seamlessly
            </h2>
          </div>

          {/* Feature Tabs Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: "qr", label: "Real Table QR Generator", icon: QrCode },
              { id: "ordering", label: "Customer Mobile Menu", icon: Smartphone },
              { id: "kds", label: "Kitchen Display (KDS)", icon: ChefHat },
              { id: "waiter", label: "Waiter Floor Terminal", icon: Users },
              { id: "reports", label: "Sales & GST Billing", icon: Receipt },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                      : "bg-white text-slate-700 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Feature Card Preview Content */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl shadow-stone-200/60 p-6 sm:p-10 max-w-5xl mx-auto">
            {activeTab === "qr" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    Scannable Table Tokens
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    High-Resolution Dynamic QR Codes for Every Single Table
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Real, scannable QR codes for every table. Test with your phone camera instantly.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Export in high-res PNG, SVG vector, and printable PDF</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 12-Sticker Sheet Generator for rapid laminating and sticking</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1-Click QR token regeneration to invalidate compromised codes</li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      href="/admin/dashboard?slug=arabian-delight&tab=tables"
                      className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm hover:underline"
                    >
                      <span>Explore Live QR Generator in Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-3">
                  <div className="w-40 h-40 mx-auto bg-white p-2 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-center">
                    {heroQrUrl ? (
                      <img src={heroQrUrl} alt="Table QR" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-32 h-32 text-emerald-700" />
                    )}
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">Arabian Delight • Table 03</div>
                  <p className="text-xs text-slate-500">Scan with camera to test live menu directly</p>
                </div>
              </div>
            )}

            {activeTab === "ordering" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    Customer Experience
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    App-Free Browser Menu with Portion Pricing & Multi-Language
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Delight guests with instant ordering. Full and half portion selections, cooking instructions ("less spicy"), veg/non-veg indicators, and coupon engine.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Supports English, Hindi (हिंदी), Telugu (తెలుగు), Urdu (اردو)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Direct UPI payment settlement to your restaurant VPA</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Interactive Spin & Win and Stamp Card loyalty gamification</li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      href="/restaurant/arabian-delight?table=03"
                      target="_blank"
                      className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm hover:underline"
                    >
                      <span>Open Live Customer Menu Preview</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs font-bold">
                    <span className="text-slate-900">Portion Selection Preview</span>
                    <span className="text-emerald-700">Arabic Mandi</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border-2 border-emerald-500 flex justify-between font-bold">
                      <span>Single Portion (1 pc)</span>
                      <span className="text-emerald-700">₹420</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex justify-between text-slate-600">
                      <span>Double Portion (2 pcs)</span>
                      <span>₹790</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "kds" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                    Kitchen Speed
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Live Kitchen Display System (KDS) with Audio Chimes
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Orders flash instantly on kitchen tablets with browser audio chimes so chefs never miss a ticket. Status updates move from NEW → ACCEPTED → PREPARING → READY → SERVED.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Preparation timer with urgent &gt;15m color alerts</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant 80mm thermal KOT printing directly from browser</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Prevents lost paper tickets and eliminates order mixups</li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      href="/kitchen?slug=arabian-delight"
                      target="_blank"
                      className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm hover:underline"
                    >
                      <span>Open Live Kitchen KDS</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-amber-900">#AD-1042</span>
                    <span className="bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">
                      PREPARING • 12m
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">Table 03 (Central Majlis)</div>
                  <div className="text-xs space-y-1 text-slate-700 pt-1 border-t border-amber-200">
                    <div>1x Yemeni Chicken Mandi (Single)</div>
                    <div className="text-[10px] text-amber-800 italic">"Extra spicy fried onions"</div>
                    <div>1x Classic Creamy Hummus with Pita</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "waiter" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
                    Floor Management
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Waiter Floor Dashboard with 1-Tap Served & Call Alerts
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Floor captains see live table occupancy, guest assistance requests ("Call Waiter", "Request Bill"), and mark dishes served with one tap.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fast PIN login for floor staff (no complex passwords)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Audio ding on new waiter calls from dining tables</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant bill print button for cash collections</li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      href="/waiter?slug=arabian-delight"
                      target="_blank"
                      className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm hover:underline"
                    >
                      <span>Open Live Waiter Terminal</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Floor Table 05</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Occupied</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                    <div className="font-bold">Active Bill: ₹903.00</div>
                    <div className="text-[11px] text-slate-500">Mutton Juicy Ribs Mandi + Kunafa</div>
                  </div>
                  <button className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs">
                    Mark Table Cleared
                  </button>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider">
                    Financial Oversight
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Automated 5% GST Invoicing & Reconciled Sales Reports
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Track every rupee in real time. Daily sales summaries, cash vs online collection split, hourly peak heatmaps, and compliant 5% GST tax invoices.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Export sales to CSV/Excel for your accountant</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Customer feedback ratings & reviews tracking</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ingredient inventory tracking with auto-deduction</li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      href="/admin/dashboard?slug=arabian-delight&tab=analytics"
                      className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm hover:underline"
                    >
                      <span>View Analytics in Admin Panel</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-900 pb-2 border-b border-stone-200">
                    <span>Today's Cash Collection</span>
                    <span>₹14,200</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pb-2 border-b border-stone-200">
                    <span>Today's UPI Collection</span>
                    <span>₹14,250</span>
                  </div>
                  <div className="flex justify-between font-black text-emerald-700 text-sm pt-1">
                    <span>Gross Revenue Reconciled</span>
                    <span>₹28,450</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. SOLUTIONS FOR EVERY RESTAURANT CONCEPT */}
      <section id="solutions" className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
              Versatile Dining Formats
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Built for Every Type of Dining Experience
            </h2>
            <p className="text-slate-600 mt-3 text-sm">
              From fast food counters to multi-floor biryani houses and café lounges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 transition text-left">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-4">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Biryani & Mandi Houses</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Effortlessly manage high-volume seating with portion pricing (Single, Full, Family Majlis) and lightning-fast kitchen turnover.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 transition text-left">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-4">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Cafés & Bakeries</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Allow guests to customize milk, syrups, and add espresso shots directly from their phone table standee.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 transition text-left">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Casual & Fine Dining</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Multi-course dining, digital customer bill preview, waiter call notifications, and compliant 5% GST tax receipts.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 transition text-left">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center font-bold mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Fast Food & QSRs</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Eliminate cashier queues. Diners scan QR stickers, pay with UPI, and pick up when their order token appears ready.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 transition text-left">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold mb-4">
                <Beer className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Pubs & Lounges</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Continuous re-ordering straight from the table during crowded live screenings and weekend music nights.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 transition text-left">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Cloud Kitchens & Takeaways</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Centralized multi-brand kitchen display, phone-based pickup alerts, and instant online revenue tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PUBLIC PRICING SECTION (INFO ONLY - NO PAYMENT CHECKOUT ON HOMEPAGE) */}
      <section id="pricing" className="py-20 bg-[#FAF9F5] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
              Transparent SaaS Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Fair Pricing for Every Restaurant Stage
            </h2>
            <p className="text-slate-600 mt-3 text-sm">
              0% commission on food sales. All online and UPI payments go directly to your restaurant bank.
            </p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Transparent pricing • All plans subject to 18% GST as applicable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free Trial */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Trial</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500 ml-1">/ 14 days</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Test live QR ordering with zero card required.</p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Up to 20 Menu Items</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 8 Table QR Codes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kitchen Display (KDS)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Waiter Dashboard</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> UPI & Cash Orders</li>
                </ul>
              </div>

              <Link
                href="/signup"
                className="mt-8 w-full bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold py-3 rounded-xl text-xs text-center transition block"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Starter Plan */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Starter</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">₹999</span>
                  <span className="text-xs text-slate-500 ml-1">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">For cafés and quick service outlets.</p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 35 Menu Items</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 15 Table QR Codes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Digital Stamp Card Loyalty</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Daily & Monthly Sales Excel</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Multi-Language Menu</li>
                </ul>
              </div>

              <Link
                href="/signup"
                className="mt-8 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-3 rounded-xl text-xs text-center transition block border border-emerald-200"
              >
                Choose Starter
              </Link>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="bg-white rounded-3xl border-2 border-emerald-600 p-6 flex flex-col justify-between relative shadow-xl shadow-emerald-600/10">
              <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Most Popular
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Growth</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">₹1,999</span>
                  <span className="text-xs text-slate-500 ml-1">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">For busy casual & fine dining restaurants.</p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 80 Menu Items</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 35 Table QR Codes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Spin & Win Gamified Loyalty</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ingredient Auto-Deduction</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Call Waiter & Table Alerts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Razorpay + UPI Auto-Sync</li>
                </ul>
              </div>

              <Link
                href="/signup"
                className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs text-center transition block shadow-md shadow-emerald-600/20"
              >
                Choose Growth
              </Link>
            </div>

            {/* Enterprise Pro */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Enterprise Pro</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">₹3,999</span>
                  <span className="text-xs text-slate-500 ml-1">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">For multi-outlet dining & large banquet halls.</p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 250+ Menu Items</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100 Table QR Codes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dedicated Account Manager</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom Domain & White-label</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hourly Peak Heatmap Analytics</li>
                </ul>
              </div>

              <Link
                href="/signup"
                className="mt-8 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold py-3 rounded-xl text-xs text-center transition block border border-indigo-200"
              >
                Choose Enterprise
              </Link>
            </div>
          </div>

          {/* Add-on Menu Packages Highlight */}
          <div className="mt-12 bg-white border border-stone-200 rounded-2xl p-6 max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" /> Extra Menu Item Packages
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Expanding your menu? Add +10 items for ₹299 or +20 items for ₹499 without upgrading your entire tier.
              </p>
            </div>
            <Link
              href="/signup"
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline"
            >
              Sign up to explore →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS / SOCIAL PROOF */}
      <section className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
              Trusted by Restaurateurs
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
              Real Impact on Real Dining Floors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF9F5] border border-stone-200 p-6 rounded-3xl shadow-xs">
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "QRDening cut our weekend order turnaround time from 25 minutes down to 11 minutes. Diners love scanning Table 03 and picking their Mandi portion without waiting for a waiter."
              </p>
              <div className="mt-4 pt-4 border-t border-stone-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  TM
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Tariq Mansoor</h4>
                  <p className="text-[11px] text-slate-500">Owner, Arabian Delight (Hyderabad)</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF9F5] border border-stone-200 p-6 rounded-3xl shadow-xs">
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "The Live Kitchen KDS is fantastic. Our chefs receive orders instantly with audio chimes. And the Daily Sales dashboard gives me exact cash vs UPI collection every night."
              </p>
              <div className="mt-4 pt-4 border-t border-stone-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  RR
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Rajeshwar Rao</h4>
                  <p className="text-[11px] text-slate-500">Managing Partner, Royal Biryani (Bengaluru)</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF9F5] border border-stone-200 p-6 rounded-3xl shadow-xs">
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "The Spin & Win wheel and Stamp Cards increased our repeat footfall by 35%. Guests love seeing their stamps accumulate on their phone without carrying plastic loyalty cards."
              </p>
              <div className="mt-4 pt-4 border-t border-stone-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                  AF
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Ayesha Fernandes</h4>
                  <p className="text-[11px] text-slate-500">Founder, Food Corner & Café (Mumbai)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-[#FAF9F5] border-b border-stone-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
              Common Questions
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group bg-white border border-stone-200 rounded-2xl p-5 shadow-xs [&_summary::-webkit-details-marker]:none">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900 font-bold text-base">
                <span>Do customers need to download any mobile app to view the menu or order?</span>
                <span className="shrink-0 rounded-full bg-stone-100 p-1.5 text-slate-500 transition group-open:-rotate-180">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                No! Customers simply open their default iPhone camera or Android Google Lens and point it at the table QR code. The digital menu opens instantly in their mobile browser with no sign-up or app download required.
              </p>
            </details>

            <details className="group bg-white border border-stone-200 rounded-2xl p-5 shadow-xs [&_summary::-webkit-details-marker]:none">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900 font-bold text-base">
                <span>How does table identification work? Can customers cheat the table number?</span>
                <span className="shrink-0 rounded-full bg-stone-100 p-1.5 text-slate-500 transition group-open:-rotate-180">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Every table QR code contains an unpredictable cryptographic token linked directly to that table in your restaurant database. Tampering with URL parameters will not spoof the table. Restaurant managers can also regenerate tokens with one click.
              </p>
            </details>

            <details className="group bg-white border border-stone-200 rounded-2xl p-5 shadow-xs [&_summary::-webkit-details-marker]:none">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900 font-bold text-base">
                <span>Does QRDening take any percentage commission on restaurant food orders?</span>
                <span className="shrink-0 rounded-full bg-stone-100 p-1.5 text-slate-500 transition group-open:-rotate-180">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Zero commission! You only pay the flat SaaS subscription fee (or start with the 14-day free trial). All customer payments via UPI or Cash go 100% directly into your restaurant bank account.
              </p>
            </details>

            <details className="group bg-white border border-stone-200 rounded-2xl p-5 shadow-xs [&_summary::-webkit-details-marker]:none">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900 font-bold text-base">
                <span>Can we add regional language menu item names?</span>
                <span className="shrink-0 rounded-full bg-stone-100 p-1.5 text-slate-500 transition group-open:-rotate-180">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Yes! QRDening supports Hindi (हिंदी), Telugu (తెలుగు), and Urdu (اردو) alongside English. You can provide customized regional dish titles and descriptions, and diners can toggle languages instantly.
              </p>
            </details>

            <details className="group bg-white border border-stone-200 rounded-2xl p-5 shadow-xs [&_summary::-webkit-details-marker]:none">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900 font-bold text-base">
                <span>What hardware is required in the kitchen?</span>
                <span className="shrink-0 rounded-full bg-stone-100 p-1.5 text-slate-500 transition group-open:-rotate-180">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Any standard Android tablet, iPad, laptop, or budget screen connected to Wi-Fi works as your Kitchen Display System (KDS). No proprietary hardware or expensive POS terminals required!
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 10. CTA SECTION */}
      <section className="py-16 bg-emerald-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Transform Your Dining Floor?
          </h2>
          <p className="mt-3 text-emerald-100 text-base max-w-xl mx-auto">
            Join 1,200+ restaurants using QRDening to increase table turns and streamline kitchen tickets.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-white hover:bg-stone-100 text-slate-950 font-extrabold px-8 py-4 rounded-xl text-base shadow-xl transition"
            >
              Start 14-Day Free Trial
            </Link>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-7 py-4 rounded-xl text-base border border-emerald-500 transition"
            >
              Book Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* 11. FOOTER SECTION */}
      <footer className="bg-slate-900 text-slate-400 text-xs pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm">
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
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2">
                <li><a href="#hero" className="hover:text-emerald-400 transition">Home</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a></li>
                <li><a href="#features" className="hover:text-emerald-400 transition">Features</a></li>
                <li><a href="#solutions" className="hover:text-emerald-400 transition">Solutions</a></li>
                <li><a href="#pricing" className="hover:text-emerald-400 transition">Pricing</a></li>
                <li><a href="#faq" className="hover:text-emerald-400 transition">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Contact & Sales</h4>
              <p className="text-xs leading-relaxed">
                QRDening SaaS Technologies India<br />
                support@qrdening.com<br />
                +91 90000 00001 (Sales & Onboarding)<br />
                Hyderabad • Bengaluru • Mumbai
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 QRDening SaaS Platform. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 font-medium">
              <Link href="/privacy" className="hover:text-emerald-400 transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-emerald-400 transition">Terms of Service</Link>
              <Link href="/compliance" className="hover:text-emerald-400 transition">GST Compliance</Link>
              <Link href="/security" className="hover:text-emerald-400 transition">Security Policy</Link>
              <Link href="/refund" className="hover:text-emerald-400 transition">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL: BOOK FREE DEMO */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl border border-stone-200">
            <button
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900">Book a Free Live Demo</h3>
            <p className="text-xs text-slate-500 mt-1">
              See how QRDening automates orders and boosts table turns for your restaurant.
            </p>

            {demoSubmitted ? (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Demo Request Received!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Our restaurant specialist will call you shortly on your provided mobile number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="mt-6 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="e.g. Tariq Mansoor"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Restaurant / Brand Name</label>
                  <input
                    type="text"
                    required
                    value={demoForm.restaurant}
                    onChange={(e) => setDemoForm({ ...demoForm, restaurant: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="e.g. Arabian Delight"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={demoForm.phone}
                    onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={demoForm.city}
                    onChange={(e) => setDemoForm({ ...demoForm, city: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="Hyderabad, Bengaluru, Mumbai"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition mt-2 shadow-md shadow-emerald-600/20"
                >
                  Confirm Demo Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
