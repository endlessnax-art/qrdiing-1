import Link from "next/link";
import { ArrowLeft, CheckCircle2, Receipt, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GST & Regulatory Compliance | QRDening",
  description: "Learn how QRDening ensures full 5% / 18% restaurant GST compliance, digital tax invoicing, and FSSAI transparency.",
};

export default function CompliancePage() {
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
              Statutory Guidelines
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
              GST & Regulatory Compliance
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Indian Restaurant Tax Regulations • Central & State GST Guidelines • Automated Invoicing
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" /> 1. Standard Restaurant GST Rates (5% Composition)
              </h2>
              <p>
                Under Section 9 of the Central Goods and Services Tax (CGST) Act, standalone restaurants, cloud kitchens, and cafes in India attract a flat 5% GST (2.5% CGST + 2.5% SGST) without Input Tax Credit (ITC).
              </p>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-bold text-slate-900 text-xs">How QRDening automates this for every order:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>Calculates exact 2.5% CGST and 2.5% SGST automatically on food items.</li>
                  <li>Generates customer-verifiable tax bill preview directly in the mobile QR session.</li>
                  <li>Prints 80mm thermal receipt with restaurant GSTIN, bill serial number, and timestamp.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> 2. SaaS Subscription GST (18%)
              </h2>
              <p>
                Software-as-a-Service (SaaS) platform fees charged by QRDening to restaurant partners are classified under SAC Code 998314 and attract statutory 18% GST (9% CGST + 9% SGST or 18% IGST for interstate billing). B2B tax invoices with Input Tax Credit (ITC) eligibility are automatically issued to registered restaurant businesses.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">3. Monthly Sales Reports & Reconciliation</h2>
              <p>
                Restaurant owners can export monthly and daily reports from the QRDening Admin panel. Reports provide itemized breakdowns of:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Total gross food sales</li>
                <li>CGST & SGST collections</li>
                <li>Cash vs UPI / Razorpay digital payment split</li>
                <li>Discounts and promotional coupon deductions</li>
              </ul>
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
