"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do customers need to download an app or register an account to order?",
      a: "No! Customers never need to download an app, create an account, or log in. They simply open their standard phone camera, scan the QR code on their table, and the digital food menu loads instantly in their browser.",
    },
    {
      q: "How do table-specific QR codes work?",
      a: "Every table generated in your QRDENING dashboard receives a unique, cryptographically secured URL (e.g. /menu/your-restaurant/table-05). When scanned, the system automatically detects which table the diner is sitting at and routes their orders to that specific table on your KDS and billing screen.",
    },
    {
      q: "Can I upload actual food photos from my phone or camera?",
      a: "Yes! QRDENING provides direct image uploads from mobile galleries, phone cameras, and desktop files. You can preview, crop, resize, and replace food photos anytime. Images appear on your menu, cart, kitchen terminal, and reports.",
    },
    {
      q: "Does QRDENING work with thermal receipt printers?",
      a: "Yes! QRDENING supports both 58mm and 80mm ESC/POS thermal printers via direct browser print dialogs. You can print kitchen order tickets (KOT) as soon as orders arrive, or print final GST customer invoices with one click.",
    },
    {
      q: "What payment methods can my restaurant accept?",
      a: "You have complete control over payment settings: accept Cash, table UPI (with your custom UPI ID and dynamic QR), Pay at Counter, or Online Payment Gateways (Razorpay/Cards). You can also configure 'Pay Before Food' or 'Pay After Food' workflows.",
    },
    {
      q: "How does the restaurant registration and approval process work?",
      a: "When you register your restaurant, your account is created securely and placed under administrative review. Super Admin reviews your details and approves your account. Once approved, you log in using the exact same email and password you created during registration — you never need to register again.",
    },
    {
      q: "Can I create separate logins for kitchen staff and cashiers?",
      a: "Yes! You can add kitchen staff with 4-digit PINs who can only access the Kitchen Display System (KDS) for your restaurant. Kitchen staff cannot edit menus, view billing, change subscriptions, or access other restaurants.",
    },
    {
      q: "Is each restaurant's data isolated?",
      a: "Absolutely. QRDENING enforces strict multi-tenant database isolation. Restaurant A can never view or manipulate Restaurant B's menu, orders, tables, revenue, or customer feedback under any circumstances.",
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
                Frequently Asked Questions
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
      <main className="max-w-3xl mx-auto px-4 py-12 sm:py-16 flex-1 w-full">
        <div className="text-center mb-12">
          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> Got Questions?
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Everything you need to know about setting up QRDENING in your restaurant, cafe, cloud kitchen, or food court.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-emerald-100/80 shadow-sm overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-800 transition"
                >
                  <span>{faq.q}</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-14 bg-white rounded-3xl border border-emerald-100 p-8 text-center shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Still have questions?</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Our onboarding team is available to assist you with custom configurations or hardware inquiries.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition"
          >
            Contact Support Team <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <p>&copy; 2026 QRDENING SaaS Platform. Smart Ordering. Better Restaurant Management.</p>
      </footer>
    </div>
  );
}
