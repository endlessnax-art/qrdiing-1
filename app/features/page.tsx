import Link from "next/link";
import {
  QrCode,
  UtensilsCrossed,
  ChefHat,
  Smartphone,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Receipt,
  Layers,
  MessageSquare,
  Globe,
  BellRing,
  Award,
  Store,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "Digital QR Menu",
      icon: QrCode,
      desc: "Fast, mobile-friendly digital menus accessible directly via smartphone camera scan. No downloads or apps needed.",
    },
    {
      title: "Food Photos & Direct Upload",
      icon: ImageIcon,
      desc: "Real high-resolution food image uploads directly from camera, mobile gallery, or desktop files with auto compression.",
    },
    {
      title: "Table-Wise QR Codes",
      icon: Layers,
      desc: "Unique cryptographically secured QR codes generated for every individual dining table, room, or patio section.",
    },
    {
      title: "Instant Online Ordering",
      icon: Smartphone,
      desc: "Guests customize food items, select sizes and add-ons, add cooking instructions, and place orders directly from their table.",
    },
    {
      title: "Live Order Tracking",
      icon: Clock,
      desc: "Interactive status timeline keeping diners informed in real time: Placed → Accepted → Preparing → Ready → Served.",
    },
    {
      title: "Kitchen Display System (KDS)",
      icon: ChefHat,
      desc: "High-contrast chef terminal organizing tickets into New, Accepted, Preparing, and Ready columns with elapsed timers.",
    },
    {
      title: "Automatic KOT Generation",
      icon: Receipt,
      desc: "Instant Kitchen Order Tickets generated with independent numbering (KOT-0105), table numbers, and chef notes.",
    },
    {
      title: "Thermal Printer Support",
      icon: Printer,
      desc: "Direct browser print compatibility for 58mm and 80mm ESC/POS thermal receipt printers in kitchen and billing counters.",
    },
    {
      title: "Dynamic Menu Management",
      icon: UtensilsCrossed,
      desc: "Add categories, reorder items, mark dishes sold out in real-time, configure spice levels, veg/non-veg tags, and Jain options.",
    },
    {
      title: "Smart Table Management",
      icon: Store,
      desc: "Track table occupancy (Available, Occupied, Preparing, Ready), generate bulk QR PDF tent cards, and reassign seating.",
    },
    {
      title: "Instant Billing & Invoicing",
      icon: Receipt,
      desc: "Auto-generate GST tax invoices with discount codes, service charges, UPI QR codes, split billing, and payment status.",
    },
    {
      title: "Comprehensive Sales Reports",
      icon: TrendingUp,
      desc: "Track gross revenue, net collections, peak ordering hours, and payment method breakdowns (UPI, Cash, Online).",
    },
    {
      title: "Actionable Analytics",
      icon: Award,
      desc: "Identify best-selling dishes, low-performing menu items, average order values, and table turnover velocity.",
    },
    {
      title: "WhatsApp Order Alerts",
      icon: MessageSquare,
      desc: "Configurable WhatsApp notifications delivering order confirmations, invoices, and special offers straight to customers.",
    },
    {
      title: "Customer Feedback & Google Reviews",
      icon: BellRing,
      desc: "Capture 5-star diner ratings, feedback tags, and redirect happy customers straight to your Google Maps review page.",
    },
    {
      title: "Multi-Language Support",
      icon: Globe,
      desc: "Serve diverse guests seamlessly with multi-lingual menu translations including English, Hindi, Telugu, and Urdu.",
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
                Complete Feature Suite
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
      <main className="max-w-7xl mx-auto px-4 py-12 sm:py-16 flex-1 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Platform Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Everything Your Restaurant Needs To Excel
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            From smart table QR codes and direct food photo uploads to live kitchen terminals and sales analytics — all built into one unified platform.
          </p>
        </div>

        {/* 16 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl border border-emerald-100/80 p-6 shadow-md shadow-emerald-950/5 hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
            Ready to Transform Your Dining Experience?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed mb-6">
            Join forward-thinking restaurants and cafes that use QRDENING to elevate customer satisfaction and speed up table turns.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold px-6 py-3 rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              Register Your Restaurant <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/restaurant/arabian-delight?table=03"
              className="bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-600 font-bold px-6 py-3 rounded-xl transition text-xs sm:text-sm flex items-center justify-center"
            >
              Explore Live QR Demo
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <p>&copy; 2026 QRDENING SaaS Platform. Smart Ordering. Better Restaurant Management.</p>
      </footer>
    </div>
  );
}

function Clock(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
