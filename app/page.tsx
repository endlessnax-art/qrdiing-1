"use client";

import { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Zap,
  Globe,
  HelpCircle,
  Clock,
  Layers,
  Store,
  ExternalLink,
  Menu as MenuIcon,
  X,
  Smartphone,
  Eye,
  Settings,
  Shield,
  FileText,
  TrendingUp,
} from "lucide-react";
import SupabaseConfigBanner from "../components/SupabaseConfigBanner";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState<"menu" | "dashboard" | "admin">("menu");

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-100 selection:text-brand-900">
      {/* Configuration Status Banner */}
      <SupabaseConfigBanner />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:bg-brand-700 transition-colors">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-950 flex items-center gap-1.5">
                QRDine
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60">
                  SaaS
                </span>
              </span>
              <span className="text-xs font-medium text-slate-500 -mt-1">
                Multi-Restaurant QR Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">
              How It Works
            </a>
            <a href="#demo" className="hover:text-brand-600 transition-colors">
              Live Demo
            </a>
            <a href="#pricing" className="hover:text-brand-600 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-md shadow-brand-600/20 hover:shadow-brand-600/30 transition-all flex items-center gap-1.5"
            >
              Create Restaurant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2 text-base font-medium text-slate-700">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-md hover:bg-slate-50"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-md hover:bg-slate-50"
              >
                How It Works
              </a>
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-md hover:bg-slate-50"
              >
                Live Demo
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-md hover:bg-slate-50"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-md hover:bg-slate-50"
              >
                FAQ
              </a>
            </nav>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg shadow"
              >
                Create Restaurant Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-brand-50/40 via-white to-white">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-brand-200/50 rounded-full blur-3xl" />
          <div className="absolute -top-12 right-1/4 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>The Multi-Tenant Digital QR Menu Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Transform Printed Menus into{" "}
            <span className="text-brand-600 underline decoration-brand-200 decoration-wavy underline-offset-8">
              Smart QR Menus
            </span>{" "}
            in Seconds.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            One central SaaS platform powering independent restaurants. Give your guests an instant contactless menu with zero app downloads, update prices in real time, and prepare for upcoming AI menu digitization.
          </p>

          {/* CTA Group */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-600/25 hover:shadow-brand-600/35 transition-all flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/menu/the-royal-plate"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5 text-brand-600" />
              View Demo Menu
            </Link>
          </div>

          {/* Proof Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs sm:text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Zero customer app required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Instant table QR code generator</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Multi-tenant Supabase security</span>
            </div>
          </div>

          {/* Interactive Hero Showcase Graphic */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-slate-900/5 p-2 sm:p-4 border border-slate-200 shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
              {/* Fake Browser Window Header */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-500 font-mono">
                  <QrCode className="w-3.5 h-3.5 text-brand-600" />
                  <span>qrdine.vercel.app/menu/the-royal-plate</span>
                </div>
                <div className="text-xs font-semibold text-brand-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Digital Menu
                </div>
              </div>

              {/* Showcase Body */}
              <div className="p-6 md:p-8 grid md:grid-cols-12 gap-8 items-center bg-slate-50/50">
                {/* Left: Customer Menu Teaser */}
                <div className="md:col-span-7 text-left space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-100 text-brand-800 text-xs font-bold uppercase">
                    Customer Experience
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                    The Royal Plate • Digital Menu
                  </h3>
                  <p className="text-sm text-slate-600">
                    Guests scan the QR code at Table 05. The menu loads instantly on iOS and Android with zero installation. They can search dishes, filter vegetarian/non-vegetarian, and see full descriptions with prices.
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-sm border border-emerald-600 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">Dal Makhani Bukhara</div>
                          <div className="text-xs text-slate-500">Overnight slow-simmered black lentils</div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900">₹360</span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-sm border border-rose-600 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">Bhatti Da Murgh Tikka</div>
                          <div className="text-xs text-slate-500">Charcoal smoked chicken with kasoori methi</div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900">₹460</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/menu/the-royal-plate"
                      className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700"
                    >
                      Open Full Customer Menu
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right: Table QR Code Visual */}
                <div className="md:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-md text-center">
                  <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                    Table Tent Card Preview
                  </div>
                  <div className="p-4 bg-brand-50/50 rounded-xl border border-brand-100 inline-block mb-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        "https://qrdine.vercel.app/menu/the-royal-plate?table=05"
                      )}`}
                      alt="Sample QR Code"
                      className="w-36 h-36 mx-auto rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="text-sm font-bold text-slate-900">Table 05 • The Royal Plate</div>
                  <div className="text-xs text-slate-500 mt-1">Scan with any smartphone camera</div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
                    <Link
                      href="/dashboard"
                      className="text-xs font-semibold px-3 py-1.5 rounded-md bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
                    >
                      Generate Your QR Codes
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Demo Switcher Section */}
      <section id="demo" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Live Exploration
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Experience Every Aspect of QRDine
            </p>
            <p className="mt-4 text-base text-slate-600">
              Test all portals built into the SaaS ecosystem. From the customer mobile menu to the restaurant owner cockpit and super admin oversight.
            </p>
          </div>

          {/* Switcher Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* 1. Customer QR Menu */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">Customer Digital Menu</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Mobile-first contactless menu. No downloads, zero login, instant dish search, category switching, and veg/non-veg tags.
                </p>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>• Fast category tabs & real-time search</div>
                  <div>• High-contrast typography for dim lighting</div>
                  <div>• Live table number detection</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/menu/the-royal-plate"
                  className="w-full py-2.5 px-4 rounded-lg bg-brand-50 text-brand-700 font-semibold text-sm hover:bg-brand-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  View Sample Menu
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 2. Restaurant Owner Dashboard */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                  <Settings className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">Restaurant Dashboard</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The private cockpit for restaurant managers. Add dishes, change prices, generate table QR codes, and preview the upcoming AI converter.
                </p>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>• Add & edit dishes and categories</div>
                  <div>• High-resolution PNG/SVG QR download</div>
                  <div>• Multi-branch management ready</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 rounded-lg bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 3. Super Admin Panel */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">Super Admin Panel</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Central administration for the platform operator. Monitor registered restaurants, toggle accounts, and manage subscriptions.
                </p>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>• Global restaurant directory</div>
                  <div>• Subscription plans & pricing tier setup</div>
                  <div>• System health & Supabase connection</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/admin"
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  Open Super Admin
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Built for Scale
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Engineered for Real Restaurant Operations
            </p>
            <p className="mt-4 text-base text-slate-600">
              Clean architecture, rock-solid security, and practical tools designed to replace expensive paper printing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-brand-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">High-Resolution Table QR Codes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate unique QR codes for Table 01, Table 02, or bar counters. Download print-ready PNG and vector SVGs for tent cards and table stickers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-brand-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">True Multi-Tenant Security</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Row Level Security (RLS) ensures each restaurant can only access its own dishes, settings, and tables. No cross-tenant data leaks.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-brand-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-slate-900">AI Photo to Digital Menu</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                  Phase 2
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Take a smartphone photo of your printed menu. AI vision analyzes layout, fonts, item names, and prices to reconstruct your digital menu.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-brand-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Real-Time Price Edits</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Changed a supplier price or ran out of the daily special? Toggle availability or edit prices in 5 seconds without reprinting paper menus.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-brand-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Multi-Branch Architecture</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Run multiple branches (e.g. Downtown, Uptown, Airport) under one restaurant brand with branch-specific addresses and table sets.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-brand-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Menu Scan Telemetry</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Understand your diners. Track how many times each table QR code is scanned, peak dining hours, and which categories get viewed most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Simple 3-Step Setup
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Go Contactless in Under 5 Minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-lg mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Register Your Restaurant</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sign up with your restaurant name and city. Your private dashboard and unique menu URL are instantly configured.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-lg mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Build Your Menu</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Add food categories and menu items with prices, descriptions, and dietary badges. (Phase 2 will let you upload printed menu photos to digitize automatically).
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-lg mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Print & Place QR Codes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Download high-resolution table QR codes. Print tent cards or stickers. Diners scan and browse your live menu immediately!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Simple Pricing
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Transparent Plans for Every Restaurant
            </p>
            <p className="mt-4 text-base text-slate-600">
              No hidden fees. Start free during the initial rollout, upgrade as your business expands.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Free Starter */}
            <div className="rounded-2xl border border-slate-200 p-8 bg-white flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Starter Trial</h3>
                <p className="text-xs text-slate-500 mt-1">For single cafés and small food outlets</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-950">₹0</span>
                  <span className="text-sm text-slate-500">/month</span>
                </div>
                <ul className="mt-8 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Up to 30 menu items</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>5 Table QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>1 Restaurant Branch</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Basic scan analytics</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="w-full block text-center py-3 rounded-xl border border-slate-300 font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Start Free
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl border-2 border-brand-600 p-8 bg-white shadow-xl shadow-brand-500/10 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Pro Restaurant</h3>
                <p className="text-xs text-slate-500 mt-1">For busy dining restaurants and bistros</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-950">₹1,499</span>
                  <span className="text-sm text-slate-500">/month</span>
                </div>
                <ul className="mt-8 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Up to 150 menu items</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>50 Table QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Up to 3 Branches</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>10 AI Menu Scans (Phase 2)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Custom branding & logo</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="w-full block text-center py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all"
                >
                  Choose Pro Plan
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl border border-slate-200 p-8 bg-white flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Enterprise</h3>
                <p className="text-xs text-slate-500 mt-1">For multi-outlet chains and hotel groups</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-950">₹3,999</span>
                  <span className="text-sm text-slate-500">/month</span>
                </div>
                <ul className="mt-8 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Unlimited menu items</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Unlimited QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Up to 15 Branches</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>50 AI Menu Scans (Phase 2)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Priority dedicated support</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="w-full block text-center py-3 rounded-xl border border-slate-300 font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Got Questions?
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">
                Do customers need to download an application to view the menu?
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                No. Customers simply point their iOS or Android camera at the QR code on the table. The digital menu opens directly in their mobile browser with zero downloads and no login required.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">
                Can one restaurant see another restaurant's menu or dashboard?
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Never. QRDine enforces strict multi-tenant isolation with database Row Level Security (RLS). Each restaurant account is locked to its authenticated members only.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">
                How does the AI Photo to Digital Menu Converter work?
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Coming in Phase 2, restaurant owners can upload photos or PDFs of their existing paper menus. Our AI vision pipeline will extract dish names, descriptions, prices, categories, and typography so you don't have to retype hundreds of items by hand.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">
                Can I generate unique QR codes for each table?
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Yes! The dashboard includes a table QR generator allowing you to generate table-specific codes (Table 01, Table 02, etc.) and download printable tent cards in PNG or SVG vector formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-white">QRDine</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-restaurant digital QR menu SaaS platform. Contactless menus, custom table QR codes, and scalable restaurant management.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                Platform
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/menu/the-royal-plate" className="hover:text-white transition-colors">
                    Customer Menu Demo
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Restaurant Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors">
                    Super Admin Panel
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Register Restaurant
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                Architecture
              </div>
              <ul className="space-y-2 text-xs">
                <li>Next.js App Router & TypeScript</li>
                <li>Supabase PostgreSQL & Auth</li>
                <li>Database Row Level Security (RLS)</li>
                <li>Tailwind CSS Royal-Blue Theme</li>
              </ul>
            </div>

            {/* Quick Access */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                Account
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>© {new Date().getFullYear()} QRDine Technologies. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>White & Royal-Blue SaaS Architecture</span>
              <span>•</span>
              <span>Multi-Tenant Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
