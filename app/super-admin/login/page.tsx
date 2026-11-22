"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please provide both admin email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (json.require2FA) {
        setStep("2fa");
        setError("");
      } else if (json.success) {
        router.push("/super-admin/dashboard");
      } else {
        setError(json.error || "Authentication failed. Unauthorized access attempt recorded.");
      }
    } catch {
      setError("Connection error. Security verification service unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!twoFactorCode || twoFactorCode.trim().length !== 6) {
      setError("Please enter the 6-digit Authenticator code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, twoFactorCode: twoFactorCode.trim() }),
      });

      const json = await res.json();

      if (json.success) {
        router.push("/super-admin/dashboard");
      } else {
        setError(json.error || "Invalid 2FA Authenticator code. Check your device.");
      }
    } catch {
      setError("Security verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail("admin@qrdening.com");
    setPassword("password123");
    setTwoFactorCode("749201");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Security Banner */}
      <header className="border-b border-emerald-900/60 bg-slate-900/80 backdrop-blur-md py-3.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black tracking-wider text-white">QRDENING ROOT CONTROL</span>
              <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase -mt-0.5">
                Restricted System Access
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md mx-auto w-full px-4 py-12">
        <div className="bg-slate-900/90 rounded-3xl border border-emerald-900/60 shadow-2xl p-6 sm:p-10 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Super Admin Authentication</h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Platform Owner access with mandatory 2-Factor Authentication and session audit logging.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-bold text-red-200">Access Denied</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {step === "credentials" ? (
            <form onSubmit={handleSubmitCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Platform Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="admin@qrdening.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-950/80 text-white placeholder-slate-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Root Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-950/80 text-white placeholder-slate-600 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/25 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Validating Credentials...
                  </>
                ) : (
                  <>
                    Verify Credentials & Proceed <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify2FA} className="space-y-5 animate-fade-in">
              <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-4 text-center">
                <p className="text-xs text-emerald-300 font-medium">
                  Credentials confirmed for <strong>{email}</strong>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter your 6-digit Authenticator TOTP or Security Code
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-center">
                  2FA Authenticator Code
                </label>
                <div className="relative max-w-xs mx-auto">
                  <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="749201"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-[0.4em] font-mono text-lg py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-950 text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 text-center mt-2">
                  (Demo 2FA Security Code: <code className="text-emerald-400 font-bold">749201</code>)
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || twoFactorCode.length !== 6}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authenticating Root Session...
                    </>
                  ) : (
                    <>
                      Confirm 2FA & Access Dashboard <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Quick Fill Demo */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800/80 px-3.5 py-1.5 rounded-lg transition inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Fill Super Admin Demo Credentials (admin@qrdening.com)
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-600 font-mono">
        QRDENING PLATFORM SECURE GATEWAY • IP AUDITED & RATE-LIMITED
      </footer>
    </div>
  );
}
