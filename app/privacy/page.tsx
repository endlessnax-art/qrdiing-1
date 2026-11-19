import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | QRDening",
  description: "Learn how QRDening collects, uses, and safeguards restaurant customer and operational data.",
};

export default function PrivacyPolicyPage() {
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
              Legal & Trust
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Last updated: November 2026 • Effective for all QRDening SaaS users & diner interfaces
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
              <p>
                QRDening collects necessary operational information to provide QR menu browsing, dine-in ordering, kitchen display management, and automated sales reporting:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Restaurant Partner Data:</strong> Business name, GSTIN, owner email, phone number, menu catalog, and table layout.</li>
                <li><strong>Diner Session Data:</strong> Table numbers, order items, special cooking instructions, and optional customer phone numbers for bill delivery or loyalty stamps.</li>
                <li><strong>Technical Data:</strong> IP address, device camera token verification timestamps, and browser type for security monitoring and lockout protection.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">2. How We Use Data</h2>
              <p>
                We process collected data exclusively to power real-time restaurant operations:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Transmitting customer orders to the respective restaurant kitchen display (KDS).</li>
                <li>Verifying cryptographic QR tokens to prevent unauthorized order spoofing.</li>
                <li>Generating daily and monthly sales summaries with 5% / 18% GST itemization.</li>
                <li>Facilitating direct UPI and online payments without taking intermediate custody of food revenues.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">3. Data Isolation & Tenant Boundaries</h2>
              <p>
                QRDening operates on strict multi-tenant boundary isolation. Every restaurant slug and its associated data (menus, orders, KDS queues, customer feedback) is isolated via cryptographic session tokens. A restaurant cannot access or view another restaurant&apos;s data under any circumstances.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">4. No Sale of Personal Information</h2>
              <p>
                We do NOT sell, rent, or trade diner or restaurant partner personal information to third-party advertisers or data brokers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">5. Contact Privacy Office</h2>
              <p>
                For questions regarding data protection, deletion requests, or compliance inquiries, contact our Data Protection Team at <a href="mailto:privacy@qrdening.com" className="text-emerald-700 font-bold hover:underline">privacy@qrdening.com</a>.
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
