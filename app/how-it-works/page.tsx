import Link from "next/link";
import {
  Store,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  QrCode,
  BellRing,
  Smartphone,
  ChefHat,
  Receipt,
  Sparkles,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Register Your Restaurant",
      desc: "Create your restaurant profile with business details, address, logo, and cover photo. Your account is securely set up and reviewed by platform administration.",
      badge: "Quick 2-minute setup",
      icon: Store,
    },
    {
      num: "02",
      title: "Upload Your Menu & Photos",
      desc: "Organize dishes into categories, set prices, add mouth-watering food photos from your phone gallery or camera, configure veg/non-veg tags, spicy levels, and optional add-ons.",
      badge: "High-res photo upload",
      icon: Upload,
    },
    {
      num: "03",
      title: "Generate Table QR Codes",
      desc: "Generate scannable, cryptographically secured QR codes for each table. Download high-resolution PNGs or generate a complete printable PDF sticker tent card sheet in one click.",
      badge: "Table-wise isolation",
      icon: QrCode,
    },
    {
      num: "04",
      title: "Receive & Prepare Orders",
      desc: "Guests scan, browse photos, customize dishes, and place orders. Tickets immediately chime on your admin dashboard and kitchen KDS display with automatic KOT numbers.",
      badge: "Instant audio chime",
      icon: BellRing,
    },
  ];

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
                How It Works
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
      <main className="max-w-5xl mx-auto px-4 py-12 sm:py-16 flex-1 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 4 Simple Steps
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How QRDENING Works
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Get your restaurant up and running with contactless QR menus and smart kitchen workflows in under 10 minutes.
          </p>
        </div>

        {/* 4 Steps Timeline */}
        <div className="space-y-8">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="bg-white rounded-3xl border border-emerald-100/80 p-6 sm:p-8 shadow-md shadow-emerald-950/5 flex flex-col md:flex-row items-start md:items-center gap-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-lg shadow-emerald-600/20">
                  {st.num}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                      {st.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{st.desc}</p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 hidden md:flex items-center justify-center flex-shrink-0 border border-emerald-100">
                  <Icon className="w-7 h-7" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="mt-16 bg-white rounded-3xl border border-emerald-200 p-8 sm:p-10 text-center shadow-lg">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            Start Your Restaurant&apos;s Digital Journey Today
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-6">
            Join hundreds of food courts, cafes, and fine dining establishments streamlining operations with QRDENING.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              Register Your Restaurant Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition text-xs sm:text-sm flex items-center justify-center"
            >
              View Transparent Plans
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <p>&copy; 2026 QRDENING SaaS Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
