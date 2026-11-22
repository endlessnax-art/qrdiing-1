"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode,
  UtensilsCrossed,
  Plus,
  Download,
  ExternalLink,
  Sparkles,
  BarChart3,
  Layers,
  Settings,
  LogOut,
  Search,
  Filter,
  Check,
  AlertCircle,
  Eye,
  Trash2,
  Edit2,
  Copy,
  Printer,
  ChevronRight,
  TrendingUp,
  FileUp,
  Store,
  MapPin,
  Flame,
  Star,
  CheckCircle2,
} from "lucide-react";
import QRCode from "qrcode";
import SupabaseConfigBanner from "../../components/SupabaseConfigBanner";
import { isSupabaseConfigured } from "../../lib/supabase/config";
import { formatCurrency } from "../../lib/utils";

// Starter demo data for immediate preview
const initialCategoriesData = [
  { id: "cat-1", name: "Royal Starters", count: 3 },
  { id: "cat-2", name: "Tandoor & Clay Oven", count: 2 },
  { id: "cat-3", name: "Main Course", count: 3 },
  { id: "cat-4", name: "Biryani & Rice", count: 2 },
  { id: "cat-5", name: "Desserts & Drinks", count: 2 },
];

const initialItemsData = [
  {
    id: "item-1",
    name: "Crispy Corn & Water Chestnut",
    category: "Royal Starters",
    price: 280,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    isAvailable: true,
    description: "Golden fried corn tossed with scallions and crushed black pepper",
  },
  {
    id: "item-2",
    name: "Galouti Kebab",
    category: "Royal Starters",
    price: 480,
    isVeg: false,
    isSpicy: true,
    isBestseller: true,
    isAvailable: true,
    description: "Melt-in-mouth smoked lamb patties infused with 32 royal spices",
  },
  {
    id: "item-3",
    name: "Bhatti Da Murgh",
    category: "Tandoor & Clay Oven",
    price: 460,
    isVeg: false,
    isSpicy: true,
    isBestseller: true,
    isAvailable: true,
    description: "Charcoal-roasted spring chicken steeped in hung curd and red chilies",
  },
  {
    id: "item-4",
    name: "Dal Makhani Bukhara",
    category: "Main Course",
    price: 360,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    isAvailable: true,
    description: "Overnight slow-simmered black lentils finished with cultured butter and cream",
  },
  {
    id: "item-5",
    name: "Butter Chicken Aslam Style",
    category: "Main Course",
    price: 490,
    isVeg: false,
    isSpicy: false,
    isBestseller: true,
    isAvailable: true,
    description: "Tandoor pulled chicken tossed in velvety satin tomato sauce",
  },
  {
    id: "item-6",
    name: "Hyderabadi Dum Gosht Biryani",
    category: "Biryani & Rice",
    price: 540,
    isVeg: false,
    isSpicy: true,
    isBestseller: true,
    isAvailable: true,
    description: "Aged basmati rice sealed with tender mutton cuts, mint, and saffron milk",
  },
  {
    id: "item-7",
    name: "Shahi Tukda with Rabdi",
    category: "Desserts & Drinks",
    price: 220,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    isAvailable: true,
    description: "Ghee crisped milk bread soaked in saffron syrup topped with thick pistachio rabdi",
  },
];

