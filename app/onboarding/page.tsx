"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  QrCode,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Store,
  MapPin,
  CreditCard,
  Sparkles,
  Layers,
  ChefHat,
  Users,
  Smartphone,
  ShieldCheck,
  Check,
  ExternalLink,
  IndianRupee,
  Receipt,
  Clock,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

interface PlanOption {
  id: "free_trial" | "starter" | "growth" | "enterprise";
  name: string;
  price: number;
  period: string;
  badge?: string;
  popular?: boolean;
  features: string[];
}

const PLANS: PlanOption[] = [
  {
    id: "free_trial",
    name: "14-Day Free Trial",
    price: 0,
    period: "for 14 days",
    badge: "Most Popular to Start",
    features: [
      "Full QR Menu with Live Ordering",
      "Table 01 to 08 QR Code Generator",
      "Kitchen Display System (KDS)",
      "Waiter Floor Dashboard",
      "UPI & Cash Payment Settlement",
      "Zero Setup Fee • No Card Needed",
    ],
  },
  {
    id: "starter",
    name: "Starter Plan",
    price: 999,
    period: "per month",
    features: [
      "Everything in Free Trial",
      "Up to 15 Tables with Printable Tents",
      "Custom Logo & Colors Branding",
      "Daily Sales & GST Tax Reports",
      "Customer Feedback & Ratings Engine",
      "Multi-Language Menu (Eng/Hi/Te/Ur)",
    ],
  },
  {
    id: "growth",
    name: "Growth Plan",
    price: 1999,
    period: "per month",
    popular: true,
    badge: "Recommended for Busiest Dining",
    features: [
      "Everything in Starter",
      "Up to 35 Tables & Multi-Station KDS",
      "Spin-to-Win & Stamp Card Gamification",
      "Ingredient & Inventory Low-Stock Alerts",
      "Call Waiter & Bill Request Alerts",
      "Razorpay + UPI Payment Automation",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Pro",
    price: 3999,
    period: "per month",
    features: [
      "Unlimited Tables & Addon Packs",
      "Multi-Outlet Central Dashboard",
      "Dedicated Account Manager",
      "Custom Domain White-labeling",
      "24/7 Priority WhatsApp Support",
      "Full POS & Thermal Printer Sync",
    ],
  },
];

const CATEGORIES = [
  "Biryani & Arabic",
  "Fine Dining",
  "Casual Dining",
  "Café & Bakery",
  "Fast Food",
  "Cloud Kitchen",
  "Bar & Pub",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Form states
  const [restaurantName, setRestaurantName] = useState("");
  const [tagline, setTagline] = useState("Authentic Taste & Fast QR Dining");
  const [category, setCategory] = useState("Biryani & Arabic");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [state, setState] = useState("Telangana");
  const [pincode, setPincode] = useState("500033");
  const [gstin, setGstin] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"free_trial" | "starter" | "growth" | "enterprise">("free_trial");
  const [paymentMethod, setPaymentMethod] = useState<"trial" | "upi" | "card">("trial");

  // Provisioning & completion
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [createdRestaurant, setCreatedRestaurant] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Check current session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          setOwnerName(data.user.name || "");
          setEmail(data.user.email || "");
          if (data.user.phone) setPhone(data.user.phone);

          // If restaurant already exists, allow going directly or reconfiguring
          if (data.restaurant) {
            setCreatedRestaurant(data.restaurant);
          }
        } else {
          // Guest default fallback
          setOwnerName("Guest Partner");
          setEmail("partner@restaurant.com");
        }
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false));
  }, []);

  // Compute slug
  const slug = restaurantName
    ? restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    : "my-restaurant";

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Step 5 -> Step 6 (Execute Auto-Provisioning)
  const handleCompleteSetup = async () => {
    setErrorMessage("");
    setIsProvisioning(true);
    setCurrentStep(6);

    try {
      // Simulate stepwise progress for visual delight
      setProvisionProgress(20);
      await new Promise((r) => setTimeout(r, 400));
      setProvisionProgress(45);

      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: restaurantName || "Delicious Eats",
          tagline,
          category,
          ownerName: ownerName || "Restaurant Owner",
          phone: phone || "+91 98765 43210",
          email: email || "contact@restaurant.com",
          address: address || "Commercial Road",
          city,
          state,
          pincode,
          gstin,
          planId: selectedPlan,
        }),
      });

      setProvisionProgress(75);
      const data = await res.json();
      await new Promise((r) => setTimeout(r, 400));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to provision restaurant.");
      }

      setProvisionProgress(100);
      setCreatedRestaurant(data.data);
      setTimeout(() => {
        setIsProvisioning(false);
        setCurrentStep(7);
        triggerConfetti();
      }, 500);
    } catch (err: any) {
      setIsProvisioning(false);
      setCurrentStep(5);
      setErrorMessage(err.message || "Failed to setup restaurant. Please try again.");
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
                Restaurant Setup Wizard
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="text-slate-500 hidden sm:inline">Signed in as:</span>
            <span className="font-bold text-slate-800 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
              {currentUser?.name || "Owner"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {/* Step Progress Indicator (Steps 1 to 5) */}
        {currentStep <= 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>Step {currentStep} of 5</span>
              <span>
                {currentStep === 1 && "Account Verification"}
                {currentStep === 2 && "Restaurant Profile"}
                {currentStep === 3 && "Location & Contact"}
                {currentStep === 4 && "Choose Plan"}
                {currentStep === 5 && "Activation & Confirmation"}
              </span>
            </div>
            <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ================= STEP 1: ACCOUNT VERIFICATION ================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/60 p-6 sm:p-10 space-y-6">
            <div className="text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome to QRDening!
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Your account is ready. Let's configure your restaurant profile in under 2 minutes.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-slate-500">Account Owner</span>
                <span className="font-bold text-slate-800">{currentUser?.name || ownerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-slate-500">Email Address</span>
                <span className="font-bold text-slate-800">{currentUser?.email || email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Role</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Restaurant Administrator
                </span>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-600/25 flex items-center gap-2 group"
              >
                <span>Continue to Restaurant Details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: RESTAURANT PROFILE ================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/60 p-6 sm:p-10 space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Restaurant Profile
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                What is the name of your dining establishment?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Restaurant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spice Route Bistro"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 font-medium"
                />
                {restaurantName && (
                  <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                    Your QR menu web address:{" "}
                    <span className="font-mono text-emerald-700 font-bold">
                      https://qrdineing.vercel.app/restaurant/{slug}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tagline / Cuisine Motto
                </label>
                <input
                  type="text"
                  placeholder="e.g. Authentic Wood-Fired Pizza & Pasta"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category / Dining Type
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-2.5 px-5 rounded-xl border border-stone-300 hover:bg-stone-50 text-slate-700 font-bold text-sm flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!restaurantName.trim()}
                onClick={() => setCurrentStep(3)}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-600/25 flex items-center gap-2 disabled:opacity-50"
              >
                <span>Next: Location Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: LOCATION & CONTACT ================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/60 p-6 sm:p-10 space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Location & Contact
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                This appears on your customer digital bills and tax receipts.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Owner / Manager Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Business Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Address Line
                </label>
                <input
                  type="text"
                  placeholder="Plot 12, High Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  GSTIN <span className="text-slate-400 font-normal">(Optional for 5% GST bill)</span>
                </label>
                <input
                  type="text"
                  placeholder="36AABCA1234F1Z8"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-2.5 px-5 rounded-xl border border-stone-300 hover:bg-stone-50 text-slate-700 font-bold text-sm flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-600/25 flex items-center gap-2"
              >
                <span>Next: Select Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SELECT SUBSCRIPTION PLAN ================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/60 p-6 sm:p-10 space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Select Your Subscription Plan
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Start with a 14-day free trial or unlock advanced multi-station features right away.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      if (plan.id === "free_trial") {
                        setPaymentMethod("trial");
                      } else {
                        setPaymentMethod("upi");
                      }
                    }}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20"
                        : "border-stone-200 hover:border-emerald-300 bg-white"
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
                        {plan.badge}
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-extrabold text-base text-slate-900">{plan.name}</h3>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-2xl font-black text-slate-900">
                        {plan.price === 0 ? "₹0 Free" : `₹${plan.price}`}
                      </span>
                      <span className="text-xs text-slate-500 ml-1.5 font-medium">{plan.period}</span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="py-2.5 px-5 rounded-xl border border-stone-300 hover:bg-stone-50 text-slate-700 font-bold text-sm flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-600/25 flex items-center gap-2"
              >
                <span>Continue to Activation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: ACTIVATION & PAYMENT ================= */}
        {currentStep === 5 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/60 p-6 sm:p-10 space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Confirm & Activate
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Review your restaurant configuration and activate your dining system.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <div className="font-extrabold text-slate-900 text-base">{restaurantName || "My Restaurant"}</div>
                  <div className="text-xs text-slate-500">{category} • {city}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg text-xs uppercase tracking-wider inline-block">
                    {PLANS.find((p) => p.id === selectedPlan)?.name}
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subscription Fee</span>
                  <span className="font-semibold">
                    {selectedPlan === "free_trial" ? "₹0.00" : `₹${PLANS.find((p) => p.id === selectedPlan)?.price}.00`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Setup & QR Generation Fee</span>
                  <span className="font-bold text-emerald-600">FREE (Waived)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-200 font-extrabold text-slate-900 text-sm">
                  <span>Total Due Today</span>
                  <span className="text-emerald-700">
                    {selectedPlan === "free_trial" ? "₹0 (14-Day Free Trial)" : `₹${PLANS.find((p) => p.id === selectedPlan)?.price}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment / Trial Options */}
            {selectedPlan === "free_trial" ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Instant 14-Day Free Trial Activation</div>
                  <div className="text-xs text-emerald-700 mt-0.5">
                    No payment details or credit card required. Tables 01 to 08 will be generated automatically with scannable QR tokens.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-3 rounded-xl border-2 flex items-center gap-2.5 transition text-left ${
                      paymentMethod === "upi"
                        ? "border-emerald-600 bg-emerald-50/50 font-bold text-slate-900"
                        : "border-stone-200 text-slate-600"
                    }`}
                  >
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    <span>Instant UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-xl border-2 flex items-center gap-2.5 transition text-left ${
                      paymentMethod === "card"
                        ? "border-emerald-600 bg-emerald-50/50 font-bold text-slate-900"
                        : "border-stone-200 text-slate-600"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Debit / Credit Card</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="py-2.5 px-5 rounded-xl border border-stone-300 hover:bg-stone-50 text-slate-700 font-bold text-sm flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteSetup}
                className="py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-600/25 flex items-center gap-2 group"
              >
                <span>Activate Restaurant & Go to Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 6: PROVISIONING ANIMATION ================= */}
        {currentStep === 6 && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/60 p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Setting Up Your Restaurant Ecosystem...
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Generating scannable QR tokens, table standees, and Kitchen Display terminals.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${provisionProgress}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 font-mono text-right">{provisionProgress}% complete</div>
            </div>

            <div className="max-w-sm mx-auto space-y-2 text-xs text-slate-600 text-left pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Generated secure table URLs for Tables 01 to 08</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Loaded starter menu categories and item pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Configured live audio chime for kitchen orders</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 7: COMPLETED / WELCOME ================= */}
        {currentStep === 7 && createdRestaurant && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/60 p-6 sm:p-10 space-y-8">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider inline-block mb-2">
                Platform Active • Free Trial Started
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {createdRestaurant.name} is Live!
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Your restaurant is fully provisioned. Guests can start scanning and ordering right away.
              </p>
            </div>

            {/* Quick Access Card Grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Link
                href={`/admin/dashboard?slug=${createdRestaurant.slug}`}
                className="p-5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200 transition group text-left block shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-600/30">
                  <Store className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                  <span>Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Manage live orders, menu catalog, tables & QR downloads.
                </p>
              </Link>

              <Link
                href={`/restaurant/${createdRestaurant.slug}?table=01`}
                target="_blank"
                className="p-5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition group text-left block shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                  <span>Customer Menu</span>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Test Table 01 ordering experience as a dining guest.
                </p>
              </Link>

              <Link
                href={`/kitchen?slug=${createdRestaurant.slug}`}
                target="_blank"
                className="p-5 rounded-2xl bg-amber-50/70 hover:bg-amber-50 border border-amber-200 transition group text-left block shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                  <span>Kitchen KDS</span>
                  <ExternalLink className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Live kitchen order screen with chime audio and prep timers.
                </p>
              </Link>
            </div>

            {/* Launch Dashboard Button */}
            <div className="pt-2 text-center">
              <Link
                href={`/admin/dashboard?slug=${createdRestaurant.slug}`}
                className="inline-flex items-center gap-2 py-4 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm tracking-wide transition shadow-xl shadow-emerald-600/30 group"
              >
                <span>Open Restaurant Admin Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 py-6 text-center text-xs text-slate-500 bg-white/60">
        <p>© 2026 QRDening SaaS • Multi-Restaurant QR Dine-in Architecture</p>
      </footer>
    </div>
  );
}
