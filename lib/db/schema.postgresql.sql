-- =====================================================================
-- QRDening - Multi-Restaurant SaaS Platform Database Schema
-- Production PostgreSQL DDL with Multi-Tenant Isolation
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'restaurant_admin',
    'kitchen_staff',
    'waiter_staff',
    'customer'
);

CREATE TYPE restaurant_category AS ENUM (
    'Fine Dining',
    'Casual Dining',
    'Café & Bakery',
    'Fast Food',
    'Cloud Kitchen',
    'Bar & Pub',
    'Biryani & Arabic'
);

CREATE TYPE table_status AS ENUM (
    'available',
    'occupied',
    'order_pending',
    'preparing',
    'ready',
    'bill_requested'
);

CREATE TYPE order_status AS ENUM (
    'new',
    'accepted',
    'preparing',
    'ready',
    'completed',
    'cancelled'
);

CREATE TYPE order_type AS ENUM (
    'dine_in',
    'takeaway'
);

CREATE TYPE payment_method AS ENUM (
    'cash',
    'upi',
    'razorpay_online'
);

CREATE TYPE payment_status AS ENUM (
    'pending',
    'paid',
    'refunded'
);

-- 3. RESTAURANTS (Tenant Master)
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    owner_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    category restaurant_category DEFAULT 'Casual Dining',
    logo_url TEXT,
    cover_image_url TEXT,
    opening_time TIME NOT NULL DEFAULT '11:00:00',
    closing_time TIME NOT NULL DEFAULT '23:00:00',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_active ON restaurants(is_active);

-- 4. RESTAURANT SETTINGS
CREATE TABLE restaurant_settings (
    restaurant_id UUID PRIMARY KEY REFERENCES restaurants(id) ON DELETE CASCADE,
    currency VARCHAR(10) DEFAULT 'INR',
    tax_rate_percent DECIMAL(5,2) DEFAULT 5.00, -- 5% Restaurant GST
    tax_gstin VARCHAR(50),
    service_charge_percent DECIMAL(5,2) DEFAULT 0.00,
    upi_vpa VARCHAR(100),
    upi_name VARCHAR(150),
    razorpay_key_id VARCHAR(100),
    auto_accept_orders BOOLEAN DEFAULT FALSE,
    enable_takeaway BOOLEAN DEFAULT TRUE,
    enable_dine_in BOOLEAN DEFAULT TRUE,
    enable_loyalty_stamp BOOLEAN DEFAULT TRUE,
    enable_spin_to_win BOOLEAN DEFAULT TRUE,
    primary_color VARCHAR(20) DEFAULT '#059669',
    secondary_color VARCHAR(20) DEFAULT '#d97706',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SUBSCRIPTION PLANS (Super Admin Configured)
CREATE TABLE subscription_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    monthly_price DECIMAL(10,2) NOT NULL,
    yearly_price DECIMAL(10,2) NOT NULL,
    menu_item_limit INT NOT NULL DEFAULT 20,
    table_limit INT NOT NULL DEFAULT 10,
    staff_limit INT NOT NULL DEFAULT 5,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. RESTAURANT SUBSCRIPTIONS
CREATE TABLE restaurant_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(50) DEFAULT 'trial',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    monthly_price DECIMAL(10,2) NOT NULL,
    purchased_addon_items INT DEFAULT 0,
    total_allowed_items INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rest_subscriptions_rest ON restaurant_subscriptions(restaurant_id);

-- 7. USERS & STAFF
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE, -- NULL for Super Admin
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'waiter_staff',
    quick_pin VARCHAR(10), -- For kitchen/waiter rapid terminal sign-in
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_rest_id ON users(restaurant_id);
CREATE INDEX idx_users_role ON users(role);

-- 8. MENU CATEGORIES
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100), -- Hindi
    name_te VARCHAR(100), -- Telugu
    name_ur VARCHAR(100), -- Urdu
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_categories_rest ON menu_categories(restaurant_id);

