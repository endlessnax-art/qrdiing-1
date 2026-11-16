"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  QrCode,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  UtensilsCrossed,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // Successful registration -> Go to Onboarding wizard
      router.push("/onboarding");
    } catch (err: any) {
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setErrorMessage("");

    // Simulate Google Sign-In with real account integration
    try {
      const googleMock = {
        name: fullName.trim() || "Restaurant Partner",
        email: email.trim() || `partner.${Date.now().toString().slice(-4)}@gmail.com`,
        googleId: `gid_${Date.now()}`,
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

      if (data.restaurant?.slug) {
        router.push(`/admin/dashboard?slug=${data.restaurant.slug}`);
      } else {
        router.push("/onboarding");
      }
    } catch {
      setErrorMessage("Google connection error. Please try email sign up.");
      setGoogleLoading(false);
    }
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
            <span className="text-slate-600 hidden sm:inline">Already registered?</span>
            <Link
              href="/login"
              className="text-emerald-700 font-bold hover:text-emerald-800 transition px-3 py-1.5 rounded-lg border border-emerald-200 hover:border-emerald-300 bg-emerald-50/50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full flex items-center justify-center">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 w-full max-w-5xl items-center">
          {/* Left Column: Value Proposition & Social Proof */}
          <div className="lg:col-span-5 space-y-6 hidden lg:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              14-Day Free Trial • Instant Setup
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Transform your tables with scannable <span className="text-emerald-600">QR dining</span>.
            </h1>

            <p className="text-slate-600 text-base leading-relaxed">
              Join 1,200+ restaurants, cafés, and food courts eliminating order queues, cutting staff stress, and boosting table turnaround by 35%.
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                { title: "Real Dynamic QR per Table", desc: "Download stickers, table tents & high-res PNG/PDF standees." },
                { title: "Live Kitchen Display System (KDS)", desc: "Sound chime, order timers & instant 80mm thermal KOT printing." },
                { title: "Zero App Download for Guests", desc: "Direct browser ordering with UPI, cash, & live kitchen progress." },
                { title: "Multi-Tenant Cloud Isolation", desc: "Your restaurant data, menu, and sales stay 100% private and secure." },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">{item.title}</h2>
                    <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial snippet */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80"
                alt="Arabian Delight"
                className="w-12 h-12 rounded-xl object-cover border border-stone-200"
              />
              <div className="text-xs">
                <p className="italic text-slate-700 font-medium">
                  "Our table turnover jumped 40% in week one. Arabian Delight runs 35 tables smoothly with just 3 waiters now."
                </p>
                <p className="text-slate-500 mt-1 font-semibold">Tariq Mansoor • Arabian Delight, Hyderabad</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sign Up Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/60 p-6 sm:p-10">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Create Your Free Account
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Get full access for 14 days. No credit card required.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
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
                <span>{googleLoading ? "Connecting with Google..." : "Continue with Google"}</span>
              </button>

              {/* Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200"></div>
                </div>
                <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Or sign up with email
                </span>
              </div>

              {/* Email Sign Up Form */}
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 placeholder:text-slate-400 transition"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="name@restaurant.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 placeholder:text-slate-400 transition"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mobile Number <span className="text-slate-400 font-normal">(for order alerts)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 placeholder:text-slate-400 transition"
                    />
                  </div>
                </div>

                {/* Password and Confirm Password */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="At least 6 chars"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 placeholder:text-slate-400 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 placeholder:text-slate-400 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Agree terms */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600 select-none">
                    I agree to QRDening's{" "}
                    <span className="text-emerald-700 font-semibold underline cursor-pointer">Terms of Service</span> and{" "}
                    <span className="text-emerald-700 font-semibold underline cursor-pointer">Privacy Policy</span>.
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || googleLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-60 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account & Continue</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom footer text */}
              <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-slate-500">
                Already have a restaurant account?{" "}
                <Link href="/login" className="text-emerald-700 font-bold hover:underline">
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 py-6 text-center text-xs text-slate-500 bg-white/60">
        <p>© 2026 QRDening SaaS. Built for modern restaurants and dining spaces.</p>
      </footer>
    </div>
  );
}
