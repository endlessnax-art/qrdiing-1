"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Check,
  Clock,
  Sparkles,
  Award,
  Globe,
  BellRing,
  Receipt,
  IndianRupee,
  ChevronRight,
  Flame,
  ArrowRight,
  ShieldCheck,
  Gift,
  HelpCircle,
} from "lucide-react";
import { translations, Language } from "@/lib/i18n";
import { Restaurant, MenuCategory, MenuItem, RestaurantTable, OrderItem, FoodVariant, FoodAddon } from "@/lib/db/types";
import { formatCurrency } from "@/lib/utils";

function CustomerMenuContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "arabian-delight";

  const rawTable = (params?.table as string) || searchParams.get("table") || searchParams.get("t") || "03";
  const tableParam = rawTable.replace(/^table-?/i, "").padStart(2, "0");
  const tokenParam = searchParams.get("token") || searchParams.get("tk");

  // State
  const [lang, setLang] = useState<Language>("en");
  const [orderType, setOrderType] = useState<"dine_in" | "takeaway">("dine_in");
  const [restaurantData, setRestaurantData] = useState<{
    restaurant: Restaurant;
    categories: MenuCategory[];
    menuItems: MenuItem[];
    tables: RestaurantTable[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  // Cart
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "razorpay_online">("upi");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  // Customization Modal
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<FoodVariant | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<FoodAddon[]>([]);
  const [itemInstructions, setItemInstructions] = useState("");

  // Staff Call State
  const [callAlertMsg, setCallAlertMsg] = useState("");
  const [spinModalOpen, setSpinModalOpen] = useState(false);
  const [spinWon, setSpinWon] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Table Verification & Security
  const activeTable = useMemo(() => {
    if (!restaurantData?.tables) return null;
    return restaurantData.tables.find(
      (t) =>
        t.tableNumber === tableParam ||
        parseInt(t.tableNumber) === parseInt(tableParam) ||
        (tokenParam && t.qrToken === tokenParam)
    );
  }, [restaurantData, tableParam]);

  const isTokenValid = useMemo(() => {
    if (!activeTable) return false;
    if (!tokenParam) return true; // Direct access without token
    return activeTable.qrToken === tokenParam;
  }, [activeTable, tokenParam]);

  const isTableActive = activeTable ? activeTable.isActive !== false : true;

  const t = translations[lang] || translations.en;

  // Fetch restaurant data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/restaurants/${slug}`);
        const json = await res.json();
        if (json.success) {
          setRestaurantData(json.data);
        }
      } catch (err) {
        console.error("Failed to load restaurant data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    if (!restaurantData) return [];
    return restaurantData.menuItems.filter((item) => {
      if (selectedCategory !== "all" && item.categoryId !== selectedCategory) {
        return false;
      }
      if (vegOnly && !item.isVeg) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchEn = item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
        const matchHi = item.nameHi?.toLowerCase().includes(q);
        const matchTe = item.nameTe?.toLowerCase().includes(q);
        const matchUr = item.nameUr?.toLowerCase().includes(q);
        return matchEn || matchHi || matchTe || matchUr;
      }
      return true;
    });
  }, [restaurantData, selectedCategory, vegOnly, searchQuery]);

  // Cart calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number(((taxableAmount * (restaurantData?.restaurant.settings.taxRatePercent || 5)) / 100).toFixed(2));
  const totalAmount = Number((taxableAmount + taxAmount).toFixed(2));

  // Item name helper by language
  const getItemName = (item: MenuItem) => {
    if (lang === "hi" && item.nameHi) return item.nameHi;
    if (lang === "te" && item.nameTe) return item.nameTe;
    if (lang === "ur" && item.nameUr) return item.nameUr;
    return item.name;
  };

  const getItemDesc = (item: MenuItem) => {
    if (lang === "hi" && item.descriptionHi) return item.descriptionHi;
    if (lang === "te" && item.descriptionTe) return item.descriptionTe;
    if (lang === "ur" && item.descriptionUr) return item.descriptionUr;
    return item.description;
  };

  const getCategoryName = (cat: MenuCategory) => {
    if (lang === "hi" && cat.nameHi) return cat.nameHi;
    if (lang === "te" && cat.nameTe) return cat.nameTe;
    if (lang === "ur" && cat.nameUr) return cat.nameUr;
    return cat.name;
  };

  // Add item handler (direct or open customization modal)
  const handleItemAddClick = (item: MenuItem) => {
    if ((item.variants && item.variants.length > 0) || (item.addons && item.addons.length > 0)) {
      setCustomizingItem(item);
      setSelectedVariant(item.variants ? item.variants[0] : null);
      setSelectedAddons([]);
      setItemInstructions("");
    } else {
      // Direct add
      const existing = cart.find((c) => c.menuItemId === item.id && !c.selectedVariant && (!c.selectedAddons || c.selectedAddons.length === 0));
      if (existing) {
        setCart(
          cart.map((c) =>
            c === existing
              ? { ...c, quantity: c.quantity + 1, totalPrice: (c.quantity + 1) * c.unitPrice }
              : c
          )
        );
      } else {
        setCart([
          ...cart,
          {
            menuItemId: item.id,
            name: item.name,
            quantity: 1,
            unitPrice: item.basePrice,
            totalPrice: item.basePrice,
          },
        ]);
      }
    }
  };

  // Add customized item
  const handleAddCustomizedToCart = () => {
    if (!customizingItem) return;

    let unitPrice = customizingItem.basePrice;
    if (selectedVariant) unitPrice = selectedVariant.price;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const finalUnitPrice = unitPrice + addonsTotal;

    const newOrderItem: OrderItem = {
      menuItemId: customizingItem.id,
      name: customizingItem.name,
      quantity: 1,
      unitPrice: finalUnitPrice,
      selectedVariant: selectedVariant || undefined,
      selectedAddons: selectedAddons.length > 0 ? selectedAddons : undefined,
      specialInstructions: itemInstructions.trim() || undefined,
      totalPrice: finalUnitPrice,
    };

    setCart([...cart, newOrderItem]);
    setCustomizingItem(null);
  };

  // Update cart item quantity
  const updateCartQty = (index: number, delta: number) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
      updated[index].totalPrice = newQty * updated[index].unitPrice;
    }
    setCart(updated);
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          action: "validate",
          code: couponCode,
          subtotal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: data.discount });
      } else {
        setCouponError(data.message || "Invalid coupon");
      }
    } catch {
      setCouponError("Could not validate coupon");
    }
  };

  // Place Order
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (orderType === "dine_in" && !isTableActive) {
      alert(`Table ${tableParam} is currently marked inactive by restaurant staff. Please switch to Takeaway or contact staff.`);
      return;
    }
    setOrderSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          orderType,
          tableNumber: orderType === "dine_in" ? tableParam : undefined,
          token: orderType === "dine_in" ? (tokenParam || activeTable?.qrToken) : undefined,
          customerName: customerName || (orderType === "dine_in" ? `Table ${tableParam} Guest` : "Takeaway Guest"),
          customerPhone: customerPhone || undefined,
          items: cart,
          couponCode: appliedCoupon?.code,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.id) {
        // Redirect to order tracking page
        router.push(`/restaurant/${slug}/order/${data.data.id}`);
      } else {
        alert(data.error || "Failed to submit order");
      }
    } catch {
      alert("Error placing order. Please try again.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  // Staff Call Actions
  const handleCallStaff = async (type: "call_waiter" | "bill_request") => {
    try {
      await fetch("/api/waiter-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          tableNumber: tableParam,
          type,
        }),
      });
      setCallAlertMsg(type === "call_waiter" ? t.waiterAlerted : t.billRequested);
      setTimeout(() => setCallAlertMsg(""), 4000);
    } catch {
      setCallAlertMsg("Staff call notification sent!");
      setTimeout(() => setCallAlertMsg(""), 3000);
    }
  };

  // Spin & Win Wheel Handler
  const handleSpinWheel = () => {
    if (isSpinning || spinWon) return;
    setIsSpinning(true);
    const rewards = [
      "10% Off Next Order",
      "Free Arabian Mint Lemonade",
      "₹50 Flat Cashback",
      "Free Extra Garlic Toum",
      "Free Kunafa Dessert",
    ];
    setTimeout(() => {
      const won = rewards[Math.floor(Math.random() * rewards.length)];
      setSpinWon(won);
      setIsSpinning(false);
    }, 2000);
  };

  if (loading || !restaurantData) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-600">Loading {slug} digital menu...</p>
      </div>
    );
  }

  const { restaurant, categories } = restaurantData;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col pb-28">
      {/* 1. TOP HEADER & TABLE IDENTIFICATION */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shadow-sm"
            />
            <div>
              <h1 className="font-black text-slate-900 text-base leading-tight flex items-center gap-1.5">
                {restaurant.name}
              </h1>
              <p className="text-[11px] text-emerald-400 font-medium">
                {orderType === "dine_in" ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {t.orderingForTable}: <strong className="text-slate-900 font-bold">{t.table} {tableParam}</strong>
                  </span>
                ) : (
                  <span>{t.takeaway} Mode</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-stone-100 border border-stone-300 text-xs font-bold text-emerald-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 appearance-none pr-6 cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ur">اردو (Urdu)</option>
              </select>
              <Globe className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20 p-2 rounded-xl shadow-md transition"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
                  {cart.reduce((sum, c) => sum + c.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dine-In vs Takeaway Switcher */}
        <div className="max-w-3xl mx-auto px-4 pb-2.5 flex items-center gap-2">
          <div className="bg-stone-100 p-0.5 rounded-xl flex w-full border border-stone-200">
            <button
              onClick={() => setOrderType("dine_in")}
              className={`flex-1 py-1 text-xs font-bold rounded-md transition ${
                orderType === "dine_in"
                  ? "bg-emerald-600 text-white font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🍽️ {t.dineIn} ({t.table} {tableParam})
            </button>
            <button
              onClick={() => setOrderType("takeaway")}
              className={`flex-1 py-1 text-xs font-bold rounded-md transition ${
                orderType === "takeaway"
                  ? "bg-emerald-600 text-white font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🛍️ {t.takeaway}
            </button>
          </div>
        </div>

        {/* Real Table QR Security & Status Banners */}
        {orderType === "dine_in" && !isTableActive && (
          <div className="max-w-3xl mx-auto px-4 pb-2">
            <div className="bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs px-3 py-2 rounded-xl flex items-center gap-2 font-semibold">
              <span className="text-base">⚠️</span>
              <span>Table {tableParam} is currently marked inactive by restaurant staff. Dine-in ordering is temporarily unavailable.</span>
            </div>
          </div>
        )}

        {orderType === "dine_in" && isTableActive && tokenParam && isTokenValid && (
          <div className="max-w-3xl mx-auto px-4 pb-2">
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] px-3 py-1.5 rounded-xl flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified Scanned QR • <strong>Table {tableParam}</strong> {activeTable?.location ? `(${activeTable.location})` : ""}</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 font-mono">
                {activeTable?.capacity || 4} seats
              </span>
            </div>
          </div>
        )}

        {orderType === "dine_in" && tokenParam && !isTokenValid && (
          <div className="max-w-3xl mx-auto px-4 pb-2">
            <div className="bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs px-3 py-2 rounded-xl flex items-center gap-2 font-semibold">
              <span className="text-base">⚠️</span>
              <span>QR Token Invalidation: This QR token has expired or was regenerated. Please scan the newly printed QR stand on your table.</span>
            </div>
          </div>
        )}
      </header>

      {/* STAFF ALERT BANNER (If called) */}
      {callAlertMsg && (
        <div className="bg-emerald-500 text-slate-950 px-4 py-2 text-xs font-bold text-center sticky top-24 z-20 shadow-md flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> {callAlertMsg}
        </div>
      )}

      {/* 2. RESTAURANT COVER BANNER & QUICK INFO */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute bottom-3 left-4 right-4 max-w-3xl mx-auto flex items-end justify-between">
          <div>
            <span className="bg-emerald-500/90 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
              {restaurant.category}
            </span>
            <p className="text-white text-xs sm:text-sm font-semibold mt-1">
              {restaurant.tagline}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-2">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-400" /> {restaurant.openingTime} - {restaurant.closingTime}</span>
              <span>•</span>
              <span>{restaurant.city}</span>
            </p>
          </div>

          {/* Spin & Win pill */}
          <button
            onClick={() => setSpinModalOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition transform active:scale-95"
          >
            <Gift className="w-4 h-4" /> Spin & Win!
          </button>
        </div>
      </div>

      {/* 3. SEARCH & CATEGORY CHIPS */}
      <div className="sticky top-[95px] z-20 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200 py-3 shadow-md">
        <div className="max-w-3xl mx-auto px-4 space-y-3">
          {/* Search bar & Veg toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-white border border-stone-200/80 shadow-xs text-slate-900 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                vegOnly
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                  : "bg-white text-slate-900 border-stone-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              {t.vegOnly}
            </button>
          </div>

          {/* Category Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === "all"
                  ? "bg-emerald-600 text-white font-bold shadow-sm-md shadow-emerald-500/20"
                  : "bg-white border border-stone-200/80 shadow-xs text-slate-900 text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white font-bold shadow-sm-md shadow-emerald-500/20"
                    : "bg-white border border-stone-200/80 shadow-xs text-slate-900 text-slate-600 hover:text-slate-900"
                }`}
              >
                {getCategoryName(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FOOD MENU ITEMS LIST */}
      <main className="max-w-3xl mx-auto px-4 pt-4 w-full">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white text-slate-900/50 rounded-2xl border border-stone-200 mt-4">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="font-bold text-slate-900 text-sm">No items found</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search or filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isCustomizable =
                (item.variants && item.variants.length > 0) || (item.addons && item.addons.length > 0);

              return (
                <div
                  key={item.id}
                  className="bg-white text-slate-900/80 border border-stone-200/90 rounded-2xl p-4 flex gap-4 hover:border-stone-200 transition"
                >
                  {/* Left: Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Veg / Non-Veg badge & Bestseller */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center p-0.5 ${
                            item.isVeg ? "border-emerald-500" : "border-rose-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isVeg ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          ></span>
                        </span>
                        {item.isBestseller && (
                          <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> {t.bestseller}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {getItemName(item)}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {getItemDesc(item)}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm sm:text-base font-extrabold text-slate-900">
                          {formatCurrency(item.basePrice)}
                        </span>
                        {isCustomizable && (
                          <span className="text-[10px] text-slate-500">onwards</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Image & Add Button */}
                  <div className="w-28 sm:w-32 flex flex-col items-center justify-between shrink-0">
                    <div className="w-full h-24 rounded-xl overflow-hidden relative shadow-md">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
                        }}
                        className="w-full h-full object-cover"
                      />
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[10px] font-bold text-rose-400 uppercase">
                          {t.soldOut}
                        </div>
                      )}
                    </div>

                    <button
                      disabled={!item.isAvailable}
                      onClick={() => handleItemAddClick(item)}
                      className={`-mt-3 z-10 w-24 py-1.5 px-3 rounded-xl font-bold text-xs uppercase shadow-md flex items-center justify-center gap-1 transition ${
                        item.isAvailable
                          ? "bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-slate-900 shadow-xs"
                          : "bg-stone-50 text-slate-900 text-slate-500 border border-stone-200 cursor-not-allowed"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" /> {t.addToCart}
                    </button>
                    {isCustomizable && (
                      <span className="text-[9px] text-slate-500 mt-1 font-medium">
                        {t.customizable}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. FLOATING WAITER & BILL REQUEST PILL */}
      {orderType === "dine_in" && (
        <div className="fixed bottom-20 left-4 right-4 max-w-3xl mx-auto z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => handleCallStaff("call_waiter")}
              className="bg-white text-slate-900/90 border border-stone-200 hover:border-emerald-500 text-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm transition active:scale-95"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-400" /> {t.callWaiter}
            </button>
            <button
              onClick={() => handleCallStaff("bill_request")}
              className="bg-white text-slate-900/90 border border-stone-200 hover:border-emerald-500 text-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm transition active:scale-95"
            >
              <Receipt className="w-3.5 h-3.5 text-blue-400" /> {t.requestBill}
            </button>
          </div>
        </div>
      )}

      {/* 6. BOTTOM STICKY CART BAR */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white text-slate-900/95 backdrop-blur-md border-t border-stone-200 p-4 shadow-2xl">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500">
                {cart.reduce((sum, c) => sum + c.quantity, 0)} {t.itemsInCart}
              </p>
              <p className="text-lg font-black text-slate-900">
                {formatCurrency(totalAmount)}
              </p>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20 font-black px-6 py-3 rounded-xl text-sm shadow-lg shadow-emerald-500/25 transition flex items-center gap-2"
            >
              {t.viewCart} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 7. CART DRAWER / SHEET */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white border border-stone-200/80 shadow-xs text-slate-900 rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{t.orderSummary}</h3>
                <p className="text-xs text-emerald-400">
                  {orderType === "dine_in" ? `${t.table} ${tableParam}` : t.takeaway} • {restaurant.name}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-600 hover:text-slate-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-4 overflow-y-auto space-y-3 divide-y divide-slate-800/60 flex-1">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                    {item.selectedVariant && (
                      <p className="text-xs text-slate-500">Size: {item.selectedVariant.name}</p>
                    )}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <p className="text-xs text-slate-500">
                        + {item.selectedAddons.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p className="text-[11px] text-amber-300 italic mt-0.5">
                        "{item.specialInstructions}"
                      </p>
                    )}
                    <p className="text-xs font-bold text-slate-600 mt-1">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-stone-50 text-slate-900 border border-stone-200 rounded-lg p-1">
                    <button
                      onClick={() => updateCartQty(idx, -1)}
                      className="p-1 text-slate-600 hover:text-slate-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(idx, 1)}
                      className="p-1 text-slate-600 hover:text-slate-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Coupon Engine */}
              <div className="pt-4 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder={t.couponCode}
                    className="flex-1 bg-stone-50 text-slate-900 border border-stone-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 uppercase font-semibold"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20 font-bold px-3 py-2 rounded-lg text-xs"
                  >
                    {t.applyCoupon}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-emerald-400 font-medium">
                    ✓ Applied {appliedCoupon.code} (-{formatCurrency(appliedCoupon.discount)})
                  </p>
                )}
                {couponError && <p className="text-xs text-rose-400">{couponError}</p>}
                <p className="text-[10px] text-slate-500">
                  Try promo codes: <code className="text-slate-600">WELCOME50</code>, <code className="text-slate-600">MANDI20</code>, <code className="text-slate-600">FLAT100</code>
                </p>
              </div>

              {/* Customer Contact (Optional for Dine-in, helpful for Takeaway/Loyalty) */}
              <div className="pt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.yourName}
                    className="bg-stone-50 text-slate-900 border border-stone-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t.phoneNumber}
                    className="bg-stone-50 text-slate-900 border border-stone-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 space-y-2">
                <label className="block text-xs font-semibold text-slate-600">
                  {t.choosePayment}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-2.5 rounded-lg border text-xs font-bold text-left transition flex items-center justify-between ${
                      paymentMethod === "upi"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-stone-50 text-slate-900 border-stone-200 text-slate-600"
                    }`}
                  >
                    <span>Instant UPI</span>
                    <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">Fast</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`p-2.5 rounded-lg border text-xs font-bold text-left transition ${
                      paymentMethod === "cash"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-stone-50 text-slate-900 border-stone-200 text-slate-600"
                    }`}
                  >
                    Cash / Counter
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("razorpay_online")}
                    className={`p-2.5 rounded-lg border text-xs font-bold text-left transition ${
                      paymentMethod === "razorpay_online"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-stone-50 text-slate-900 border-stone-200 text-slate-600"
                    }`}
                  >
                    Card / Gateway
                  </button>
                </div>
              </div>

              {/* Bill Breakdown */}
              <div className="pt-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>{t.subtotal}</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>{t.gstTax}</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-stone-200">
                  <span>{t.total}</span>
                  <span className="text-emerald-400">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Footer Checkout Button */}
            <div className="p-4 border-t border-stone-200 bg-white text-slate-900">
              <button
                disabled={orderSubmitting}
                onClick={handlePlaceOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20 font-black py-3.5 rounded-xl text-sm shadow-xl shadow-emerald-500/25 transition flex items-center justify-center gap-2"
              >
                {orderSubmitting ? "Placing Order..." : `${t.placeOrder} (${formatCurrency(totalAmount)})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CUSTOMIZATION MODAL */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-white border border-stone-200/80 shadow-xs text-slate-900 rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setCustomizingItem(null)}
              className="absolute top-4 right-4 text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-base">{getItemName(customizingItem)}</h3>
            <p className="text-xs text-slate-500 mt-1">{getItemDesc(customizingItem)}</p>

            {/* Variants */}
            {customizingItem.variants && customizingItem.variants.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  {t.selectVariants}
                </label>
                <div className="space-y-1.5">
                  {customizingItem.variants.map((variant) => (
                    <label
                      key={variant.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                        selectedVariant?.id === variant.id
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold"
                          : "bg-stone-50 text-slate-900 border-stone-200 text-slate-600"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="variant"
                          checked={selectedVariant?.id === variant.id}
                          onChange={() => setSelectedVariant(variant)}
                          className="text-emerald-500 focus:ring-emerald-500"
                        />
                        {variant.name}
                      </span>
                      <span>{formatCurrency(variant.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Addons */}
            {customizingItem.addons && customizingItem.addons.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  {t.selectAddons}
                </label>
                <div className="space-y-1.5">
                  {customizingItem.addons.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          isSelected
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold"
                            : "bg-stone-50 text-slate-900 border-stone-200 text-slate-600"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAddons([...selectedAddons, addon]);
                              } else {
                                setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
                              }
                            }}
                            className="text-emerald-500 rounded focus:ring-emerald-500"
                          />
                          {addon.name}
                        </span>
                        <span>+{formatCurrency(addon.price)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {t.specialInstructions}
              </label>
              <input
                type="text"
                value={itemInstructions}
                onChange={(e) => setItemInstructions(e.target.value)}
                placeholder="e.g. Less spicy, extra crispy, etc."
                className="w-full bg-stone-50 text-slate-900 border border-stone-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleAddCustomizedToCart}
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20 font-bold py-3 rounded-xl text-xs transition"
            >
              Add to Order
            </button>
          </div>
        </div>
      )}

      {/* 9. SPIN & WIN WHEEL MODAL */}
      {spinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-white text-slate-900 border border-stone-200 rounded-2xl max-w-sm w-full p-6 text-center relative">
            <button
              onClick={() => {
                setSpinModalOpen(false);
                setSpinWon(null);
              }}
              className="absolute top-4 right-4 text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {t.spinAndWin}
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">Daily Lucky Treat</h3>
            <p className="text-xs text-slate-500 mt-1">Spin the wheel to win a surprise discount or free item!</p>

            <div className="my-6 relative flex items-center justify-center">
              <div
                className={`w-40 h-40 rounded-full border-4 border-amber-400 bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-xl transition-transform duration-[2000ms] ${
                  isSpinning ? "rotate-[1080deg]" : ""
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-slate-950 text-amber-400 font-black text-xs flex items-center justify-center border-2 border-amber-300">
                  {isSpinning ? "Spinning..." : "SPIN"}
                </div>
              </div>
            </div>

            {spinWon ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl">
                <p className="text-xs text-slate-600">{t.congratulations}</p>
                <p className="text-sm font-black text-emerald-400 mt-1">{spinWon}</p>
                <p className="text-[10px] text-slate-500 mt-1">Show this screen to your waiter to claim!</p>
              </div>
            ) : (
              <button
                disabled={isSpinning}
                onClick={handleSpinWheel}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg transition"
              >
                {t.spinNow}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerMenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-slate-900">Loading Digital Menu...</div>}>
      <CustomerMenuContent />
    </Suspense>
  );
}