-- 9. MENU ITEMS
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    name_hi VARCHAR(150),
    name_te VARCHAR(150),
    name_ur VARCHAR(150),
    description TEXT,
    description_hi TEXT,
    description_te TEXT,
    description_ur TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_veg BOOLEAN DEFAULT TRUE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time_minutes INT DEFAULT 15,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_items_rest ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_cat ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);

-- 10. FOOD VARIANTS (e.g. Half, Full, Large)
CREATE TABLE food_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- 11. FOOD ADDONS / TOPPINGS
CREATE TABLE food_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- 12. TABLES & QR CODES
CREATE TABLE restaurant_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number VARCHAR(20) NOT NULL, -- e.g. "01", "02"
    table_name VARCHAR(100),
    capacity INT DEFAULT 4,
    status table_status DEFAULT 'available',
    qr_token VARCHAR(255) UNIQUE NOT NULL,
    active_order_id UUID,
    assigned_waiter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_rest_table UNIQUE(restaurant_id, table_number)
);

CREATE INDEX idx_tables_rest ON restaurant_tables(restaurant_id);
CREATE INDEX idx_tables_qr_token ON restaurant_tables(qr_token);

-- 13. ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    order_number VARCHAR(50) NOT NULL,
    order_type order_type NOT NULL DEFAULT 'dine_in',
    table_number VARCHAR(20),
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    service_charge DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    coupon_code VARCHAR(50),
    total_amount DECIMAL(10,2) NOT NULL,
    order_status order_status DEFAULT 'new',
    payment_method payment_method DEFAULT 'cash',
    payment_status payment_status DEFAULT 'pending',
    payment_reference VARCHAR(100),
    rejection_reason TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_rest ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- 14. ORDER ITEMS
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    item_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    variant_details JSONB,
    addon_details JSONB,
    special_instructions TEXT,
    total_price DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- 15. PAYMENTS & TRANSACTIONS
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_status payment_status NOT NULL,
    transaction_ref VARCHAR(100),
    gateway_signature VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_rest ON payments(restaurant_id);

-- 16. REFUNDS
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'processed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. WAITER CALLS & ALERTS
CREATE TABLE waiter_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number VARCHAR(20) NOT NULL,
    call_type VARCHAR(50) DEFAULT 'call_waiter',
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. CUSTOMERS (Guest & Registered CRM)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    total_orders INT DEFAULT 1,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    last_order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    stamps_count INT DEFAULT 0,
    CONSTRAINT uq_rest_customer_phone UNIQUE(restaurant_id, phone)
);

CREATE INDEX idx_customers_rest_phone ON customers(restaurant_id, phone);

-- 19. COUPONS & PROMOTIONS
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_value DECIMAL(10,2) DEFAULT 0.00,
    max_discount DECIMAL(10,2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    usage_count INT DEFAULT 0,
    max_usage INT,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT uq_rest_coupon UNIQUE(restaurant_id, code)
);

-- 20. DIGITAL LOYALTY & REWARDS
CREATE TABLE loyalty_settings (
    restaurant_id UUID PRIMARY KEY REFERENCES restaurants(id) ON DELETE CASCADE,
    min_order_per_stamp DECIMAL(10,2) DEFAULT 250.00,
    target_stamps INT DEFAULT 5,
    reward_description VARCHAR(255) DEFAULT 'Free Beverage or Dessert',
    reward_discount_percent DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE loyalty_stamp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_phone VARCHAR(20) NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    stamps_earned INT DEFAULT 1,
    stamps_redeemed INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE spin_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_phone VARCHAR(20),
    reward_text VARCHAR(150) NOT NULL,
    reward_code VARCHAR(50) NOT NULL,
    is_redeemed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. INVENTORY MANAGEMENT
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    ingredient_name VARCHAR(150) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    current_stock DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    min_threshold DECIMAL(10,2) NOT NULL DEFAULT 5.00,
    cost_per_unit DECIMAL(10,2) DEFAULT 0.00,
    last_restocked TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 22. AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_rest ON audit_logs(restaurant_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- 23. ROW LEVEL SECURITY (RLS) POLICIES EXAMPLE FOR TENANT ISOLATION
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