export default function RestaurantDashboard() {
  const supabaseConfigured = isSupabaseConfigured();

  const [activeTab, setActiveTab] = useState<
    "overview" | "menu" | "qr" | "ai" | "branches" | "analytics" | "settings"
  >("overview");

  // Restaurant details state
  const [restaurantName] = useState("The Royal Plate");
  const [restaurantSlug] = useState("the-royal-plate");
  const [copiedLink, setCopiedLink] = useState(false);

  // Menu items state
  const [categories, setCategories] = useState(initialCategoriesData);
  const [menuItems, setMenuItems] = useState(initialItemsData);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Item Modal
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Royal Starters",
    price: "",
    description: "",
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
  });

  // Add Category Modal
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // QR Code Generator State
  const [tableNumber, setTableNumber] = useState("01");
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string>("");
  const [qrColor, setQrColor] = useState("#1e40af"); // Default royal blue QR

  // Generate QR code data URL on mount or tableNumber change
  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://qrdine.vercel.app";
    const targetUrl = `${origin}/menu/${restaurantSlug}${tableNumber ? `?table=${tableNumber}` : ""}`;
    QRCode.toDataURL(
      targetUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: qrColor,
          light: "#FFFFFF",
        },
      },
      (err, url) => {
        if (!err && url) {
          setGeneratedQrDataUrl(url);
        }
      }
    );
  }, [tableNumber, restaurantSlug, qrColor]);

  const copyMenuUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://qrdine.vercel.app";
    navigator.clipboard.writeText(`${origin}/menu/${restaurantSlug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    const item = {
      id: `item-${Date.now()}`,
      name: newItem.name.trim(),
      category: newItem.category,
      price: parseFloat(newItem.price) || 0,
      description: newItem.description.trim(),
      isVeg: newItem.isVeg,
      isSpicy: newItem.isSpicy,
      isBestseller: newItem.isBestseller,
      isAvailable: true,
    };

    setMenuItems((prev) => [item, ...prev]);
    setIsAddItemModalOpen(false);
    setNewItem({
      name: "",
      category: "Royal Starters",
      price: "",
      description: "",
      isVeg: true,
      isSpicy: false,
      isBestseller: false,
    });
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategories((prev) => [
      ...prev,
      { id: `cat-${Date.now()}`, name: newCatName.trim(), count: 0 },
    ]);
    setIsAddCatModalOpen(false);
    setNewCatName("");
  };

  const downloadQrCode = () => {
    if (!generatedQrDataUrl) return;
    const a = document.createElement("a");
    a.href = generatedQrDataUrl;
    a.download = `${restaurantSlug}-table-${tableNumber || "main"}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Config Banner */}
      {!supabaseConfigured && <SupabaseConfigBanner />}

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          {/* Logo & Restaurant Switcher */}
          <div className="p-5 border-b border-slate-200">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-950 tracking-tight">QRDine</span>
            </Link>

            <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
                  RP
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 truncate">{restaurantName}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Menu Live
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "overview"
                  ? "bg-brand-50 text-brand-700 font-bold"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("menu")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "menu"
                  ? "bg-brand-50 text-brand-700 font-bold"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Menu Management</span>
              <span className="ml-auto bg-slate-200/70 text-slate-700 text-[10px] px-2 py-0.5 rounded-full">
                {menuItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("qr")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "qr"
                  ? "bg-brand-50 text-brand-700 font-bold"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code Generator</span>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "ai"
                  ? "bg-brand-50 text-brand-700 font-bold"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>AI Menu Converter</span>
              <span className="ml-auto bg-brand-100 text-brand-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                PHASE 2
              </span>
            </button>

            <button
              onClick={() => setActiveTab("branches")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "branches"
                  ? "bg-brand-50 text-brand-700 font-bold"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Branches</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "analytics"
                  ? "bg-brand-50 text-brand-700 font-bold"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Scan Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "settings"
                  ? "bg-brand-50 text-brand-700 font-bold"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Quick Menu Preview Link at bottom of sidebar */}
          <div className="p-4 border-t border-slate-200">
            <Link
              href={`/menu/${restaurantSlug}`}
              target="_blank"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Customer Menu</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
            </Link>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="truncate">Chef Vikram</span>
              <Link href="/login" className="text-slate-400 hover:text-rose-600" title="Logout">
                <LogOut className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-extrabold text-slate-900">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "menu" && "Menu Item Management"}
                {activeTab === "qr" && "Table & Restaurant QR Codes"}
                {activeTab === "ai" && "AI Photo to Digital Menu Converter"}
                {activeTab === "branches" && "Branch Management"}
                {activeTab === "analytics" && "Scan Telemetry & Analytics"}
                {activeTab === "settings" && "Restaurant Settings"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Public Menu URL Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600">
                <QrCode className="w-3.5 h-3.5 text-brand-600" />
                <span className="truncate max-w-[200px]">/menu/{restaurantSlug}</span>
                <button
                  onClick={copyMenuUrl}
                  className="p-1 hover:text-brand-600 transition-colors ml-1"
                  title="Copy menu URL"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <Link
                href={`/menu/${restaurantSlug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <span>Live Menu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </header>

          {/* Tab Content */}
          <div className="p-6 space-y-6">
            {/* ============================================================== */}
            {/* TAB 1: OVERVIEW */}
            {/* ============================================================== */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Menu Items</span>
                      <UtensilsCrossed className="w-4 h-4 text-brand-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-950">{menuItems.length}</div>
                    <div className="mt-1 text-xs text-slate-500">Across {categories.length} categories</div>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Active Categories</span>
                      <Layers className="w-4 h-4 text-brand-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-950">{categories.length}</div>
                    <div className="mt-1 text-xs text-slate-500">Royal Starters, Tandoor, Mains...</div>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Menu Scans</span>
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-950">1,482</div>
                    <div className="mt-1 text-xs text-emerald-600 font-semibold">+18% this week</div>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Table QR Codes</span>
                      <QrCode className="w-4 h-4 text-brand-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-950">12</div>
                    <div className="mt-1 text-xs text-slate-500">Tables 01 to 12 active</div>
                  </div>
                </div>

                {/* AI Menu Converter Callout Banner */}
                <div className="p-6 bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 text-white rounded-2xl shadow-md relative overflow-hidden">
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/30 text-brand-200 text-xs font-bold uppercase tracking-wider mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      Phase 2 Feature In Preparation
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                      AI Photo to Digital Menu Converter
                    </h2>
                    <p className="mt-2 text-sm text-brand-100 leading-relaxed">
                      Soon, you will be able to snap smartphone photos of your printed menus or upload a PDF. Our AI vision engine will extract every dish, price, category, and font style while strictly preserving your original design layout.
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab("ai")}
                        className="px-4 py-2 bg-white text-brand-900 rounded-xl font-bold text-xs hover:bg-brand-50 transition-colors shadow-sm"
                      >
                        Preview AI Upload Workflow
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Menu Overview & Actions */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-base font-bold text-slate-950">Quick Menu Items</h2>
                      <p className="text-xs text-slate-500">Dishes currently published to your public QR menu</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAddItemModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        Add Food Item
                      </button>
                      <button
                        onClick={() => setActiveTab("menu")}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                      >
                        Manage All
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="pb-3 pl-1">Dish Name</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Availability</th>
                          <th className="pb-3 text-right pr-1">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {menuItems.slice(0, 5).map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/60">
                            <td className="py-3.5 pl-1">
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                <span>{item.name}</span>
                                {item.isBestseller && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                    Bestseller
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate max-w-xs">
                                {item.description}
                              </div>
                            </td>
                            <td className="py-3.5 text-slate-600">{item.category}</td>
                            <td className="py-3.5 font-bold text-slate-900">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="py-3.5">
                              {item.isVeg ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  Veg
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                                  Non-Veg
                                </span>
                              )}
                            </td>
                            <td className="py-3.5">
                              <button
                                onClick={() => handleToggleAvailability(item.id)}
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                                  item.isAvailable
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                }`}
                              >
                                {item.isAvailable ? "In Stock" : "Sold Out"}
                              </button>
                            </td>
                            <td className="py-3.5 text-right pr-1">
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                                title="Delete dish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: MENU MANAGEMENT */}
            {/* ============================================================== */}
            {activeTab === "menu" && (
              <div className="space-y-6">
                {/* Action Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                        selectedCategory === "All"
                          ? "bg-brand-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      All Dishes ({menuItems.length})
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                          selectedCategory === cat.name
                            ? "bg-brand-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Search & Buttons */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:w-56">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search dish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <button
                      onClick={() => setIsAddCatModalOpen(true)}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors whitespace-nowrap"
                    >
                      + Category
                    </button>
                    <button
                      onClick={() => setIsAddItemModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      Add Food Item
                    </button>
                  </div>
                </div>

                {/* Items Grid/Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">
                      Showing {filteredItems.length} of {menuItems.length} Dishes
                    </h2>
                    <span className="text-xs text-slate-500">
                      {selectedCategory !== "All" ? `Category: ${selectedCategory}` : "All Categories"}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="py-3 px-6">Food Item</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Dietary</th>
                          <th className="py-3 px-4">Badges</th>
                          <th className="py-3 px-4">In Stock</th>
                          <th className="py-3 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-6">
                              <div className="font-bold text-slate-950 text-sm">{item.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                {item.description}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-700">
                              {item.category}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="py-3.5 px-4">
                              {item.isVeg ? (
                                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                                  <div className="w-3.5 h-3.5 rounded-sm border border-emerald-600 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  </div>
                                  Veg
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-rose-700 font-semibold">
                                  <div className="w-3.5 h-3.5 rounded-sm border border-rose-600 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                                  </div>
                                  Non-Veg
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                {item.isBestseller && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                    Bestseller
                                  </span>
                                )}
                                {item.isSpicy && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                                    <Flame className="w-3 h-3 text-rose-600" />
                                    Spicy
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleToggleAvailability(item.id)}
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                                  item.isAvailable
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                }`}
                              >
                                {item.isAvailable ? "Available" : "Hidden"}
                              </button>
                            </td>
                            <td className="py-3.5 px-6 text-right">
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: QR CODE GENERATOR */}
            {/* ============================================================== */}
            {activeTab === "qr" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-12 gap-8 items-start">
                  {/* Left: QR Generator Controls */}
                  <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">QR Code Customizer</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Generate branded QR codes for tables, tent cards, or counter displays.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Assign Table Number
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            placeholder="e.g. 01, 05, Bar-1"
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                          />
                          <button
                            onClick={() => setTableNumber("")}
                            className="px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 whitespace-nowrap"
                          >
                            Restaurant Master (No Table)
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Table codes automatically identify which table scanned the menu.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          QR Code Brand Color
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setQrColor("#1e40af")}
                            className={`w-8 h-8 rounded-full bg-brand-800 border-2 transition-all ${
                              qrColor === "#1e40af" ? "ring-2 ring-offset-2 ring-brand-600" : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setQrColor("#0f172a")}
                            className={`w-8 h-8 rounded-full bg-slate-900 border-2 transition-all ${
                              qrColor === "#0f172a" ? "ring-2 ring-offset-2 ring-slate-900" : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setQrColor("#047857")}
                            className={`w-8 h-8 rounded-full bg-emerald-700 border-2 transition-all ${
                              qrColor === "#047857" ? "ring-2 ring-offset-2 ring-emerald-600" : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setQrColor("#b91c1c")}
                            className={`w-8 h-8 rounded-full bg-rose-700 border-2 transition-all ${
                              qrColor === "#b91c1c" ? "ring-2 ring-offset-2 ring-rose-600" : ""
                            }`}
                          />
                          <span className="text-xs text-slate-500 ml-2">Selected: {qrColor}</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-slate-700">QR Target Destination:</div>
                        <div className="font-mono text-slate-600 break-all">
                          https://qrdine.vercel.app/menu/{restaurantSlug}
                          {tableNumber ? `?table=${tableNumber}` : ""}
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-3">
                        <button
                          onClick={downloadQrCode}
                          className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download PNG (High-Res)
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                          Print Tent Card
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Printable Tent Card Preview */}
                  <div className="md:col-span-5 bg-white p-8 rounded-2xl border-2 border-dashed border-slate-300 text-center shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Live Table Tent Preview (Print Ready)
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg inline-block w-full max-w-xs mx-auto">
                      <div className="w-10 h-10 rounded-xl bg-brand-600 text-white mx-auto flex items-center justify-center font-black text-sm mb-2 shadow-xs">
                        RP
                      </div>
                      <div className="font-black text-slate-900 text-base">{restaurantName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">Digital QR Menu</div>

                      <div className="my-4 p-3 bg-white rounded-xl border border-slate-100 shadow-inner inline-block">
                        {generatedQrDataUrl ? (
                          <img
                            src={generatedQrDataUrl}
                            alt="Table QR Code"
                            className="w-44 h-44 mx-auto rounded-lg"
                          />
                        ) : (
                          <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                            Generating QR...
                          </div>
                        )}
                      </div>

                      <div className="bg-brand-50 text-brand-900 py-1.5 px-3 rounded-lg text-xs font-bold mb-2">
                        {tableNumber ? `TABLE ${tableNumber}` : "RESTAURANT COUNTER"}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Scan with your smartphone camera to browse contactless menu
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: AI MENU CONVERTER (PHASE 2 PREVIEW) */}
            {/* ============================================================== */}
            {activeTab === "ai" && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs max-w-4xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-brand-600" />
                    <h2 className="text-xl font-black text-slate-950">
                      AI Photo to Digital Menu Converter
                    </h2>
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                      Planned for Phase 2
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    In the next phase, you will simply snap photographs or upload high-resolution PDFs of your printed physical menus. QRDine&apos;s AI vision system will extract text, prices, categories, and recreate your original menu design digitally.
                  </p>

                  {/* Dropzone Mockup */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-brand-400 transition-colors bg-slate-50/50">
                    <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-4">
                      <FileUp className="w-8 h-8" />
                    </div>
                    <div className="text-base font-bold text-slate-900 mb-1">
                      Upload Menu Photos or PDF
                    </div>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                      Drag and drop JPG, PNG, or multi-page PDF files here. AI will analyze layout, typography, prices, and food descriptions.
                    </p>
                    <button
                      type="button"
                      disabled
                      className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed"
                    >
                      AI Vision Engine (Available in Phase 2)
                    </button>
                  </div>

                  {/* Steps Roadmap */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                      The AI Conversion Workflow:
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-slate-900">1. OCR & Vision Analysis</div>
                        <div className="text-slate-500">
                          Detects item names, exact prices, categories, and typography colors without alterations.
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-slate-900">2. Layout Reconstruction</div>
                        <div className="text-slate-500">
                          Reconstructs the original visual layout into responsive mobile CSS.
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-slate-900">3. Owner Approval</div>
                        <div className="text-slate-500">
                          Compare side-by-side with your original photo before publishing live.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 5: BRANCHES */}
            {/* ============================================================== */}
            {activeTab === "branches" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Restaurant Branches</h2>
                      <p className="text-xs text-slate-500">
                        Manage multiple physical dining locations under The Royal Plate
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors"
                    >
                      + Add New Branch
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>Jubilee Hills (Main Branch)</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-brand-100 text-brand-800 font-bold">
                              Primary
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            Plot 42, Road No. 36, Jubilee Hills, Hyderabad
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Active</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            Banjara Hills Branch (Upcoming)
                          </div>
                          <div className="text-xs text-slate-500">
                            Road No. 12, Banjara Hills, Hyderabad
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">Opening Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 6: ANALYTICS */}
            {/* ============================================================== */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-5">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Today&apos;s Scans
                    </div>
                    <div className="text-3xl font-black text-slate-950">142</div>
                    <div className="text-xs text-emerald-600 font-semibold mt-1">
                      Peak hour: 8:00 PM – 9:30 PM
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Top Scanned Table
                    </div>
                    <div className="text-3xl font-black text-slate-950">Table 05</div>
                    <div className="text-xs text-slate-500 mt-1">48 scans this week</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Most Viewed Dish
                    </div>
                    <div className="text-2xl font-black text-slate-950 truncate">
                      Dal Makhani
                    </div>
                    <div className="text-xs text-slate-500 mt-1">310 views this week</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Daily QR Scans Telemetry (Last 7 Days)
                  </h3>
                  <div className="h-44 flex items-end gap-4 pt-6 pb-2 border-b border-slate-100">
                    {[
                      { day: "Mon", count: 120, height: "60%" },
                      { day: "Tue", count: 140, height: "70%" },
                      { day: "Wed", count: 135, height: "65%" },
                      { day: "Thu", count: 160, height: "80%" },
                      { day: "Fri", count: 210, height: "95%" },
                      { day: "Sat", count: 245, height: "100%" },
                      { day: "Sun", count: 220, height: "90%" },
                    ].map((bar) => (
                      <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div
                          style={{ height: bar.height }}
                          className="w-full bg-brand-600 rounded-t-lg transition-all hover:bg-brand-700"
                        />
                        <span className="text-[11px] font-bold text-slate-600">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 7: SETTINGS */}
            {/* ============================================================== */}
            {activeTab === "settings" && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-slate-900">Restaurant Settings</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        defaultValue={restaurantName}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        disabled
                        defaultValue={restaurantSlug}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Currency
                    </label>
                    <select className="w-full sm:w-48 px-3.5 py-2 text-sm rounded-xl border border-slate-300">
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="AED">AED (د.إ)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD FOOD ITEM */}
      {/* ============================================================== */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">Add New Food Item</h2>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Murgh Malai Tikka"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="380"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Brief description of ingredients and preparation"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.isVeg}
                    onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Vegetarian (Green badge)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.isBestseller}
                    onChange={(e) => setNewItem({ ...newItem, isBestseller: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Bestseller Tag</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.isSpicy}
                    onChange={(e) => setNewItem({ ...newItem, isSpicy: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Spicy Indicator</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD CATEGORY */}
      {/* ============================================================== */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">Add Menu Category</h2>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Chef Specials, Mocktails"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
