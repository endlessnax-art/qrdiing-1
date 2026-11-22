# QRDine – Multi-Restaurant QR Digital Menu SaaS Platform

> **Modern, Contactless Digital Menus for Restaurants. One Central SaaS Platform – Multiple Independent Restaurants.**

Welcome to **QRDine**! This guide is written specifically in simple, clear language for beginners. Follow along step-by-step to set up, understand, and run your project.

---

## 🌟 What is QRDine?

QRDine is a multi-tenant Software-as-a-Service (SaaS) platform where **multiple independent restaurants** can each have:
- Their own **account and private dashboard** (`/dashboard`)
- Their own **digital menu with dish categories, prices, and photos**
- Custom **table-specific QR codes** (e.g., Table 01, Table 02) that diners scan with any smartphone camera
- High-resolution **PNG & vector SVG QR downloads** and printable Table Tent Cards
- A **Super Admin panel** (`/admin`) for platform owners to oversee restaurants, plans, and revenue
- Complete **data isolation** using PostgreSQL Row Level Security (RLS) so one restaurant can never see another's private data.

> **Phase 1 Scope**: Focused strictly on the contactless QR menu viewing experience, multi-tenant onboarding, dashboards, and database security. Ordering, cart, and payment-at-table will be introduced in subsequent phases.

---

## 🏗️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React, TypeScript, Tailwind CSS
- **Design System**: Modern SaaS White Background with Royal-Blue Primary Palette (`#2563eb`, `#1e40af`)
- **Backend & Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (Email & Password, Role-Based Access)
- **Security**: PostgreSQL Row Level Security (RLS)
- **QR Generation**: Client-side dynamic QR Engine (`qrcode`)
- **Deployment**: Vercel-Ready

---

## 📁 Scalable Folder Structure

```
├── app/
│   ├── page.tsx               # High-converting SaaS Landing Page (Royal Blue & White theme)
│   ├── layout.tsx             # Root Layout with metadata, responsive viewport, styling
│   ├── globals.css            # Clean white background, print stylesheets for QR tent cards
│   ├── login/
│   │   └── page.tsx           # Owner & Super Admin Login (Supabase Auth)
│   ├── register/
│   │   └── page.tsx           # Restaurant onboarding & registration flow
│   ├── dashboard/
│   │   └── page.tsx           # Restaurant Owner Dashboard (Menu, QR Generator, Branches, AI preview)
│   ├── admin/
│   │   └── page.tsx           # Central Super Admin Dashboard (Global restaurants, plans, security)
│   └── menu/
│       └── [slug]/
│           └── page.tsx       # Fast Customer QR Digital Menu (Read-only, mobile-first, table detection)
├── components/
│   └── SupabaseConfigBanner.tsx # Helpful diagnostic banner when Supabase keys are pending
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client (createBrowserClient)
│   │   ├── server.ts          # Server client with secure cookie handling (createServerClient)
│   │   ├── admin.ts           # Guarded admin client with service role key (Server-only)
│   │   ├── middleware.ts      # Edge middleware token refresh
│   │   └── config.ts          # Environment variables validation & diagnostics
│   ├── types/
│   │   └── database.ts        # TypeScript definitions for all DB tables & tenant schemas
│   └── utils.ts               # Shared helpers (cn, formatCurrency, slugify)
├── middleware.ts              # Protects /dashboard and /admin; refreshes Supabase session
├── supabase/
│   ├── migrations/
│   │   └── 20261121000000_qrdine_init.sql  # Complete PostgreSQL schema with RLS policies
│   └── seed.sql               # Demo data: The Royal Plate, categories, dishes, QR codes
├── .env.example               # Environment variables template with explanations
├── .env.local                 # Local environment credentials file
├── tailwind.config.ts         # Configured with Royal Blue brand palette
└── README.md                  # Beginner-friendly setup instructions
```

---

## 🚀 Beginner Quick-Start Guide (5 Simple Steps)

