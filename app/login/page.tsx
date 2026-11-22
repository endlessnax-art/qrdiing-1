"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { QrCode, Lock, Mail, ArrowRight, AlertCircle, Shield, Eye, EyeOff } from "lucide-react";
import { createClient } from "../../lib/supabase/client";
import { isSupabaseConfigured } from "../../lib/supabase/config";
import SupabaseConfigBanner from "../../components/SupabaseConfigBanner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"owner" | "admin">("owner");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabaseConfigured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (!supabaseConfigured) {
      setErrorMsg(
        "Supabase credentials are not configured in .env.local yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable live authentication, or use Preview Mode below."
      );
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      if (!supabase) {
        throw new Error("Unable to initialize Supabase client.");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // Check role and redirect appropriately
      const role = data.user?.user_metadata?.role;
      if (activeTab === "admin" || role === "super_admin") {
        router.push("/admin");
      } else {
        router.push(redirectTarget);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during sign in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Diagnostics Banner */}
      {!supabaseConfigured && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <SupabaseConfigBanner />
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 group">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:bg-brand-700 transition-colors">
            <QrCode className="w-7 h-7" />
          </div>
          <span className="text-3xl font-black text-slate-950 tracking-tight">QRDine</span>
        </Link>

        <h2 className="mt-6 text-center text-2xl font-extrabold text-slate-900 tracking-tight">
          {activeTab === "owner" ? "Sign in to your Restaurant" : "Super Admin Sign In"}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          {activeTab === "owner"
            ? "Manage your digital menu, QR codes, and tables"
            : "Central administration and platform management"}
        </p>

        {/* Portal Switcher Tabs */}
        <div className="mt-6 p-1 bg-slate-200/80 rounded-xl flex items-center text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab("owner");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === "owner"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Restaurant Owner
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("admin");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "admin"
                ? "bg-white text-brand-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            Super Admin
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200">
          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Setup Warning if Supabase is not configured */}
          {!supabaseConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Live Auth Not Configured
              </div>
              <p className="leading-relaxed">
                Supabase keys are not set yet in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code>. Real credential sign-ins are paused.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href={activeTab === "admin" ? "/admin" : "/dashboard"}
                  className="w-full text-center py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  Enter {activeTab === "admin" ? "Admin" : "Dashboard"} (Preview Mode)
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === "owner" ? "owner@royalplate.com" : "admin@qrdine.com"}
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <span className="ml-2">Remember this device</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-brand-600/20 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-all"
              >
                {loading ? "Authenticating..." : activeTab === "owner" ? "Sign In to Dashboard" : "Sign In as Admin"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              New to QRDine?{" "}
              <Link href="/register" className="font-bold text-brand-600 hover:text-brand-700">
                Register your restaurant here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-semibold text-slate-500">
          Loading sign in...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
