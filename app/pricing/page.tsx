"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Store,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Clock,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { PlatformSubscriptionPlan } from "@/lib/db/types";

export default function PricingPage() {
  const [plans, setPlans] = useState<PlatformSubscriptionPlan[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setPlans(json.data);
        }
      })
      .catch((err) => console.error("Error fetching pricing plans:", err))
      .finally(() => setLoading(false));
  }, []);

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
                Transparent Pricing
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
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Database-Powered Plans
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Choose the perfect plan for your food business. Start with a 14-day free trial, upgrade anytime, and scale with real database limits.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl mt-6 border border-slate-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                billingCycle === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                billingCycle === "yearly" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-1.5 py-0.2 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading live subscription plans from database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const price = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
              const period = billingCycle === "yearly" ? "/year" : "/month";

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-lg shadow-emerald-950/5 relative transition hover:-translate-y-1 ${
                    plan.isPopular
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10"
                      : "border-emerald-100"
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px]">
                      {plan.description || "Designed for active dining establishments."}
                    </p>

                    <div className="my-5 pb-5 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-emerald-800">₹{price}</span>
                        <span className="text-xs font-semibold text-slate-500">{period}</span>
                      </div>
                      {billingCycle === "yearly" && plan.monthlyPrice > 0 && (
                        <span className="text-[11px] text-emerald-700 font-bold block mt-1">
                          Equivalent to ₹{Math.round(price / 12)}/month
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-700 mb-6 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100/60">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Menu Limit:</span>
                        <strong className="text-slate-900">{plan.menuItemLimit} Items</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Table QR Codes:</span>
                        <strong className="text-slate-900">{plan.tableLimit} Tables</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Staff Accounts:</span>
                        <strong className="text-slate-900">{plan.staffLimit} Users</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Support:</span>
                        <strong className="text-slate-900">{plan.supportLevel || "Standard"}</strong>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <p className="font-bold text-slate-900 mb-2">Key Features:</p>
                      {plan.features?.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/register?plan=${plan.id}`}
                    className={`w-full mt-8 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md ${
                      plan.isPopular
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    Choose {plan.name} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Feature Comparison Guarantee */}
        <div className="mt-16 bg-white rounded-3xl border border-emerald-100 p-8 text-center max-w-3xl mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <h3 className="text-lg font-black text-slate-900">14-Day Risk-Free Trial On All Plans</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
            No long-term contracts. No credit card required upfront. Register your restaurant, upload food photos, generate table QR codes, and start serving orders right away.
          </p>
          <div className="mt-5">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md shadow-emerald-600/20"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <p>&copy; 2026 QRDENING SaaS Platform. All plans dynamically fetched from live system database.</p>
      </footer>
    </div>
  );
}