### Step 1: Open the Project Directory
In your terminal (PowerShell or Bash), navigate to the project directory:
```bash
cd "C:\Users\CHIST\.gemini\antigravity\scratch\qrdening"
```

### Step 2: Install Dependencies
If not already installed, run:
```bash
npm install
```

### Step 3: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and name it `qrdine-db`. Choose a strong database password.
3. Once created, go to **Project Settings** (gear icon at the bottom left) -> **API**.
4. You will see:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API Keys** -> `anon` / `public`
   - **Project API Keys** -> `service_role` (Keep this secret!)

### Step 4: Configure `.env.local`
Open `.env.local` in your editor and paste your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPER_ADMIN_EMAILS=admin@qrdine.com,owner@qrdine.com
```

> **Note**: Even if you haven't set up Supabase yet, the project runs in **Preview Mode** with friendly diagnostic guidance so you can test all interfaces immediately!

### Step 5: Run Database Migrations in Supabase
1. In your Supabase Dashboard, open the **SQL Editor** tab from the left sidebar.
2. Click **New query**.
3. Copy the entire contents of:
   `supabase/migrations/20261121000000_qrdine_init.sql`
4. Paste it into the SQL Editor and click **Run**. This creates all tables (`restaurants`, `restaurant_members`, `menus`, `categories`, `menu_items`, `qr_codes`) and enables Row Level Security (RLS).
5. (Optional) Run `supabase/seed.sql` to populate sample restaurants ("The Royal Plate") and dishes for immediate testing!

### Step 6: Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🧭 Routes Overview

| Route | Purpose | Access |
|---|---|---|
| `/` | **QRDine SaaS Landing Page**: Value proposition, feature highlights, pricing, and live interactive demo switcher. | Public |
| `/login` | **Sign In Portal**: Dual login for Restaurant Owners and Platform Super Admins using Supabase Auth. | Public |
| `/register` | **Restaurant Registration**: Onboarding flow collecting restaurant name, URL slug, owner contact, and address. | Public |
| `/dashboard` | **Restaurant Owner Dashboard**: Menu items management (CRUD), category switcher, instant table QR generator (PNG/SVG/Print), branches, and analytics. | Authenticated Owner |
| `/admin` | **Super Admin Panel**: Platform overview, restaurant directory, active/suspended toggles, and subscription tier manager. | Super Admin Only |
| `/menu/[slug]` | **Customer Digital Menu**: Lightning-fast mobile menu (e.g., `/menu/the-royal-plate?table=05`) with search, category tabs, and veg/non-veg tags. | Public (No Login Needed) |

---

## 🔒 Security & Multi-Tenant Isolation (RLS)

QRDine enforces tenant isolation at the **database layer** using Supabase PostgreSQL **Row Level Security (RLS)**:

1. **`is_restaurant_member(restaurant_id)`**:
   Every database query checks if `auth.uid()` exists in `restaurant_members` for that `restaurant_id`. A restaurant manager cannot read, edit, or delete another restaurant's dishes or settings.
2. **Public Menu Access**:
   Customers visiting `/menu/[slug]` only receive read access to active dishes (`is_available = true`) belonging to active restaurants (`is_active = true`).
3. **Guarded Service Role Key**:
   The elevated `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side administrative code and is never exposed in browser JavaScript bundles.

---

## 🔮 Phase 2 Roadmap: AI Menu Converter

In Phase 2, restaurant owners will be able to upload a photo (JPG/PNG) or PDF of their printed menu. An AI vision engine will:
1. Extract food item names, exact prices, and categories using vision OCR.
2. Detect original typography, colors, and layout structures.
3. Allow the restaurant owner to approve and preview the digitized menu side-by-side with the uploaded photo before publishing.

---

## 🧪 Verification Commands

To verify that the project is clean and free of errors:
- **TypeScript Typecheck**: `npx tsc --noEmit`
- **Production Build**: `npm run build`
