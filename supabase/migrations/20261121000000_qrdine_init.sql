-- =====================================================================
-- QRDine - Multi-Restaurant QR Digital Menu SaaS Database Architecture
-- Phase 1 Migration: Core Multi-Tenant Structure & Row Level Security
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. RESTAURANTS (Tenant Master Table)
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    owner_name VARCHAR(150) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    category VARCHAR(100) NOT NULL DEFAULT 'Casual Dining',
    logo_url TEXT,
    cover_url TEXT,
    opening_time TIME NOT NULL DEFAULT '11:00:00',
    closing_time TIME NOT NULL DEFAULT '23:00:00',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_active ON public.restaurants(is_active);

-- 3. RESTAURANT MEMBERS (Multi-Tenant Access Control)
CREATE TABLE IF NOT EXISTS public.restaurant_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'manager', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_restaurant_member UNIQUE (restaurant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_restaurant_members_user ON public.restaurant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_members_res ON public.restaurant_members(restaurant_id);

-- 4. BRANCHES (Multi-Branch Support)
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(25),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_branches_restaurant ON public.branches(restaurant_id);

-- 5. MENUS
CREATE TABLE IF NOT EXISTS public.menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL DEFAULT 'Main Digital Menu',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_menus_restaurant ON public.menus(restaurant_id);

-- 6. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_categories_restaurant ON public.categories(restaurant_id);

-- 7. MENU ITEMS
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    image_url TEXT,
    is_veg BOOLEAN NOT NULL DEFAULT TRUE,
    is_spicy BOOLEAN NOT NULL DEFAULT FALSE,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON public.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);

-- 8. QR CODES
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    table_number VARCHAR(20),
    code_identifier VARCHAR(100) UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    qr_image_url TEXT,
    scan_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_restaurant ON public.qr_codes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_identifier ON public.qr_codes(code_identifier);

-- 9. SCAN ANALYTICS
CREATE TABLE IF NOT EXISTS public.scan_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    qr_code_id UUID REFERENCES public.qr_codes(id) ON DELETE SET NULL,
    table_number VARCHAR(20),
    device_type VARCHAR(50),
    user_agent TEXT,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_scan_analytics_restaurant ON public.scan_analytics(restaurant_id);

-- 10. UPLOADED MENU FILES (Ready for Phase 2 AI Photo/PDF digitization)
CREATE TABLE IF NOT EXISTS public.uploaded_menu_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_uploaded_menu_restaurant ON public.uploaded_menu_files(restaurant_id);

-- 11. AI PROCESSING JOBS (Ready for Phase 2)
CREATE TABLE IF NOT EXISTS public.ai_processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES public.uploaded_menu_files(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'extracting', 'reconstructing', 'approved', 'rejected')),
    confidence_score DECIMAL(5,2),
    extracted_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_ai_jobs_restaurant ON public.ai_processing_jobs(restaurant_id);

-- 12. SUBSCRIPTION PLANS & SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    max_items INT NOT NULL DEFAULT 50,
    max_branches INT NOT NULL DEFAULT 1,
    qr_limit INT NOT NULL DEFAULT 10,
    ai_conversion_limit INT NOT NULL DEFAULT 2,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled')),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now() + interval '30 days'),
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_restaurant ON public.subscriptions(restaurant_id);

-- =====================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES FOR TOTAL TENANT ISOLATION
-- =====================================================================

