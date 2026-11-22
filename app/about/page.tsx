import Link from "next/link";
import {
  Store,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Users,
  Award,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-40 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-emerald-950 flex items-center gap-1">
                QRDENING
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              </span>
              <p className="text-[10px] text-emerald-800 font-semibold tracking-wider uppercase -mt-1">
                About Us
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <Link
              href="/register"
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg transition shadow-sm"
            >
              Register Restaurant
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16 flex-1 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Our Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Empowering Restaurants With Smart Ordering
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            QRDENING was born from a simple observation: dining out should be delightful, but long wait times for menus, delayed order taking, and miscommunicated kitchen tickets frustrate both guests and restaurateurs.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-emerald-100 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-3xl font-black text-emerald-800">100+</span>
              <p className="text-xs font-bold text-slate-700 mt-1">Active Dining Establishments</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-3xl font-black text-emerald-800">40%</span>
              <p className="text-xs font-bold text-slate-700 mt-1">Faster Table Turnaround</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-3xl font-black text-emerald-800">99.9%</span>
              <p className="text-xs font-bold text-slate-700 mt-1">Platform Cloud Uptime</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-lg font-black text-slate-900">What We Build</h2>
            <p>
              QRDENING provides an enterprise-grade multi-tenant SaaS platform where every restaurant receives an independent, strictly isolated command center. Restaurant owners can manage digital menus, upload food photos directly from their phone cameras, generate table QR codes, coordinate kitchen prep via live KDS terminals, and monitor revenue in real time.
            </p>
            <p>
              Best of all, guests never have to install an app or create an account. They simply scan the table QR code and immediately order their favorite meals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Strict Tenant Isolation</h4>
                <p className="text-xs text-slate-500 mt-0.5">Every restaurant&apos;s data, credentials, and orders are completely isolated.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Hardware & Thermal Compatible</h4>
                <p className="text-xs text-slate-500 mt-0.5">Works smoothly with standard 58mm and 80mm ESC/POS thermal printers.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-xl transition shadow-md shadow-emerald-600/20"
          >
            Start Your Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <p>&copy; 2026 QRDENING SaaS Platform. Built for food lovers and hospitality teams.</p>
      </footer>
    </div>
  );
}
