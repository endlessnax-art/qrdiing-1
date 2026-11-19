"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  QrCode,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ChefHat,
  Users,
  Store,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Super Admin 2FA State
  const [require2FA, setRequire2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  useEffect(() => {
    document.title = "Sign In | QRDening";
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (require2FA && (!twoFactorCode.trim() || twoFactorCode.trim().length !== 6)) {
      setErrorMessage("Please enter the 6-digit Authenticator code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
          twoFactorCode: require2FA ? twoFactorCode.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      // Check if server demands 2FA
      if (data.require2FA) {
        setRequire2FA(true);
        setIsLoading(false);
        return;
      }

      // Handle redirect if specified
      if (redirectParam && redirectParam.startsWith("/")) {
        router.push(redirectParam);
        return;
      }

      // Route based on role & restaurant
      if (data.user?.role === "super_admin") {
        router.push("/super-admin");
      } else if (data.user?.role === "kitchen_staff") {
        router.push(data.restaurant?.slug ? `/kitchen?slug=${data.restaurant.slug}` : "/kitchen");
      } else if (data.user?.role === "waiter_staff") {
        router.push(data.restaurant?.slug ? `/waiter?slug=${data.restaurant.slug}` : "/waiter");
      } else if (data.restaurant?.slug) {
        router.push(`/admin/dashboard?slug=${data.restaurant.slug}`);
      } else {
        router.push("/onboarding");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMessage("");

    try {
      const googleMock = {
        name: "Restaurant Partner",
        email: email.trim() || "partner@qrdening.com",
        googleId: "gid_partner_verified",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      };

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleMock),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Google sign in failed.");
        setGoogleLoading(false);
        return;
      }

      if (redirectParam && redirectParam.startsWith("/")) {
        router.push(redirectParam);
        return;
      }

      if (data.restaurant?.slug) {
        router.push(`/admin/dashboard?slug=${data.restaurant.slug}`);
      } else {
        router.push("/onboarding");
      }
    } catch {
      setErrorMessage("Google connection error. Please try again.");
      setGoogleLoading(false);
    }
  };

  // Only active when explicitly enabled via NEXT_PUBLIC_DEMO_MODE=true
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const fillDemoCredentials = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setRequire2FA(false);
    setTwoFactorCode("");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">

      {/* Top Header */}
      <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                QRD<span className="text-emerald-600">ening</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold block -mt-1">
                Smart Dine-in SaaS
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600 hidden sm:inline">New to QRDening?</span>
            <Link
              href="/signup"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition px-4 py-1.5 rounded-lg shadow-sm shadow-emerald-600/20 text-xs sm:text-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/60 p-6 sm:p-10">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                {require2FA ? <KeyRound className="w-6 h-6" /> : <Store className="w-6 h-6" />}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {require2FA ? "Security 2FA Verification" : "Sign In to QRDening"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {require2FA
                  ? "Enter the 6-digit Authenticator OTP to verify Super Admin access."
                  : "Manage your menus, orders, and restaurant operations."}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!require2FA ? (
              <>
                {/* 1. Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-stone-300 hover:border-slate-400 bg-white hover:bg-stone-50 text-slate-700 font-semibold text-sm transition shadow-sm disabled:opacity-60"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{googleLoading ? "Signing in..." : "Continue with Google"}</span>
                </button>

                {/* Divider */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200"></div>
                  </div>
                  <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Or sign in with email
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="owner@restaurant.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 placeholder:text-slate-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 placeholder:text-slate-400 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me (Only for non-superadmin accounts) */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
                    />
                    <label htmlFor="remember" className="text-xs text-slate-600 select-none">
                      Keep me signed in for 30 days (Restaurant accounts)
                    </label>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading || googleLoading}
                    className="w-full mt-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-60 group"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* 2FA Step for Super Admin */
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Two-factor authentication is active for root security. Enter your 6-digit code.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    6-Digit Authenticator OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    placeholder="000000"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 transition"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRequire2FA(false);
                      setTwoFactorCode("");
                    }}
                    className="flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-slate-700 font-bold text-xs transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || twoFactorCode.length !== 6}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                  </button>
                </div>
              </form>
            )}

            {/* Privacy Policy & Terms of Service */}
            <div className="mt-4 pt-4 border-t border-stone-100 text-center text-[11px] text-slate-400 flex items-center justify-center gap-3">
              <Link href="/privacy" className="hover:text-emerald-700 hover:underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-emerald-700 hover:underline">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/security" className="hover:text-emerald-700 hover:underline">
                Security Policy
              </Link>
            </div>

            {/* Demo Sandbox Access - ONLY rendered when NEXT_PUBLIC_DEMO_MODE=true */}
            {isDemoMode && (
              <div className="mt-6 pt-5 border-t border-stone-200">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
                  Sandbox Demo Access (Safe Testing Only)
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("demo.owner@qrdening.com", "password123")}
                    className="p-2 rounded-lg bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-left transition flex items-center gap-2"
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 text-[11px]">Demo Owner</div>
                      <div className="text-[10px] text-slate-500">Dashboard</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("demo.chef@qrdening.com", "1234")}
                    className="p-2 rounded-lg bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-left transition flex items-center gap-2"
                  >
                    <ChefHat className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 text-[11px]">Demo Chef</div>
                      <div className="text-[10px] text-slate-500">Kitchen KDS</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("demo.waiter@qrdening.com", "4321")}
                    className="p-2 rounded-lg bg-stone-50 hover:bg-teal-50 border border-stone-200 hover:border-teal-300 text-left transition flex items-center gap-2"
                  >
                    <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 text-[11px]">Demo Waiter</div>
                      <div className="text-[10px] text-slate-500">Floor View</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom link */}
            <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-slate-500">
              Don't have a QRDening account?{" "}
              <Link href="/signup" className="text-emerald-700 font-bold hover:underline">
                Create free trial account
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 py-6 text-center text-xs text-slate-500 bg-white/60">
        <p>© 2026 QRDening SaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-slate-500 font-semibold text-xs">
          Loading sign in...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
