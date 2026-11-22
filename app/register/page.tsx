"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Store,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Globe,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { createClient } from "../../lib/supabase/client";
import { isSupabaseConfigured } from "../../lib/supabase/config";
import { slugify } from "../../lib/utils";
import SupabaseConfigBanner from "../../components/SupabaseConfigBanner";

export default function RegisterPage() {
  const router = useRouter();
  const supabaseConfigured = isSupabaseConfigured();

  const [formData, setFormData] = useState({
    restaurantName: "",
    slug: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    category: "Casual Dining",
    city: "",
    country: "India",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-generate slug when restaurant name changes
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      restaurantName: name,
      slug: slugify(name),
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    if (
      !formData.restaurantName ||
      !formData.ownerName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.city ||
      !formData.address
    ) {
      setErrorMsg("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (!supabaseConfigured) {
      setErrorMsg(
        "Supabase credentials are not configured in .env.local yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable live restaurant registration, or explore the Dashboard in Preview Mode."
      );
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      if (!supabase) {
        throw new Error("Unable to initialize Supabase client.");
      }

      // Step 1: Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.ownerName,
            role: "owner",
            phone: formData.phone,
          },
        },
      });

      if (authError) {
        setErrorMsg(authError.message);
        setLoading(false);
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        throw new Error("Authentication succeeded but no user ID was returned.");
      }

      // Step 2: Insert restaurant record
      const { data: resData, error: resError } = await (supabase
        .from("restaurants") as any)
        .insert({
          name: formData.restaurantName.trim(),
          slug: formData.slug || slugify(formData.restaurantName),
          owner_name: formData.ownerName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          country: formData.country.trim(),
          category: formData.category,
          is_active: true,
        })
        .select()
        .single();

      if (resError || !resData) {
        setErrorMsg(`Failed to create restaurant: ${resError?.message || "Unknown error"}`);
        setLoading(false);
        return;
      }

      // Step 3: Link user to restaurant in restaurant_members
      const { error: memberError } = await (supabase.from("restaurant_members") as any).insert({
        restaurant_id: resData.id,
        user_id: userId,
        role: "owner",
      });

      if (memberError) {
        console.error("Warning: Could not link restaurant member:", memberError);
      }

      // Step 4: Create default menu
      await (supabase.from("menus") as any).insert({
        restaurant_id: resData.id,
        name: "Main Digital Menu",
        is_active: true,
        is_published: true,
      });

      setSuccessMsg("Restaurant registered successfully! Redirecting to your dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during registration.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Configuration Status Banner */}
      {!supabaseConfigured && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <SupabaseConfigBanner />
        </div>
      )}

      <div className="max-w-2xl mx-auto pt-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
            <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:bg-brand-700 transition-colors">
              <QrCode className="w-7 h-7" />
            </div>
            <span className="text-3xl font-black text-slate-950 tracking-tight">QRDine</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">
            Register Your Restaurant
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Set up your digital QR menu in under 2 minutes. No credit card required.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {!supabaseConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Preview Mode Active
              </div>
              <p>
                Live registration is paused because Supabase is not connected in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code>.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 underline"
              >
                Go directly to Restaurant Dashboard preview →
              </Link>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Section 1: Restaurant Info */}
            <div className="border-b border-slate-100 pb-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                <span>1. Restaurant Information</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.restaurantName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. The Royal Plate"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Unique Menu URL Slug *
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                  <span className="bg-slate-100 px-3 py-2.5 text-xs text-slate-500 border-r border-slate-300 flex items-center">
                    qrdine.vercel.app/menu/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: slugify(e.target.value) })
                    }
                    placeholder="the-royal-plate"
                    className="w-full px-3 py-2 text-sm focus:outline-none text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  This will be the public link printed on your QR codes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Cuisine / Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900"
                  >
                    <option value="Casual Dining">Casual Dining</option>
                    <option value="Fine Dining">Fine Dining</option>
                    <option value="Café & Bakery">Café & Bakery</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                    <option value="Bar & Pub">Bar & Pub</option>
                    <option value="Biryani & Kebab">Biryani & Kebab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Hyderabad, Mumbai"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Street Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot number, Street, Landmark"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Section 2: Owner Account Info */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>2. Owner & Login Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="Chef Vikram Rathore"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address (Used for Login) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="owner@royalplate.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Create Password (Min 8 Characters) *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-brand-600/25 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-all"
              >
                {loading ? "Registering Restaurant..." : "Complete Registration & Launch"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already registered?{" "}
              <Link href="/login" className="font-bold text-brand-600 hover:text-brand-700">
                Sign in to your restaurant dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
