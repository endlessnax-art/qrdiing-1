"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Clock,
  Ban,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Building2,
  Sparkles,
} from "lucide-react";

export default function RestaurantLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Status-specific feedback states
  const [errorStatus, setErrorStatus] = useState<"pending" | "rejected" | "suspended" | "generic" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusReason, setStatusReason] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);
    setErrorMessage("");
    setStatusReason("");

    if (!email || !password) {
      setErrorStatus("generic");
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const json = await res.json();

      if (json.success) {
        // Successful login
        const slug = json.restaurant?.slug;
        const targetUrl = slug ? `/restaurant/dashboard?slug=${slug}` : "/restaurant/dashboard";
        router.push(targetUrl);
      } else {
        // Detailed status checks
        if (json.status === "pending") {
          setErrorStatus("pending");
          setErrorMessage(json.error || "Your restaurant registration is under review. You will be able to access your dashboard after approval.");
        } else if (json.status === "rejected") {
          setErrorStatus("rejected");
          setErrorMessage(json.error || "Registration Rejected. Please contact platform support.");
          setStatusReason(json.rejectionReason || "Application credentials could not be verified.");
        } else if (json.status === "suspended") {
          setErrorStatus("suspended");
          setErrorMessage(json.error || "Account Suspended by platform administrator.");
          setStatusReason(json.suspensionReason || "Account policy check pending.");
        } else {
          setErrorStatus("generic");
          setErrorMessage(json.error || "Invalid credentials. Please verify your email and password.");
        }
      }
    } catch {
      setErrorStatus("generic");
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setErrorStatus(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-40 py-3.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
                Restaurant Portal
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-lg transition"
            >
              Register Restaurant
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md mx-auto w-full px-4 py-10 sm:py-16">
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-900/5 p-6 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-700 shadow-sm">
              <Store className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Restaurant Sign In</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Access your digital menu, active orders, live KOTs, and restaurant analytics.
            </p>
          </div>

          {/* STATUS NOTICES */}
          {errorStatus === "pending" && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="font-bold text-amber-950">Registration Under Review</p>
                <p className="mt-1 leading-relaxed">{errorMessage}</p>
                <p className="mt-2 text-[11px] text-amber-800 font-medium">
                  Support Email: <a href="mailto:support@qrdening.com" className="underline font-bold">support@qrdening.com</a>
                </p>
              </div>
            </div>
          )}

          {errorStatus === "rejected" && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-start gap-3">
              <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-950">Registration Rejected</p>
                <p className="mt-1 leading-relaxed">{errorMessage}</p>
                {statusReason && (
                  <p className="mt-1.5 text-xs text-red-700 bg-white/60 p-2 rounded-lg border border-red-200/60">
                    <strong>Reason:</strong> {statusReason}
                  </p>
                )}
                <p className="mt-2 text-[11px] text-red-800">
                  Contact Support: <a href="mailto:support@qrdening.com" className="underline font-bold">support@qrdening.com</a>
                </p>
              </div>
            </div>
          )}

          {errorStatus === "suspended" && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-950">Account Suspended</p>
                <p className="mt-1 leading-relaxed">{errorMessage}</p>
                {statusReason && (
                  <p className="mt-1.5 text-xs text-rose-700 bg-white/60 p-2 rounded-lg border border-rose-200/60">
                    <strong>Reason:</strong> {statusReason}
                  </p>
                )}
                <p className="mt-2 text-[11px] text-rose-800">
                  Please contact the platform administrator at <a href="mailto:admin@qrdening.com" className="underline font-bold">admin@qrdening.com</a> to appeal this decision.
                </p>
              </div>
            </div>
          )}

          {errorStatus === "generic" && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Owner / Staff Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-emerald-700 font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-600">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/25 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              Demo Credentials (Click to fill)
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleFillDemo("owner@arabiandelight.in")}
                className="w-full text-left p-2.5 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 text-xs transition flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-emerald-950 block">Arabian Delight (Approved Owner)</span>
                  <span className="text-slate-500 text-[10px]">owner@arabiandelight.in • password123</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Select
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("contact@royalbiryani.in")}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs transition flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 block">Royal Biryani House</span>
                  <span className="text-slate-500 text-[10px]">contact@royalbiryani.in • password123</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Select
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have a restaurant account?{" "}
            <Link href="/register" className="text-emerald-700 font-bold hover:underline">
              Register Restaurant
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
