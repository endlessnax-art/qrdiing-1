import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | QRDening",
  description: "Read the refund and subscription cancellation guidelines for QRDening restaurant SaaS plans and diner orders.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans flex flex-col">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow">
              Q
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900">QRDening</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 flex-1">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Payments & Cancellations
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
              Refund & Cancellation Policy
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Subscription Cancellations • Food Order Disputes • Settlement Guidelines
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">1. SaaS Subscription Cancellation</h2>
              <p>
                Restaurant partners may cancel their monthly or annual SaaS subscription plan at any time through the Restaurant Admin panel. When cancelled, access to premium features (unlimited tables, custom branding, loyalty stamp cards) remains active until the end of the current billing cycle.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">2. Subscription Refunds</h2>
              <p>
                New restaurant partners are entitled to a 14-day free trial without requiring credit card details. Because extensive trial access is provided prior to billing, subscription payments are non-refundable once billed. If you encounter technical service downtime exceeding 24 consecutive hours, you may request a pro-rata billing credit by contacting <a href="mailto:billing@qrdening.com" className="text-emerald-700 font-bold hover:underline">billing@qrdening.com</a>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">3. Customer Food Order Refunds</h2>
              <p>
                All online UPI and card payments made by diners at a restaurant go directly to that restaurant partner&apos;s registered merchant account (e.g. ICICI UPI VPA or Razorpay ID). QRDening is a software intermediary and does not collect or hold diner payments. Food cancellations, wrong dish deliveries, or order disputes must be settled directly with the restaurant management on the dining premises.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-6 text-center text-xs text-slate-500 bg-white">
        © 2026 QRDening SaaS Platform. All rights reserved.
      </footer>
    </div>
  );
}
