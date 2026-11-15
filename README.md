# QRDening – Multi-Restaurant SaaS Platform
**Scan. Order. Manage. Grow.**

QRDening is a production-oriented, scalable multi-restaurant management and digital QR ordering platform designed for Restaurants, Hotels, Cafés, Fast Food Outlets, and Cloud Kitchens across India and global markets.

Platform Model: **One Central Platform – Multiple Isolated Restaurants**

---

## 🌟 Key Platform Modules & Portals

1. **Public SaaS Website (`/`)**
   - High-conversion SaaS landing page with emerald/slate premium theme.
   - Interactive Live Demo Switcher to test all 5 roles in one click.
   - Transparent pricing plans: Free Trial (₹0), Starter (₹999/mo), Growth (₹1,999/mo), Enterprise (₹3,999/mo).
   - "Book Free Demo" and instant "Restaurant Registration" onboarding with automatic table QR generation.
   - Interactive FAQ, customer testimonials, Indian GST (5%) & UPI compliance highlights.

2. **Customer Digital QR Menu & Ordering (`/restaurant/[slug]?table=03`)**
   - Table Detection: Automatically identifies table number (e.g. Table 03 at Arabian Delight) with secure cryptographic tokens.
   - Tamper-proof table identity: URL tampering cannot steal or redirect table identity.
   - Dine-In vs Takeaway mode switch.
   - Multi-Language Switcher: English, Hindi (हिंदी), Telugu (తెలుగు), Urdu (اردو) with translated dish names and descriptions.
   - Instant search, Veg / Non-Veg filter, Bestseller tags, customization modal (Portion sizes, extra toppings, special instructions).
   - Interactive Cart Drawer with real-time promo code engine (`WELCOME50`, `MANDI20`, `FLAT100`).
   - Guest Checkout: Instant UPI (simulated dynamic UPI QR with restaurant VPA), Cash at counter, or Online Card Gateway.
   - Live Order Tracking (`/restaurant/[slug]/order/[orderId]`): Animated status tracker (Received → Accepted → Cooking → Ready → Completed).
   - Gamified Loyalty: Digital Stamp Card (collect 5 stamps for a free dessert) + daily Spin & Win wheel.
   - Quick Staff Alerts: "🛎️ Call Waiter" and "🧾 Request Bill" buttons.

3. **Live Kitchen Display System - KDS (`/kitchen?slug=arabian-delight`)**
   - Real-time order tickets with audio chime and color-coded urgency indicators (Green < 5m, Amber 5-15m, Red > 15m).
   - Visual status transitions: NEW → ACCEPTED → PREPARING → READY → COMPLETED.
   - Order rejection / cancellation modal with mandatory reason.
   - Displays item customizations, extra toppings, and cooking notes prominently in amber.
   - Filter by Active Kitchen Queue, Ready to Serve, or All Orders.

4. **Waiter & Floor Staff Dashboard (`/waiter?slug=arabian-delight`)**
   - Live floor grid showing all tables with color-coded statuses:
     - Available (Green)
     - Occupied (Blue)
     - Order Pending (Amber)
     - Cooking / Preparing (Purple)
     - Ready to Serve (Emerald Pulse)
     - Bill Requested (Rose/Red)
   - Real-time Waiter Call Alerts banner: table assistance & printed bill requests.
   - Quick table status toggling and table active order viewer.

