import Link from "next/link";
import {
  Store,
  ChefHat,
  Smartphone,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Layers,
  Receipt,
  TrendingUp,
} from "lucide-react";

export default function DemoPage() {
  const demoExperiences = [
    {
      title: "Customer QR Menu Experience",
      tagline: "Guest Mobile Ordering (Table 03)",
      badge: "No Login Required",
      desc: "Experience how customers browse high-res food photos, select portions and add-ons, add custom cooking instructions, and place dine-in orders without downloading any app.",
      href: "/restaurant/arabian-delight?table=03",
      icon: Smartphone,
      ctaText: "Open Table 03 Menu",
      color: "emerald",
    },
    {
      title: "Kitchen Display System (KDS)",
      tagline: "Live Chef Order Terminal",
      badge: "Real-Time KOT",
      desc: "See orders arrive with sound alerts, track elapsed timers, organize orders across New, Preparing, and Ready stages, and print 58mm/80mm kitchen tickets.",
      href: "/kitchen?slug=arabian-delight",
      icon: ChefHat,
      ctaText: "Open Kitchen KDS",
      color: "amber",
    },
    {
      title: "Restaurant Owner Dashboard",
      tagline: "Arabian Delight Admin Panel",
      badge: "Full Access",
      desc: "Manage food items, upload real photos from camera/desktop, reorder categories, manage tables, generate printable QR stickers, apply coupon codes, and view sales reports.",
      href: "/restaurant/login",
      icon: Store,
      ctaText: "Open Restaurant Portal",
      color: "emerald",
    },
    {
      title: "Super Admin Platform Control",
      tagline: "Platform Owner Gateway",
      badge: "2FA Protected",
      desc: "Review new restaurant registration submissions, approve or suspend establishments, dynamically create subscription plans, and inspect global platform revenue.",
      href: "/super-admin/login",
      icon: ShieldCheck,
      ctaText: "Open Super Admin Portal",
      color: "slate",
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
                Interactive Demos
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
      <main className="max-w-6xl mx-auto px-4 py-12 sm:py-16 flex-1 w-full">
        {/* Banner Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center max-w-2xl mx-auto mb-10 text-xs text-amber-900 font-medium">
          <span className="bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded uppercase text-[10px] mr-2">
            Notice
          </span>
          All data within these demo environments is pre-populated for testing. You can place real test orders, hear sound chimes, and test kitchen updates safely.
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Interactive Live Showcase
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Explore QRDENING In Action
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Experience every touchpoint of our multi-restaurant SaaS platform from diner ordering to kitchen preparation and administrative control.
          </p>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoExperiences.map((exp, i) => {
            const Icon = exp.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-md shadow-emerald-950/5 flex flex-col justify-between hover:-translate-y-1 transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      {exp.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">{exp.title}</h3>
                  <p className="text-xs font-semibold text-emerald-700 mb-3">{exp.tagline}</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">{exp.desc}</p>
                </div>

                <Link
                  href={exp.href}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  {exp.ctaText} <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Ready to Register CTA */}
        <div className="mt-16 text-center bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Like what you see in the demo?</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
            Get your own isolated restaurant portal set up in minutes. Register today with our 14-day risk-free trial.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-xl transition shadow-md shadow-emerald-600/20"
          >
            Register Your Restaurant Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <p>&copy; 2026 QRDENING SaaS Platform. Demo data clearly separated from live operations.</p>
      </footer>
    </div>
  );
}
