"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  Lock,
  ArrowRight,
  AlertCircle,
  Store,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

export default function KitchenLoginPage() {
  const router = useRouter();
  const [restaurantSlug, setRestaurantSlug] = useState("arabian-delight");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMode, setLoginMode] = useState<"pin" | "email">("pin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleKitchenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (loginMode === "pin" && !pin) {
      setError("Please enter your 4-digit kitchen staff PIN.");
      return;
    }

    if (loginMode === "email" && (!email || !password)) {
      setError("Please enter staff email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/kitchen-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantSlug,
          pin: loginMode === "pin" ? pin : undefined,
          email: loginMode === "email" ? email : undefined,
          password: loginMode === "email" ? password : undefined,
        }),
      });

      const json = await res.json();
      if (json.success && json.redirectUrl) {
        router.push(json.redirectUrl);
      } else {
        setError(json.error || "Authentication failed. Please verify credentials.");
      }
    } catch {
      setError("Network error. Could not connect to kitchen terminal service.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleQuickFill = () => {
    setRestaurantSlug("arabian-delight");
    setLoginMode("pin");
    setPin("1234");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between selection:bg-amber-500 selection:text-slate-900">
      {/* Header */}
      <header className="border-b border-amber-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 py-3.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                QRDENING
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
              </span>
              <p className="text-[10px] text-amber-700 font-bold tracking-wider uppercase -mt-1">
                Kitchen Display System (KDS)
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/restaurant/login"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              Restaurant Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Terminal Login */}
      <main className="max-w-md mx-auto w-full px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-amber-200 shadow-xl shadow-amber-900/5 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3 text-amber-700 shadow-sm">
              <ChefHat className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Kitchen Staff Terminal</h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to receive live table orders, update kitchen preparation stages, and print KOTs.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Mode Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setLoginMode("pin");
                setError("");
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                loginMode === "pin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              4-Digit PIN Access
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode("email");
                setError("");
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                loginMode === "email" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Staff Email / Password
            </button>
          </div>

          <form onSubmit={handleKitchenLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Restaurant</label>
              <select
                value={restaurantSlug}
                onChange={(e) => setRestaurantSlug(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50/50"
              >
                <option value="arabian-delight">Arabian Delight (Demo)</option>
                <option value="royal-biryani">Royal Biryani House</option>
                <option value="food-corner">Food Corner & Café</option>
              </select>
            </div>

            {loginMode === "pin" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 text-center">
                    Enter Kitchen Staff PIN
                  </label>
                  {/* PIN Display Dots */}
                  <div className="flex justify-center gap-3 mb-4">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition ${
                          pin[idx]
                            ? "border-amber-500 bg-amber-50/50 text-slate-900 scale-105"
                            : "border-slate-200 bg-slate-50 text-slate-300"
                        }`}
                      >
                        {pin[idx] ? "•" : ""}
                      </div>
                    ))}
                  </div>

                  {/* Keypad */}
                  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "←"].map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (key === "C") setPin("");
                          else if (key === "←") handleBackspace();
                          else handlePinInput(key);
                        }}
                        className="py-3 rounded-xl bg-slate-100 hover:bg-amber-100/70 text-slate-800 font-black text-base active:scale-95 transition"
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff Email</label>
                  <input
                    type="email"
                    required
                    placeholder="kitchen@restaurant.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Staff password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50/50"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (loginMode === "pin" && pin.length < 4)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Opening Kitchen KDS...
                </>
              ) : (
                <>
                  Enter Kitchen Display <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Demo */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3.5 py-1.5 rounded-lg transition inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Fill Demo (Chef Zaheer • PIN: 1234)
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <p>&copy; 2026 QRDENING KDS Terminal. Kitchen Staff Interface.</p>
      </footer>
    </div>
  );
}
