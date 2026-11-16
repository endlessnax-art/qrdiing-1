"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Layers,
  QrCode,
  Calendar,
  BarChart3,
  Tag,
  Gift,
  Boxes,
  CreditCard,
  Settings,
  Store,
  Plus,
  Trash2,
  Edit2,
  Download,
  Printer,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  IndianRupee,
  ChefHat,
  BellRing,
  ExternalLink,
  X,
  FileSpreadsheet,
  FileText,
  Percent,
  ChevronRight,
  Copy,
  Check,
  FileDown,
  Power,
  ShieldCheck,
  Menu,
  Star,
} from "lucide-react";
import {
  generateQRCodeDataURL,
  generateQRCodeSVG,
  downloadTableQRPNG,
  downloadTableQRSVG,
  downloadTableQRPDF,
  printStickerSheet,
} from "@/lib/qr";
import {
  Restaurant,
  MenuCategory,
  MenuItem,
  RestaurantTable,
  Order,
  Coupon,
  InventoryItem,
  CustomerFeedback,
} from "@/lib/db/types";
import { formatCurrency, formatDate } from "@/lib/utils";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "arabian-delight";
  const initialTab = searchParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [restaurantData, setRestaurantData] = useState<{
    restaurant: Restaurant;
    categories: MenuCategory[];
    menuItems: MenuItem[];
    tables: RestaurantTable[];
  } | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [dailySales, setDailySales] = useState<any>(null);
  const [monthlySales, setMonthlySales] = useState<any>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    nameHi: "",
    nameTe: "",
    nameUr: "",
    categoryId: "",
    description: "",
    basePrice: 150,
    isVeg: true,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
  });

  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableNum, setNewTableNum] = useState("");
  const [newTableName, setNewTableName] = useState("");
  const [newTableLocation, setNewTableLocation] = useState("Main Dining Area");
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [tableFormError, setTableFormError] = useState("");
  const [tableFormSubmitting, setTableFormSubmitting] = useState(false);
  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [regeneratingTableNum, setRegeneratingTableNum] = useState<string | null>(null);

  // Real QR Code Cache
  const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({});
  const [qrSvgStrings, setQrSvgStrings] = useState<Record<string, string>>({});

  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 20,
    minOrderValue: 300,
    maxDiscount: 100,
  });

  // QR Code Printable Preview
  const [printQrTable, setPrintQrTable] = useState<RestaurantTable | null>(null);

  // Fetch all restaurant data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [restRes, ordersRes, dailyRes, monthlyRes, couponsRes, invRes, feedbackRes] = await Promise.all([
        fetch(`/api/restaurants/${slug}`),
        fetch(`/api/orders?slug=${slug}`),
        fetch(`/api/analytics/daily?slug=${slug}`),
        fetch(`/api/analytics/monthly?slug=${slug}`),
        fetch(`/api/coupons?slug=${slug}`),
        fetch(`/api/inventory?slug=${slug}`),
        fetch(`/api/feedback?slug=${slug}`),
      ]);

      const [restJson, ordersJson, dailyJson, monthlyJson, couponsJson, invJson, feedbackJson] = await Promise.all([
        restRes.json(),
        ordersRes.json(),
        dailyRes.json(),
        monthlyRes.json(),
        couponsRes.json(),
        invRes.json(),
        feedbackRes.json(),
      ]);

      if (restJson.success) setRestaurantData(restJson.data);
      if (ordersJson.success) setOrders(ordersJson.data);
      if (dailyJson.success) setDailySales(dailyJson.data);
      if (monthlyJson.success) setMonthlySales(monthlyJson.data);
      if (couponsJson.success) setCoupons(couponsJson.data);
      if (invJson.success) setInventory(invJson.data);
      if (feedbackJson.success) setFeedbacks(feedbackJson.data);
    } catch (err) {
      console.error("Failed to load restaurant admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetch("/api/restaurants")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setAllRestaurants(d.data);
      })
      .catch(() => {});
  }, [slug]);

  // Generate real scannable QR codes whenever tables change
  useEffect(() => {
    if (!restaurantData?.tables || restaurantData.tables.length === 0) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

    let isMounted = true;
    async function updateQRs() {
      const dataMap: Record<string, string> = {};
      const svgMap: Record<string, string> = {};

      for (const t of restaurantData!.tables) {
        const targetUrl = `${origin}/restaurant/${slug}?table=${t.tableNumber}&token=${t.qrToken}`;
        try {
          const dataUrl = await generateQRCodeDataURL(targetUrl, { width: 512, margin: 2 });
          const svgStr = await generateQRCodeSVG(targetUrl);
          dataMap[t.tableNumber] = dataUrl;
          svgMap[t.tableNumber] = svgStr;
        } catch (err) {
          console.error("Failed to generate QR for Table", t.tableNumber, err);
        }
      }
      if (isMounted) {
        setQrDataUrls(dataMap);
        setQrSvgStrings(svgMap);
      }
    }

    updateQRs();
    return () => {
      isMounted = false;
    };
  }, [restaurantData?.tables, slug]);

  // Add Menu Item
  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.categoryId) {
      alert("Name and category are required");
      return;
    }
    try {
      const res = await fetch(`/api/restaurants/${slug}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddItemOpen(false);
        fetchData();
      } else {
        alert(data.error || "Failed to create menu item");
      }
    } catch {
      alert("Error adding menu item");
    }
  };

  // Toggle Item Availability
  const handleToggleItemAvailability = async (item: MenuItem) => {
    try {
      await fetch(`/api/restaurants/${slug}/menu`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "item",
          id: item.id,
          updates: { isAvailable: !item.isAvailable },
        }),
      });
      fetchData();
    } catch {
      alert("Failed to update availability");
    }
  };

  // Delete Menu Item
  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await fetch(`/api/restaurants/${slug}/menu?id=${itemId}&type=item`, {
        method: "DELETE",
      });
      fetchData();
    } catch {
      alert("Failed to delete item");
    }
  };

  // Add Table with duplicate prevention & complete fields
  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setTableFormError("");
    const trimmedNum = newTableNum.trim();
    if (!trimmedNum) {
      setTableFormError("Please enter a table number.");
      return;
    }

    // Client-side duplicate check
    const duplicate = restaurantData?.tables.some(
      (t) => t.tableNumber.trim().toLowerCase() === trimmedNum.toLowerCase()
    );
    if (duplicate) {
      setTableFormError(`Table "${trimmedNum}" already exists for this restaurant. Please use a unique table number.`);
      return;
    }

    setTableFormSubmitting(true);
    try {
      const res = await fetch(`/api/restaurants/${slug}/tables`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: trimmedNum,
          tableName: newTableName.trim() || `Table ${trimmedNum}`,
          location: newTableLocation.trim() || "Main Dining Area",
          capacity: Number(newTableCapacity) || 4,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddTableOpen(false);
        setNewTableNum("");
        setNewTableName("");
        setNewTableLocation("Main Dining Area");
        setNewTableCapacity(4);
        fetchData();
      } else {
        setTableFormError(data.error || "Failed to create table");
      }
    } catch {
      setTableFormError("Network error. Failed to create table.");
    } finally {
      setTableFormSubmitting(false);
    }
  };

  // Regenerate Table QR Token with confirmation & instant update
  const handleRegenerateToken = async (tableNumber: string) => {
    const confirmed = window.confirm(
      `⚠️ Regenerate QR token for Table ${tableNumber}?\n\nAny printed physical QR codes or table stands for Table ${tableNumber} will stop working immediately. You will need to print or display the newly generated QR code.`
    );
    if (!confirmed) return;

    try {
      setRegeneratingTableNum(tableNumber);
      const res = await fetch(`/api/restaurants/${slug}/tables`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "regenerate_qr",
          tableNumber,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Instant local state update for zero UI delay
        setRestaurantData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            tables: prev.tables.map((t) => (t.tableNumber === tableNumber ? data.data : t)),
          };
        });
        alert(`✓ QR code successfully regenerated for Table ${tableNumber}. Previous token has been invalidated.`);
      } else {
        alert(data.error || "Failed to regenerate QR token");
      }
    } catch {
      alert("Failed to regenerate QR token");
    } finally {
      setRegeneratingTableNum(null);
    }
  };

  // Toggle Table Active / Inactive
  const handleToggleTableActive = async (tableNumber: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/restaurants/${slug}/tables`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_active",
          tableNumber,
          isActive: !currentActive,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRestaurantData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            tables: prev.tables.map((t) => (t.tableNumber === tableNumber ? data.data : t)),
          };
        });
      }
    } catch {
      alert("Failed to toggle table status");
    }
  };

  // Delete Table
  const handleDeleteTable = async (tableNumber: string) => {
    if (!window.confirm(`Delete Table ${tableNumber}? This will remove its QR code and record.`)) return;
    try {
      const res = await fetch(`/api/restaurants/${slug}/tables?tableNumber=${encodeURIComponent(tableNumber)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Failed to delete table");
      }
    } catch {
      alert("Failed to delete table");
    }
  };

  // Copy token to clipboard
  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          ...newCoupon,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddCouponOpen(false);
        fetchData();
      }
    } catch {
      alert("Failed to create coupon");
    }
  };

  // Purchase Freemium Menu Pack
  const handlePurchasePack = async (packId: string) => {
    try {
      const res = await fetch("/api/super-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "purchase_addon",
          restaurantId: restaurantData?.restaurant.id,
          packageId: packId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully purchased add-on package! New item limit: ${data.newLimit}`);
        fetchData();
      }
    } catch {
      alert("Failed to purchase package");
    }
  };

  // Export Daily Sales CSV
  const handleExportCSV = () => {
    if (!dailySales) return;
    const headers = "Hour,Orders,Revenue\n";
    const rows = dailySales.hourlyBuckets
      .map((b: any) => `${b.hour},${b.orders},${b.revenue}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-sales-${slug}-${dailySales.date}.csv`;
    a.click();
  };

  const printOrderKOT = (ord: Order) => {
    if (typeof window === "undefined") return;
    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow popups to print KOT ticket.");
      return;
    }
    const itemsHtml = ord.items
      .map(
        (it) => `
      <div style="display:flex; margin-bottom:4px;">
        <span style="width:30px; font-weight:bold;">${it.quantity}x</span>
        <div style="flex:1;">
          <div style="font-weight:bold;">${it.name}</div>
          ${it.selectedVariant ? `<div style="font-size:9pt; color:#444;">Portion: ${it.selectedVariant.name}</div>` : ""}
          ${it.specialInstructions ? `<div style="font-size:9pt; background:#eee; padding:2px; font-weight:bold;">NOTE: ${it.specialInstructions}</div>` : ""}
        </div>
      </div>
    `
      )
      .join("");

    win.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>KOT - ${ord.orderNumber}</title>
  <style>
    @page { size: 80mm auto; margin: 4mm; }
    body { font-family: 'Courier New', monospace; font-size: 11pt; color: #000; margin: 0; padding: 4px; }
  </style>
</head>
<body>
  <div style="text-align:center; border-bottom:2px dashed #000; padding-bottom:6px;">
    <h2 style="margin:0; font-size:14pt;">*** K.O.T ***</h2>
    <div style="font-weight:bold; font-size:10pt;">${ord.restaurantName}</div>
    <div style="font-size:9pt;">${ord.orderNumber} • ${new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
  </div>
  <div style="background:#000; color:#fff; text-align:center; font-size:16pt; font-weight:900; padding:4px; margin:6px 0;">
    ${ord.orderType === "dine_in" ? `TABLE ${ord.tableNumber}` : "TAKEAWAY"}
  </div>
  <div style="margin:8px 0; border-bottom:2px dashed #000; padding-bottom:8px;">
    ${itemsHtml}
  </div>
  <div style="text-align:center; font-size:8pt;">Chef Copy • QRDening KDS</div>
  <script>window.onload = function() { setTimeout(function(){ window.print(); }, 250); };</script>
</body>
</html>
    `);
    win.document.close();
  };

  const printOrderBill = (ord: Order) => {
    if (typeof window === "undefined") return;
    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow popups to print Tax Receipt.");
      return;
    }
    const itemsHtml = ord.items
      .map(
        (it) => `
      <tr>
        <td style="padding:3px 0;">${it.name} ${it.selectedVariant ? `(${it.selectedVariant.name})` : ""}</td>
        <td style="text-align:center; padding:3px 0;">${it.quantity}</td>
        <td style="text-align:right; padding:3px 0;">₹${it.unitPrice}</td>
        <td style="text-align:right; padding:3px 0; font-weight:bold;">₹${it.totalPrice}</td>
      </tr>
    `
      )
      .join("");

    win.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Receipt - ${ord.orderNumber}</title>
  <style>
    @page { size: 80mm auto; margin: 4mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10pt; color: #000; margin: 0; padding: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 9pt; }
    th { border-bottom: 1px solid #000; text-align: left; padding: 2px 0; font-size: 8.5pt; }
  </style>
</head>
<body>
  <div style="text-align:center; border-bottom:1px dashed #000; padding-bottom:6px; margin-bottom:6px;">
    <div style="font-weight:900; font-size:13pt; text-transform:uppercase;">${ord.restaurantName}</div>
    <div style="font-size:8pt; color:#444;">GSTIN: 36AAECR9988D1Z2 • TAX INVOICE</div>
    <div style="font-size:8pt; margin-top:2px;">Bill: ${ord.orderNumber} • ${new Date(ord.createdAt).toLocaleString()}</div>
    <div style="font-weight:bold; font-size:10pt; margin-top:2px;">${ord.orderType === "dine_in" ? `TABLE ${ord.tableNumber}` : "TAKEAWAY"}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Rate</th>
        <th style="text-align:right;">Amt</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>
  <div style="border-top:1px dashed #000; margin-top:6px; padding-top:4px; font-size:9pt;">
    <div style="display:flex; justify-content:space-between;"><span>Subtotal</span><span>₹${ord.subtotal}</span></div>
    ${ord.discountAmount > 0 ? `<div style="display:flex; justify-content:space-between; color:green;"><span>Discount</span><span>-₹${ord.discountAmount}</span></div>` : ""}
    <div style="display:flex; justify-content:space-between;"><span>GST (5%)</span><span>₹${ord.taxAmount}</span></div>
    <div style="display:flex; justify-content:space-between; font-weight:900; font-size:11pt; border-top:1px solid #000; padding-top:2px; margin-top:2px;">
      <span>Total Paid</span><span>₹${ord.totalAmount}</span>
    </div>
  </div>
  <div style="text-align:center; font-size:8pt; margin-top:10px; color:#555;">
    Payment: ${ord.paymentMethod.toUpperCase()} (${ord.paymentStatus.toUpperCase()})<br/>
    Thank you for visiting!
  </div>
  <script>window.onload = function() { setTimeout(function(){ window.print(); }, 250); };</script>
</body>
</html>
    `);
    win.document.close();
  };

  if (loading || !restaurantData) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 text-slate-900">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Loading {slug} admin panel...</p>
      </div>
    );
  }

  const { restaurant, categories, menuItems, tables } = restaurantData;
  const usedItemsCount = menuItems.length;
  const allowedItemsCount = restaurant.subscription?.totalAllowedItems || 20;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-stone-100 text-slate-700 hover:text-slate-900 border border-stone-200"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-emerald-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 truncate max-w-[140px] sm:max-w-none">{restaurant.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase hidden sm:inline">
                  {restaurant.subscription?.planName}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                {restaurant.city} • Owner: {restaurant.ownerName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Switch Demo Restaurant */}
            <select
              value={slug}
              onChange={(e) => (window.location.href = `/admin/dashboard?slug=${e.target.value}`)}
              className="bg-stone-100 border border-stone-300 text-xs font-bold text-slate-800 rounded-lg px-2 sm:px-3 py-2 max-w-[150px] sm:max-w-none focus:outline-none focus:border-emerald-600"
            >
              {allRestaurants && allRestaurants.length > 0 ? (
                allRestaurants.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="arabian-delight">Arabian Delight</option>
                  <option value="royal-biryani">Royal Biryani House</option>
                  <option value="food-corner">Food Corner & Café</option>
                  {slug && <option value={slug}>{restaurant.name || slug}</option>}
                </>
              )}
            </select>

            <Link
              href={`/restaurant/${slug}?table=03`}
              target="_blank"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 sm:px-3 py-2 rounded-lg transition flex items-center gap-1 shadow-sm shadow-emerald-600/20 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Customer Menu</span>
              <span className="sm:hidden">Menu</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/super-admin"
              className="bg-stone-100 hover:bg-stone-200 text-indigo-700 text-xs font-bold px-2.5 sm:px-3 py-2 rounded-lg border border-stone-200 transition hidden sm:inline"
            >
              Super Admin →
            </Link>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-stone-200 space-y-1">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "orders", label: `Live Orders (${orders.filter((o) => o.orderStatus !== "completed").length})`, icon: ShoppingBag },
              { id: "menu", label: `Menu Items (${usedItemsCount}/${allowedItemsCount})`, icon: UtensilsCrossed },
              { id: "tables", label: "Tables & QR Generator", icon: QrCode },
              { id: "reviews", label: `Customer Reviews (${feedbacks.length})`, icon: Star },
              { id: "daily_sales", label: "Daily Sales", icon: Calendar },
              { id: "monthly_sales", label: "Monthly Reports", icon: BarChart3 },
              { id: "coupons", label: "Coupons & Promos", icon: Tag },
              { id: "inventory", label: "Inventory Tracker", icon: Boxes },
              { id: "subscription", label: "Plan & Addons", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition text-left ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white font-black"
                      : "text-slate-700 hover:bg-stone-100 text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* 2. MAIN DASHBOARD LAYOUT (SIDEBAR + CONTENT) */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-white border-r border-stone-200/80 p-4 hidden md:flex flex-col justify-between shrink-0 shadow-xs">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "overview"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-stone-100 font-medium"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "orders"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-stone-100 font-medium"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Live Orders ({orders.filter((o) => o.orderStatus !== "completed").length})
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "menu"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-stone-100 font-medium"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" /> Menu Items ({usedItemsCount}/{allowedItemsCount})
            </button>
            <button
              onClick={() => setActiveTab("tables")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "tables"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-stone-100 font-medium"
              }`}
            >
              <QrCode className="w-4 h-4" /> Tables & QR Generator
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "reviews"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-stone-100 font-medium"
              }`}
            >
              <Star className="w-4 h-4 text-amber-400" /> Customer Reviews ({feedbacks.length})
            </button>
            <button
              onClick={() => setActiveTab("daily_sales")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "daily_sales"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-stone-100 font-medium"
              }`}
            >
              <Calendar className="w-4 h-4" /> Daily Sales
            </button>
            <button
              onClick={() => setActiveTab("monthly_sales")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "monthly_sales"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-stone-100 font-medium"
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Monthly Sales & Reports
            </button>
            <button
              onClick={() => setActiveTab("coupons")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "coupons"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-stone-100 font-medium"
              }`}
            >
              <Tag className="w-4 h-4" /> Coupons & Promos
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "inventory"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-stone-100 font-medium"
              }`}
            >
              <Boxes className="w-4 h-4" /> Inventory Tracker
            </button>
            <button
              onClick={() => setActiveTab("subscription")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "subscription"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-stone-100 font-medium"
              }`}
            >
              <CreditCard className="w-4 h-4" /> Plan & Addon Packs
            </button>
          </nav>

          {/* Freemium Item Limit Alert Box */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-900">Menu Slots</span>
              <span className="text-emerald-700 font-bold">{usedItemsCount}/{allowedItemsCount}</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (usedItemsCount / allowedItemsCount) * 100)}%` }}
              ></div>
            </div>
            <button
              onClick={() => setActiveTab("subscription")}
              className="text-[10px] text-emerald-700 hover:underline font-bold"
            >
              Buy +10 Items Add-on Pack →
            </button>
          </div>
        </aside>

        {/* MAIN TAB CONTENT AREA */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Restaurant Performance Overview</h2>
                  <p className="text-xs text-slate-500">Live operational & sales telemetry for today</p>
                </div>
                <button
                  onClick={fetchData}
                  className="bg-stone-100 text-slate-900 hover:bg-slate-700 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Sync Data
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">Today's Sales</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-2">
                    {formatCurrency(dailySales?.totalSales || 0)}
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-1">
                    Cash: {formatCurrency(dailySales?.cashCollection || 0)} • UPI/Online: {formatCurrency(dailySales?.onlineCollection || 0)}
                  </p>
                </div>

                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">Today's Orders</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-2">
                    {dailySales?.totalOrders || 0}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {dailySales?.completedOrders || 0} completed • {dailySales?.pendingOrders || 0} active
                  </p>
                </div>

                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">Avg Order Value</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-2">
                    {formatCurrency(dailySales?.averageOrderValue || 0)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    GST collected: {formatCurrency(dailySales?.totalTax || 0)}
                  </p>
                </div>

                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">Table Occupancy</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-2">
                    {tables.filter((t) => t.status !== "available").length} / {tables.length}
                  </p>
                  <p className="text-[11px] text-amber-400 mt-1">
                    {tables.filter((t) => t.status === "bill_requested").length} bill requests pending
                  </p>
                </div>
              </div>

              {/* Quick Operation Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href={`/kitchen?slug=${slug}`}
                  className="bg-slate-900 hover:bg-slate-850 border border-stone-200 hover:border-amber-400/50 p-5 rounded-2xl transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Open Kitchen KDS</h4>
                      <p className="text-xs text-slate-500">Live order ticket management</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>

                <Link
                  href={`/waiter?slug=${slug}`}
                  className="bg-slate-900 hover:bg-slate-850 border border-stone-200 hover:border-blue-400/50 p-5 rounded-2xl transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <BellRing className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Open Waiter Floor</h4>
                      <p className="text-xs text-slate-500">Table states & call alerts</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>

                <button
                  onClick={() => setActiveTab("tables")}
                  className="bg-slate-900 hover:bg-slate-850 border border-stone-200 hover:border-teal-400/50 p-5 rounded-2xl transition flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Print Table QRs</h4>
                      <p className="text-xs text-slate-500">Download table tent sheets</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Best Selling Dishes Today */}
              <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-6">
                <h3 className="font-bold text-slate-900 text-base mb-4">Today's Top Selling Dishes</h3>
                {dailySales?.bestSellingItems && dailySales.bestSellingItems.length > 0 ? (
                  <div className="space-y-3">
                    {dailySales.bestSellingItems.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-xs border-b border-stone-200/80 pb-2.5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-black flex items-center justify-center">
                            #{i + 1}
                          </span>
                          <span className="font-bold text-slate-900">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-slate-500">{item.quantity} orders</span>
                          <span className="font-bold text-emerald-400">{formatCurrency(item.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No dish sales recorded yet today.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Order Management</h2>
                  <p className="text-xs text-slate-500">Total orders in database: {orders.length}</p>
                </div>
                <button
                  onClick={fetchData}
                  className="bg-stone-100 text-slate-900 hover:bg-slate-700 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
                </button>
              </div>

              <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-slate-900/60 text-slate-500 uppercase text-[10px] font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Order #</th>
                      <th className="p-3.5">Type & Table</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total Amount</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-100 text-slate-900/40 transition">
                        <td className="p-3.5 font-bold text-slate-900">
                          {ord.orderNumber}
                          <p className="text-[10px] text-slate-500 font-normal">{formatDate(ord.createdAt)}</p>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-700">
                            {ord.orderType === "dine_in" ? `Table ${ord.tableNumber}` : "Takeaway"}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-slate-900 font-medium">{ord.customerName}</span>
                          {ord.customerPhone && <p className="text-slate-500">{ord.customerPhone}</p>}
                        </td>
                        <td className="p-3.5 text-slate-700 max-w-xs">
                          {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                        </td>
                        <td className="p-3.5 font-black text-slate-900">
                          {formatCurrency(ord.totalAmount)}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ord.orderStatus === "completed"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : ord.orderStatus === "cancelled"
                                ? "bg-rose-500/20 text-rose-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ord.paymentStatus === "paid"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-stone-100 text-slate-900 text-slate-500"
                            }`}
                          >
                            {ord.paymentStatus} ({ord.paymentMethod})
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => printOrderKOT(ord)}
                              className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 px-2 py-1 rounded text-[10px] font-bold transition flex items-center gap-1"
                              title="Print Kitchen Order Ticket"
                            >
                              <Printer className="w-3 h-3" /> KOT
                            </button>
                            <button
                              type="button"
                              onClick={() => printOrderBill(ord)}
                              className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 px-2 py-1 rounded text-[10px] font-bold transition flex items-center gap-1"
                              title="Print Customer Bill Receipt"
                            >
                              <Printer className="w-3 h-3" /> Bill
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MENU MANAGEMENT */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Menu Item Catalog</h2>
                  <p className="text-xs text-slate-500">
                    Using <strong className="text-slate-900">{usedItemsCount}</strong> of <strong className="text-slate-900">{allowedItemsCount}</strong> allowed items in your current plan.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setNewItem({ ...newItem, categoryId: categories[0]?.id || "" });
                      setIsAddItemOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" /> Add Food Item
                  </button>
                  <button
                    onClick={() => setActiveTab("subscription")}
                    className="bg-stone-100 text-slate-900 hover:bg-slate-700 text-amber-400 border border-stone-200 px-3 py-2 rounded-xl text-xs font-bold"
                  >
                    + Add-on Item Packs
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-slate-900/60 text-slate-500 uppercase text-[10px] font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Food Dish</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Diet</th>
                      <th className="p-3.5">Base Price</th>
                      <th className="p-3.5">Availability</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-100 text-slate-900/40 transition">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                            {item.isBestseller && (
                              <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                                Bestseller
                              </span>
                            )}
                            <p className="text-[11px] text-slate-500 max-w-sm truncate">{item.description}</p>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-700">
                          {categories.find((c) => c.id === item.categoryId)?.name || "General"}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.isVeg
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {item.isVeg ? "Veg" : "Non-Veg"}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">
                          {formatCurrency(item.basePrice)}
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleItemAvailability(item)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                              item.isAvailable
                                ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                            }`}
                          >
                            {item.isAvailable ? "In Stock" : "Sold Out"}
                          </button>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="p-1.5 bg-stone-100 text-slate-900 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                            title="Delete Item"
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
          )}

          {/* TAB 4: TABLES & QR CODE GENERATOR */}
          {activeTab === "tables" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Table-Wise QR Code System</h2>
                  <p className="text-xs text-slate-500">
                    Generate, test, download and print table-specific QR codes with tamper-proof tokens.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTableFormError("");
                      setIsAddTableOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
                  >
                    <Plus className="w-4 h-4" /> Add New Table
                  </button>
                  <button
                    onClick={() => setIsPrintSheetOpen(true)}
                    className="bg-stone-100 text-slate-900 hover:bg-slate-700 text-slate-200 border border-stone-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-4 h-4" /> Print QR Sheet
                  </button>
                </div>
              </div>

              {/* Grid of Table QR Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {tables.map((table) => {
                  const targetUrl = typeof window !== "undefined"
                    ? `${window.location.origin}/restaurant/${slug}?table=${table.tableNumber}&token=${table.qrToken}`
                    : `http://localhost:3000/restaurant/${slug}?table=${table.tableNumber}&token=${table.qrToken}`;

                  return (
                    <div
                      key={table.id}
                      className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5 flex flex-col justify-between shadow-xl transition hover:border-stone-200"
                    >
                      <div>
                        {/* Table Header: Table Number, Status & Capacity */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-black text-slate-900">Table {table.tableNumber}</span>
                              <button
                                onClick={() => handleToggleTableActive(table.tableNumber, table.isActive !== false)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                                  table.isActive !== false
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
                                }`}
                                title={table.isActive !== false ? "Active (Click to Deactivate)" : "Inactive (Click to Activate)"}
                              >
                                <Power className="w-2.5 h-2.5" />
                                {table.isActive !== false ? "Active" : "Inactive"}
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                              {table.tableName} {table.location ? `• ${table.location}` : ""}
                            </p>
                          </div>
                          <span className="text-[10px] bg-stone-100 text-slate-900 px-2 py-1 rounded text-slate-700 font-semibold border border-stone-200">
                            {table.capacity} guests
                          </span>
                        </div>

                        {/* Real Scannable QR Code Canvas / Image */}
                        <div className="bg-white p-3.5 rounded-xl mx-auto max-w-[190px] text-slate-950 flex flex-col items-center shadow-lg border border-slate-200">
                          {qrDataUrls[table.tableNumber] ? (
                            <img
                              src={qrDataUrls[table.tableNumber]}
                              alt={`Table ${table.tableNumber} QR`}
                              className="w-36 h-36 object-contain"
                            />
                          ) : (
                            <div className="w-36 h-36 flex flex-col items-center justify-center text-slate-500 gap-2">
                              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                              <span className="text-[10px] font-bold text-slate-500">Generating QR...</span>
                            </div>
                          )}
                          <p className="text-[9px] font-black text-slate-800 uppercase tracking-wider mt-1 text-center truncate max-w-full">
                            {restaurant.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-black text-emerald-700">
                              TABLE {table.tableNumber}
                            </span>
                            {table.location && (
                              <span className="text-[9px] text-slate-500 font-semibold truncate max-w-[80px]">
                                • {table.location}
                              </span>
                            )}
                          </div>
                          <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-black mt-1">
                            SCAN TO ORDER
                          </span>
                        </div>

                        {/* Token Information */}
                        <div className="mt-3 bg-slate-950/70 border border-stone-200 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-mono truncate max-w-[145px]" title={table.qrToken}>
                            Token: {table.qrToken}
                          </span>
                          <button
                            onClick={() => handleCopyToken(table.qrToken)}
                            className="text-[10px] text-slate-500 hover:text-emerald-400 flex items-center gap-1 transition ml-1 shrink-0"
                            title="Copy Secure Token"
                          >
                            {copiedToken === table.qrToken ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedToken === table.qrToken ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-stone-200 space-y-2">
                        {/* Download Buttons: PNG and SVG */}
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              downloadTableQRPNG({
                                restaurantName: restaurant.name,
                                tableNumber: table.tableNumber,
                                tableName: table.tableName,
                                location: table.location,
                                qrDataUrl: qrDataUrls[table.tableNumber],
                                slug,
                              })
                            }
                            disabled={!qrDataUrls[table.tableNumber]}
                            className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 hover:border-emerald-500 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition disabled:opacity-50"
                            title="Download high-resolution scannable PNG placard"
                          >
                            <Download className="w-3.5 h-3.5" /> PNG
                          </button>
                          <button
                            onClick={() =>
                              downloadTableQRSVG({
                                restaurantName: restaurant.name,
                                tableNumber: table.tableNumber,
                                tableName: table.tableName,
                                svgString: qrSvgStrings[table.tableNumber] || "",
                                slug,
                              })
                            }
                            disabled={!qrSvgStrings[table.tableNumber]}
                            className="bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-slate-950 border border-sky-500/30 hover:border-sky-500 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition disabled:opacity-50"
                            title="Download vector SVG format"
                          >
                            <FileDown className="w-3.5 h-3.5" /> SVG
                          </button>
                        </div>

                        {/* Table Tent & Customer Menu Link */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPrintQrTable(table)}
                            className="flex-1 bg-stone-100 text-slate-900 hover:bg-slate-700 text-slate-200 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
                          >
                            <Printer className="w-3.5 h-3.5" /> Table Tent
                          </button>
                          <Link
                            href={`/restaurant/${slug}?table=${table.tableNumber}&token=${table.qrToken}`}
                            target="_blank"
                            className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
                            title="Open Customer-Facing Digital Menu in New Tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* Regenerate Token & Delete Table */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => handleRegenerateToken(table.tableNumber)}
                            disabled={regeneratingTableNum === table.tableNumber}
                            className="text-[10px] text-slate-500 hover:text-amber-400 font-medium flex items-center gap-1 transition disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3 h-3 ${regeneratingTableNum === table.tableNumber ? "animate-spin text-amber-400" : ""}`} />
                            <span>{regeneratingTableNum === table.tableNumber ? "Regenerating..." : "Regenerate Token"}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTable(table.tableNumber)}
                            className="text-[10px] text-slate-500 hover:text-rose-400 font-medium flex items-center gap-1 transition"
                            title="Delete Table"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: CUSTOMER REVIEWS & RATINGS */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Customer Reviews & Ratings</h2>
                  <p className="text-xs text-slate-500">
                    Real-time guest feedback submitted directly from digital table QR menus
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchData}
                  className="bg-stone-100 text-slate-900 hover:bg-slate-700 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Reviews
                </button>
              </div>

              {/* Review KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5 shadow-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Average Rating</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-3xl font-black text-amber-400">
                      {feedbacks.length > 0
                        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                        : "5.0"}
                    </span>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Based on {feedbacks.length} guest reviews</p>
                </div>

                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5 shadow-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Customer Satisfaction</span>
                  <div className="text-3xl font-black text-emerald-400 mt-1">98.4%</div>
                  <p className="text-[11px] text-slate-500 mt-2">Guests loved the taste and fast service</p>
                </div>

                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5 shadow-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Top Complimented Tags</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {["Delicious Food", "Fast Service", "Authentic Flavor", "Great Ambience"].map((tag) => (
                      <span key={tag} className="text-[10px] bg-stone-100 text-slate-900 text-slate-700 px-2 py-0.5 rounded-md font-semibold border border-stone-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {feedbacks.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-stone-200/80 rounded-3xl shadow-sm">
                    <Star className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-900 text-sm">No reviews submitted yet</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Customer ratings submitted on the order tracking page will show up here.
                    </p>
                  </div>
                ) : (
                  feedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5 shadow-lg space-y-3 hover:border-stone-200 transition"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/40">
                            {fb.customerName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{fb.customerName}</span>
                              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                                Verified Dine-In
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {fb.tableNumber ? `Table ${fb.tableNumber}` : "Dine-In"} • {formatDate(fb.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= fb.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Comment */}
                      {fb.comment && (
                        <p className="text-xs text-slate-200 leading-relaxed bg-stone-100 text-slate-900/40 p-3 rounded-xl border border-stone-200">
                          "{fb.comment}"
                        </p>
                      )}

                      {/* Tags */}
                      {fb.tags && fb.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {fb.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium"
                            >
                              ✓ {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DAILY SALES */}
          {activeTab === "daily_sales" && dailySales && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Daily Sales Management</h2>
                  <p className="text-xs text-slate-500">
                    Business report for <strong className="text-slate-900">{dailySales.date}</strong> (Calculated from paid database orders)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Export CSV / Excel
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-stone-100 text-slate-900 hover:bg-slate-700 text-slate-200 border border-stone-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" /> Print Daily PDF
                  </button>
                </div>
              </div>

              {/* Sales Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5">
                  <span className="text-xs font-bold text-slate-500 uppercase">Gross Sales</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(dailySales.grossSales)}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Total items before discounts</p>
                </div>
                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Net Collection</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(dailySales.totalSales)}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Recognized paid sales volume</p>
                </div>
                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5">
                  <span className="text-xs font-bold text-blue-400 uppercase">Cash vs Online Split</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">Cash: {formatCurrency(dailySales.cashCollection)}</p>
                  <p className="text-sm font-bold text-emerald-400">UPI/Online: {formatCurrency(dailySales.onlineCollection)}</p>
                </div>
                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5">
                  <span className="text-xs font-bold text-amber-400 uppercase">GST & Tax Breakdown</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(dailySales.totalTax)}</p>
                  <p className="text-[11px] text-slate-500 mt-1">5% Restaurant CGST + SGST</p>
                </div>
              </div>

              {/* Hour by Hour Sales Breakdown Table */}
              <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-6">
                <h3 className="font-bold text-slate-900 text-base mb-4">Hourly Sales Breakdown (Today)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {dailySales.hourlyBuckets.map((bucket: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-center ${
                        bucket.revenue > 0
                          ? "bg-emerald-500/10 border-emerald-500/40"
                          : "bg-stone-100 text-slate-900/40 border-stone-200 text-slate-500"
                      }`}
                    >
                      <p className="text-[11px] font-bold text-slate-500">{bucket.hour}</p>
                      <p className="text-xs font-black text-slate-900 mt-1">{formatCurrency(bucket.revenue)}</p>
                      <p className="text-[10px] text-slate-500">{bucket.orders} orders</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MONTHLY SALES & REPORTS */}
          {activeTab === "monthly_sales" && monthlySales && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Monthly Sales & Growth Reports</h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive performance for Month {monthlySales.month}, {monthlySales.year}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30">
                    +{monthlySales.growthPercentage}% Growth vs Prev Month
                  </span>
                </div>
              </div>

              {/* Monthly KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Monthly Revenue</span>
                  <p className="text-3xl font-black text-slate-900 mt-1">{formatCurrency(monthlySales.totalMonthlySales)}</p>
                  <p className="text-xs text-slate-500 mt-1">{monthlySales.totalMonthlyOrders} total orders processed</p>
                </div>
                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5">
                  <span className="text-xs font-bold text-slate-500 uppercase">Average Order Value (AOV)</span>
                  <p className="text-3xl font-black text-emerald-400 mt-1">{formatCurrency(monthlySales.averageOrderValue)}</p>
                  <p className="text-xs text-slate-500 mt-1">Across dine-in and takeaways</p>
                </div>
                <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5">
                  <span className="text-xs font-bold text-slate-500 uppercase">Highest Selling Day</span>
                  <p className="text-3xl font-black text-amber-400 mt-1">Day {monthlySales.highestSellingDay?.day}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatCurrency(monthlySales.highestSellingDay?.sales)} peak revenue</p>
                </div>
              </div>

              {/* Calendar Daily Sales Grid */}
              <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-6">
                <h3 className="font-bold text-slate-900 text-base mb-4">Daily Sales Calendar Breakdown</h3>
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {monthlySales.dailyBreakdown.map((d: any) => (
                    <div
                      key={d.day}
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        d.sales > 0
                          ? "bg-emerald-600 text-white shadow-sm font-bold"
                          : "bg-slate-900/60 border-stone-200 text-slate-600"
                      }`}
                    >
                      <span className="font-bold text-slate-500 text-[10px]">Day {d.day}</span>
                      <span className="font-black text-emerald-400 mt-1">{formatCurrency(d.sales)}</span>
                      <span className="text-[10px] text-slate-500">{d.orders} orders</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: COUPONS */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Promo Codes & Coupons</h2>
                  <p className="text-xs text-slate-500">Boost sales with targeted customer discounts</p>
                </div>
                <button
                  onClick={() => setIsAddCouponOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" /> Create Coupon
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-5 shadow-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-slate-900 text-base font-mono bg-stone-100 text-slate-900 px-2.5 py-1 rounded-lg">
                        {coupon.code}
                      </span>
                      <span className="text-xs text-emerald-400 font-bold">
                        {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-2">{coupon.description}</p>
                    <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] text-slate-500 space-y-1">
                      <p>Min Order: {formatCurrency(coupon.minOrderValue)}</p>
                      {coupon.maxDiscount && <p>Max Discount: {formatCurrency(coupon.maxDiscount)}</p>}
                      <p>Times Used: <strong className="text-slate-900">{coupon.usageCount}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: INVENTORY */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Kitchen Ingredient Inventory</h2>
                <p className="text-xs text-slate-500">Auto-deducted when kitchen marks orders completed</p>
              </div>

              <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-slate-900/60 text-slate-500 uppercase text-[10px] font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Ingredient</th>
                      <th className="p-3.5">Current Stock</th>
                      <th className="p-3.5">Min Alert Threshold</th>
                      <th className="p-3.5">Cost/Unit</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {inventory.map((inv) => (
                      <tr key={inv.id} className="hover:bg-stone-100 text-slate-900/40 transition">
                        <td className="p-3.5 font-bold text-slate-900">{inv.ingredientName}</td>
                        <td className="p-3.5 font-black text-slate-900">{inv.currentStock} {inv.unit}</td>
                        <td className="p-3.5 text-slate-500">{inv.minThreshold} {inv.unit}</td>
                        <td className="p-3.5 text-slate-700">{formatCurrency(inv.costPerUnit)}</td>
                        <td className="p-3.5">
                          {inv.currentStock <= inv.minThreshold ? (
                            <span className="bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                              Low Stock Alert
                            </span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                              Healthy
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: SUBSCRIPTION & ADDONS */}
          {activeTab === "subscription" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Subscription & Menu Packages</h2>
                <p className="text-xs text-slate-500">Manage your SaaS tier and add-on capacity packages</p>
              </div>

              <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-6">
                <span className="text-xs font-bold text-slate-500 uppercase">Active Plan</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {restaurant.subscription?.planName}
                </h3>
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  Status: {restaurant.subscription?.status.toUpperCase()} • {formatCurrency(restaurant.subscription?.monthlyPrice || 0)} / month
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200 text-xs">
                  <div>
                    <span className="text-slate-500">Total Allowed Items:</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{allowedItemsCount} dishes</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Purchased Add-on Items:</span>
                    <p className="text-lg font-bold text-amber-400 mt-0.5">+{restaurant.subscription?.purchasedAddonItems || 0} extra dishes</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Table Limit:</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{restaurant.subscription?.tableLimit} tables</p>
                  </div>
                </div>
              </div>

              {/* Add-on Menu Packages */}
              <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-6">
                <h3 className="font-bold text-slate-900 text-base mb-2">Buy Menu Item Add-on Packages</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Expand your menu capacity without upgrading full tiers. Menu items are never deleted when subscriptions renew.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-stone-50 border border-stone-200 text-slate-900 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">+10 Menu Items</h4>
                      <p className="text-xl font-black text-emerald-400 mt-2">₹299</p>
                      <p className="text-[11px] text-slate-500 mt-1">Permanent capacity expansion</p>
                    </div>
                    <button
                      onClick={() => handlePurchasePack("pack-10")}
                      className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs"
                    >
                      Buy Package
                    </button>
                  </div>

                  <div className="bg-stone-100 text-slate-900/80 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between relative shadow-lg">
                    <span className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      Best Value
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">+20 Menu Items</h4>
                      <p className="text-xl font-black text-amber-400 mt-2">₹499</p>
                      <p className="text-[11px] text-slate-500 mt-1">Popular for growing menus</p>
                    </div>
                    <button
                      onClick={() => handlePurchasePack("pack-20")}
                      className="mt-4 w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2 rounded-lg text-xs"
                    >
                      Buy Package
                    </button>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 text-slate-900 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">+50 Menu Items</h4>
                      <p className="text-xl font-black text-indigo-400 mt-2">₹999</p>
                      <p className="text-[11px] text-slate-500 mt-1">For multi-cuisine banquets</p>
                    </div>
                    <button
                      onClick={() => handlePurchasePack("pack-50")}
                      className="mt-4 w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 rounded-lg text-xs"
                    >
                      Buy Package
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD MENU ITEM */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-stone-200 rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsAddItemOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Add New Food Item</h3>
            <p className="text-xs text-slate-500 mt-1">Adds dish to your digital menu</p>

            <form onSubmit={handleCreateMenuItem} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dish Name (English) *</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl text-slate-900 px-3 py-2 text-xs text-slate-900"
                  placeholder="e.g. Charcoal Grilled Chicken Tikka"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl text-slate-900 px-3 py-2 text-xs text-slate-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newItem.basePrice}
                    onChange={(e) => setNewItem({ ...newItem, basePrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl text-slate-900 px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl text-slate-900 px-3 py-2 text-xs text-slate-900 h-16"
                  placeholder="Tender chicken cubes in spices..."
                />
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.isVeg}
                    onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                    className="rounded text-emerald-500"
                  />
                  <span>Pure Vegetarian</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.isBestseller}
                    onChange={(e) => setNewItem({ ...newItem, isBestseller: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>Mark Bestseller</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2"
              >
                Save Menu Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD TABLE */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm no-print">
          <div className="bg-slate-900 border border-stone-200 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsAddTableOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Add New Table
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Creates a table in the database and generates an unpredictable cryptographic QR code.
            </p>

            {tableFormError && (
              <div className="mt-3 bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{tableFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTable} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Table Number *</label>
                  <input
                    type="text"
                    required
                    value={newTableNum}
                    onChange={(e) => {
                      setNewTableNum(e.target.value);
                      setTableFormError("");
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl text-slate-900 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-bold"
                    placeholder="e.g. 09 or T-12"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">Must be unique</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guest Capacity</label>
                  <select
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl text-slate-900 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value={2}>2 Guests (Couple)</option>
                    <option value={4}>4 Guests (Standard)</option>
                    <option value={6}>6 Guests (Family)</option>
                    <option value={8}>8 Guests (Large)</option>
                    <option value={10}>10 Guests (Feast)</option>
                    <option value={12}>12+ Guests (Party)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Table Name / Label</label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl text-slate-900 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Window Booth 9 or Rooftop 4"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Table Location / Section</label>
                <select
                  value={newTableLocation}
                  onChange={(e) => setNewTableLocation(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl text-slate-900 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 mb-2"
                >
                  <option value="Main Dining Area">Main Dining Area</option>
                  <option value="Rooftop Terrace">Rooftop Terrace</option>
                  <option value="AC Family Hall">AC Family Hall</option>
                  <option value="Outdoor Patio">Outdoor Patio</option>
                  <option value="VIP Lounge Booth">VIP Lounge Booth</option>
                  <option value="Garden Cabana">Garden Cabana</option>
                  <option value="Custom">Custom Location...</option>
                </select>
                {newTableLocation === "Custom" && (
                  <input
                    type="text"
                    required
                    onChange={(e) => setNewTableLocation(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl text-slate-900 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    placeholder="Enter custom section name"
                  />
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={tableFormSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {tableFormSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Secure QR...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Save Table & Generate QR Code</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FOLDING-FRIENDLY A4 TABLE TENT PRINT PREVIEW */}
      {printQrTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-950 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl my-6 printable-sheet">
            {/* Action Bar (hidden when printed) */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 no-print">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-600" /> A4 Folding Table Tent Card
                </h3>
                <p className="text-xs text-slate-500">
                  Fold along center line to create a double-sided table standee.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Tent (PDF)
                </button>
                <button
                  onClick={() =>
                    downloadTableQRPNG({
                      restaurantName: restaurant.name,
                      tableNumber: printQrTable.tableNumber,
                      tableName: printQrTable.tableName,
                      location: printQrTable.location,
                      qrDataUrl: qrDataUrls[printQrTable.tableNumber],
                      slug,
                    })
                  }
                  className="bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Placard PNG
                </button>
                <button
                  onClick={() => setPrintQrTable(null)}
                  className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* FOLDING TENT LAYOUT: DUAL-SIDED PANELS */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 space-y-6 bg-slate-50/50">
              {/* FACE 1 (FRONT PANEL) */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-500"
                  />
                  <div className="text-left">
                    <h4 className="text-lg font-black text-slate-900 leading-tight">{restaurant.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{restaurant.tagline}</p>
                  </div>
                </div>

                <div className="inline-block bg-slate-900 text-emerald-400 font-black text-sm px-4 py-1 rounded-full uppercase tracking-wider mb-3">
                  TABLE {printQrTable.tableNumber} {printQrTable.location ? `• ${printQrTable.location}` : ""}
                </div>

                {/* Real QR */}
                <div className="my-2 p-2 bg-white border border-slate-200 rounded-xl inline-block shadow-inner">
                  {qrDataUrls[printQrTable.tableNumber] ? (
                    <img
                      src={qrDataUrls[printQrTable.tableNumber]}
                      alt={`Table ${printQrTable.tableNumber} QR`}
                      className="w-44 h-44 mx-auto object-contain"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                  )}
                </div>

                <h5 className="text-base font-black text-slate-900 mt-1">
                  SCAN &amp; ORDER YOUR FOOD
                </h5>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  1. Scan with Phone Camera &nbsp;•&nbsp; 2. Select Items &nbsp;•&nbsp; 3. Instant UPI / Cash
                </p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">
                  No App Download Required • Contactless Table Service
                </p>
              </div>

              {/* FOLDING GUIDE LINE */}
              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-amber-400"></div>
                </div>
                <span className="relative bg-amber-100 text-amber-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-300 shadow-sm">
                  ✂️ Fold Here For Table Standee ✂️
                </span>
              </div>

              {/* FACE 2 (BACK PANEL) */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-500"
                  />
                  <div className="text-left">
                    <h4 className="text-lg font-black text-slate-900 leading-tight">{restaurant.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{restaurant.tagline}</p>
                  </div>
                </div>

                <div className="inline-block bg-slate-900 text-emerald-400 font-black text-sm px-4 py-1 rounded-full uppercase tracking-wider mb-3">
                  TABLE {printQrTable.tableNumber} {printQrTable.location ? `• ${printQrTable.location}` : ""}
                </div>

                {/* Real QR */}
                <div className="my-2 p-2 bg-white border border-slate-200 rounded-xl inline-block shadow-inner">
                  {qrDataUrls[printQrTable.tableNumber] ? (
                    <img
                      src={qrDataUrls[printQrTable.tableNumber]}
                      alt={`Table ${printQrTable.tableNumber} QR`}
                      className="w-44 h-44 mx-auto object-contain"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                  )}
                </div>

                <h5 className="text-base font-black text-slate-900 mt-1">
                  SCAN &amp; ORDER YOUR FOOD
                </h5>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  Point camera to browse full digital menu &amp; customize dishes
                </p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">
                  Powered by QRDening Multi-Restaurant SaaS
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PRINTABLE A4 ALL-TABLES QR DIRECTORY SHEET */}
      {isPrintSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-950 rounded-2xl max-w-4xl w-full p-6 relative shadow-2xl my-6 printable-sheet">
            {/* Header controls (no-print) */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 no-print">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-emerald-600" /> Printable All-Tables QR Sheet (A4)
                </h3>
                <p className="text-xs text-slate-500">
                  Ready to print or save as PDF. Contains {tables.length} table QR codes formatted for easy cutting and display.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" /> Print Sheet / Save PDF
                </button>
                <button
                  onClick={() => setIsPrintSheetOpen(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            </div>

            {/* A4 Sheet Content */}
            <div className="p-4 bg-white">
              {/* Restaurant Branding Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                  />
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{restaurant.name}</h2>
                    <p className="text-xs text-slate-600 font-medium">{restaurant.tagline} • {restaurant.city}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-slate-900 text-white px-3 py-1 rounded-md">
                    Official Table QR Codes
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Generated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Grid of Printable Table Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className="border-2 border-slate-200 rounded-xl p-3.5 text-center flex flex-col items-center justify-between bg-white shadow-sm"
                    style={{ pageBreakInside: "avoid" }}
                  >
                    <div className="w-full pb-1 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider truncate max-w-[120px]">
                        {restaurant.name}
                      </span>
                      <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                        {table.capacity}p
                      </span>
                    </div>

                    <div className="my-1.5">
                      <div className="bg-slate-900 text-emerald-400 font-black text-xs px-2.5 py-0.5 rounded-full inline-block uppercase">
                        TABLE {table.tableNumber}
                      </div>
                      {table.location && (
                        <p className="text-[9px] text-slate-500 font-semibold mt-0.5 truncate max-w-[140px]">
                          {table.location}
                        </p>
                      )}
                    </div>

                    {/* QR Code */}
                    <div className="p-1.5 bg-white border border-slate-200 rounded-lg">
                      {qrDataUrls[table.tableNumber] ? (
                        <img
                          src={qrDataUrls[table.tableNumber]}
                          alt={`Table ${table.tableNumber} QR`}
                          className="w-32 h-32 mx-auto object-contain"
                        />
                      ) : (
                        <div className="w-32 h-32 flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                        </div>
                      )}
                    </div>

                    <div className="mt-1.5 w-full pt-1 border-t border-slate-100">
                      <p className="text-[10px] font-black text-slate-900">
                        SCAN TO ORDER
                      </p>
                      <p className="text-[8px] text-slate-500">
                        Camera • Direct UPI &amp; Cash
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sheet Footer */}
              <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500 flex items-center justify-between">
                <span>QRDening Restaurant Management Platform</span>
                <span>Cut along borders and place on designated tables</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print, header, nav, aside, button {
            display: none !important;
          }
          .printable-sheet {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
            z-index: 99999 !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>
    </div>
  );
}

export default function RestaurantAdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Admin Panel...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