5. **Restaurant Admin Dashboard (`/admin/dashboard?slug=arabian-delight`)**
   - **Overview**: Real-time sales telemetry, active orders count, table occupancy, bestsellers.
   - **Orders Management**: Full order table with status filters, customer info, and payment verification.
   - **Menu Item Catalog**: Categorized items with Veg/Non-Veg badges, prices, availability toggle, and freemium slot counter.
   - **Table & QR Code Generator**: Table list, single QR download, and printable Table Tent Cards (with restaurant branding & table #).
   - **Daily Sales Dashboard**: Gross sales, discounts, 5% GST, net collection, Cash vs UPI split, and hour-by-hour sales breakdown. Export to CSV/Excel and print daily PDF.
   - **Monthly Sales Dashboard**: Monthly breakdown, daily trend calendar, AOV (Average Order Value), peak business day, and growth metrics.
   - **Coupons & Promos**: Percentage and fixed discount promo engine with min order values.
   - **Inventory Tracker**: Ingredient stock levels, cost per unit, low-stock threshold alerts, and auto-deduction upon order completion.
   - **Subscription & Add-ons**: Active plan details, buy +10, +20, or +50 menu item packs.

6. **Super Admin Platform Owner Panel (`/super-admin`)**
   - Platform Telemetry: Total registered restaurants, active vs pending verification, total customer orders.
   - **Crucial Separation**: Restaurant Sales GMV is cleanly separated from QRDening SaaS Subscription Revenue.
   - Restaurant Management: Account verification, activation/suspension, sales volume tracking, and direct admin inspection.
   - Dynamic Plan Pricing Manager: Edit monthly/yearly subscription prices and menu item limits without code changes.
   - Menu Item Freemium Package Manager.
   - Platform Security & Audit Logs.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Next.js Server Components, API Route Handlers, Server Actions.
- **Database**: 
  - Production DDL: PostgreSQL schema (`lib/db/schema.postgresql.sql`) with RLS (Row Level Security), foreign keys, indexes, and enums.
  - Development / Demo runtime: Zero-configuration JSON/SQLite storage (`lib/db/storage.ts`) with persistent multi-tenant isolation, atomic file writes, and initial seed data for 3 live demo restaurants.
- **Printing**: Clean `@media print` stylesheets for Table QR Tent Cards and Daily Sales Reports.

---

## 📂 Project Structure

```
qrdening/
├── app/
│   ├── page.tsx                          # Public SaaS Landing Page
│   ├── layout.tsx                        # Root Layout & Metadata
│   ├── globals.css                       # Tailwind & Print Styles
│   ├── kitchen/page.tsx                  # Kitchen Display System (KDS)
│   ├── waiter/page.tsx                   # Waiter Floor & Table Management
│   ├── super-admin/page.tsx              # Super Admin Platform Control
│   ├── admin/dashboard/page.tsx          # Restaurant Admin Panel
│   ├── restaurant/[slug]/
│   │   ├── page.tsx                      # Customer Digital QR Menu
│   │   └── order/[orderId]/page.tsx      # Live Customer Order Tracking
│   └── api/
│       ├── restaurants/                  # Restaurant Directory & Registration
│       ├── restaurants/[slug]/           # Profile, Categories, Menu, Tables
│       ├── orders/                       # Order Placement & Status Updates
│       ├── orders/[orderId]/pay/         # Payment Verification (UPI, Cash, Razorpay)
│       ├── waiter-calls/                 # Call Waiter & Request Bill Alerts
│       ├── coupons/                      # Promo Code Validation & Creation
│       ├── inventory/                    # Ingredient Stock & Deduction
│       ├── analytics/daily/              # Daily Sales Report API
│       ├── analytics/monthly/            # Monthly Sales Report API
│       └── super-admin/                  # Platform Stats & Plan Pricing
├── lib/
│   ├── db/
│   │   ├── types.ts                      # Relational Schema Types
│   │   ├── schema.postgresql.sql         # Production PostgreSQL DDL
│   │   ├── seed.ts                       # Realistic Multi-Restaurant Seed Data
│   │   └── storage.ts                    # Tenant-Isolated Storage Engine
│   ├── i18n.ts                           # Multi-Language Dictionary (EN, HI, TE, UR)
│   └── utils.ts                          # Currency & Date Formatters
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18+ (Node v20 LTS recommended)
- npm or pnpm

### 2. Installation
```bash
cd C:\Users\CHIST\.gemini\antigravity\scratch\qrdening
npm install
```

### 3. Production Build & Start
```bash
npm run build
npm start
```
The application will be live at `http://localhost:3000`.

---

## 🧭 Live Demo URLs

| Portal | URL | Demo Credentials / Target |
|---|---|---|
| **Public Website** | `http://localhost:3000` | Landing Page, Pricing & Registration |
| **Customer QR Menu** | `http://localhost:3000/restaurant/arabian-delight?table=03` | Table 03 at Arabian Delight |
| **Kitchen Display (KDS)** | `http://localhost:3000/kitchen?slug=arabian-delight` | Chef Zaheer Live Queue |
| **Waiter Dashboard** | `http://localhost:3000/waiter?slug=arabian-delight` | Sunil Kumar Floor View |
| **Restaurant Admin** | `http://localhost:3000/admin/dashboard?slug=arabian-delight` | Tariq Mansoor (Owner Panel) |
| **Super Admin** | `http://localhost:3000/super-admin` | Platform Owner Control |

---

## 🔒 Security & Tenant Isolation

1. **Tenant Separation**: Every database query and mutation strictly validates and enforces `restaurantId`. Records from one restaurant cannot be read, modified, or deleted by another.
2. **Tamper-Proof QR Identity**: Tables use encrypted cryptographic tokens (`ad-tok-tbl-03-xxx`). Query parameter manipulation cannot hijack another table's bill.
3. **Server-Side Pricing**: Prices, taxes, and coupon discounts are calculated strictly on the server. Frontend prices are never trusted.
4. **Independent Sales Accounting**: Platform subscription revenue is mathematically separated from restaurant food GMV. Order payments are directly credited to restaurant accounts and excluded from platform SaaS income.