-- Helper 1: Check if the current authenticated user belongs to the given restaurant
CREATE OR REPLACE FUNCTION public.is_restaurant_member(target_restaurant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.restaurant_members
        WHERE restaurant_id = target_restaurant_id
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper 2: Check if user is platform super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT COALESCE(raw_user_meta_data->>'role', '') = 'super_admin'
        FROM auth.users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS across all tables
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_menu_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RESTAURANTS POLICIES
-- Anyone can view active restaurants (for customer menu viewing)
CREATE POLICY "Public restaurants viewable if active" 
    ON public.restaurants FOR SELECT 
    USING (is_active = TRUE OR public.is_restaurant_member(id) OR public.is_super_admin());

-- Authenticated users can create a new restaurant during onboarding
CREATE POLICY "Authenticated user can insert restaurant" 
    ON public.restaurants FOR INSERT 
    TO authenticated 
    WITH CHECK (TRUE);

-- Only restaurant owners or super admins can update restaurant details
CREATE POLICY "Owners and Super Admins can update restaurant" 
    ON public.restaurants FOR UPDATE 
    USING (public.is_restaurant_member(id) OR public.is_super_admin());

-- RESTAURANT MEMBERS POLICIES
CREATE POLICY "Members can view their own membership" 
    ON public.restaurant_members FOR SELECT 
    USING (user_id = auth.uid() OR public.is_super_admin() OR public.is_restaurant_member(restaurant_id));

CREATE POLICY "Owners and Super Admins can manage members" 
    ON public.restaurant_members FOR ALL 
    USING (public.is_super_admin() OR EXISTS (
        SELECT 1 FROM public.restaurant_members
        WHERE restaurant_id = public.restaurant_members.restaurant_id
        AND user_id = auth.uid()
        AND role = 'owner'
    ));

-- MENUS POLICIES
CREATE POLICY "Public can view active menus" 
    ON public.menus FOR SELECT 
    USING (is_active = TRUE OR public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

CREATE POLICY "Members can manage their menus" 
    ON public.menus FOR ALL 
    USING (public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

-- CATEGORIES POLICIES
CREATE POLICY "Public can view active categories" 
    ON public.categories FOR SELECT 
    USING (is_active = TRUE OR public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

CREATE POLICY "Members can manage their categories" 
    ON public.categories FOR ALL 
    USING (public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

-- MENU ITEMS POLICIES
CREATE POLICY "Public can view available menu items" 
    ON public.menu_items FOR SELECT 
    USING (is_available = TRUE OR public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

CREATE POLICY "Members can manage their menu items" 
    ON public.menu_items FOR ALL 
    USING (public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

-- QR CODES POLICIES
CREATE POLICY "Public can view active qr codes" 
    ON public.qr_codes FOR SELECT 
    USING (is_active = TRUE OR public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

CREATE POLICY "Members can manage their qr codes" 
    ON public.qr_codes FOR ALL 
    USING (public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

-- SCAN ANALYTICS POLICIES
CREATE POLICY "Public can insert scan analytics" 
    ON public.scan_analytics FOR INSERT 
    WITH CHECK (TRUE);

CREATE POLICY "Members can view their scan analytics" 
    ON public.scan_analytics FOR SELECT 
    USING (public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

-- UPLOADED FILES & AI JOBS POLICIES
CREATE POLICY "Members can manage uploaded files" 
    ON public.uploaded_menu_files FOR ALL 
    USING (public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

CREATE POLICY "Members can manage ai jobs" 
    ON public.ai_processing_jobs FOR ALL 
    USING (public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

-- SUBSCRIPTION PLANS POLICIES (Public read, Super Admin write)
CREATE POLICY "Anyone can view subscription plans" 
    ON public.subscription_plans FOR SELECT 
    USING (is_active = TRUE);

CREATE POLICY "Super admin can manage subscription plans" 
    ON public.subscription_plans FOR ALL 
    USING (public.is_super_admin());

-- SUBSCRIPTIONS POLICIES
CREATE POLICY "Members can view their own subscription" 
    ON public.subscriptions FOR SELECT 
    USING (public.is_restaurant_member(restaurant_id) OR public.is_super_admin());

-- =====================================================================
-- 14. UPDATED_AT TRIGGER
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_restaurants_updated_at ON public.restaurants;
CREATE TRIGGER set_restaurants_updated_at
    BEFORE UPDATE ON public.restaurants
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
