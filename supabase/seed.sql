-- =====================================================================
-- QRDine Demo Seed Data
-- Run this in your Supabase SQL Editor after the migration
-- =====================================================================

-- 1. Insert Default Subscription Plans
INSERT INTO public.subscription_plans (name, code, price_monthly, price_yearly, currency, max_items, max_branches, qr_limit, ai_conversion_limit, features)
VALUES 
('Free Starter', 'free', 0.00, 0.00, 'INR', 30, 1, 5, 1, '["Digital QR Menu", "Up to 30 items", "5 Table QR Codes", "Basic Analytics", "1 AI Menu Scan"]'::jsonb),
('Pro Restaurant', 'pro', 1499.00, 14990.00, 'INR', 150, 3, 50, 10, '["Digital QR Menu", "Up to 150 items", "50 Table QR Codes", "Multi-Branch Support", "Advanced Analytics", "10 AI Menu Scans", "Custom Branding"]'::jsonb),
('Enterprise Elite', 'enterprise', 3999.00, 39990.00, 'INR', 1000, 15, 200, 50, '["Unlimited Menu Items", "15 Branches", "Unlimited QR Codes", "Priority AI Processing", "Dedicated Account Manager", "Custom Domain Support"]'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Sample Restaurant: The Royal Plate
INSERT INTO public.restaurants (
    id, slug, name, tagline, owner_name, phone, email, address, city, country, category, logo_url, is_active
) VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'the-royal-plate',
    'The Royal Plate',
    'Authentic Royal Dining & Mughlai Delicacies',
    'Chef Vikram Rathore',
    '+91 98765 43210',
    'contact@royalplate.com',
    'Plot 42, Jubilee Hills, Road No. 36',
    'Hyderabad',
    'India',
    'Fine Dining',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80',
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Main Menu
INSERT INTO public.menus (id, restaurant_id, name, is_active, is_published)
VALUES (
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Main Dining Menu',
    TRUE,
    TRUE
) ON CONFLICT DO NOTHING;

-- 4. Insert Categories
INSERT INTO public.categories (id, restaurant_id, menu_id, name, description, sort_order)
VALUES 
('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Royal Starters', 'Crispy appetizers and charcoal grilled skewers', 1),
('c2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Tandoor & Clay Oven', 'Slow-cooked kebabs infused with aromatic spices', 2),
('c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Main Course', 'Rich curries and slow-simmered gravies', 3),
('c4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Biryani & Rice', 'Fragrant long-grain basmati with aged saffron', 4),
('c5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Desserts & Drinks', 'Traditional sweet conclusions and refreshing mocktails', 5)
ON CONFLICT DO NOTHING;

-- 5. Insert Menu Items
INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_veg, is_spicy, is_bestseller, is_available, sort_order)
VALUES
-- Starters
('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Crispy Corn & Water Chestnut', 'Golden fried corn tossed with scallions and crushed black pepper', 280.00, TRUE, FALSE, TRUE, TRUE, 1),
('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Galouti Kebab', 'Melt-in-mouth smoked lamb patties infused with 32 royal spices', 480.00, FALSE, TRUE, TRUE, TRUE, 2),
('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Paneer Kurkure Tikka', 'Panko crusted cottage cheese cubes with mint emulsion', 320.00, TRUE, FALSE, FALSE, TRUE, 3),

-- Tandoor
('a1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'Bhatti Da Murgh', 'Charcoal-roasted spring chicken steeped in hung curd and red chilies', 460.00, FALSE, TRUE, TRUE, TRUE, 1),
('a1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'Tandoori Soya Chaap', 'Marinated plant protein skewer smoked with ajwain and kasoori methi', 340.00, TRUE, FALSE, FALSE, TRUE, 2),

-- Main Course
('a1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'Dal Makhani Bukhara', 'Overnight simmered black lentils finished with cultured butter and cream', 360.00, TRUE, FALSE, TRUE, TRUE, 1),
('a1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'Butter Chicken Aslam Style', 'Tandoor pulled chicken tossed in velvety satin tomato sauce', 490.00, FALSE, FALSE, TRUE, TRUE, 2),
('a1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'Paneer Lababdar', 'Cottage cheese chunks cooked in spiced onion-tomato gravy with grated paneer', 390.00, TRUE, TRUE, FALSE, TRUE, 3),

-- Biryani
('a1111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', 'Hyderabadi Dum Gosht Biryani', 'Aged basmati rice sealed with tender mutton cuts, mint, and saffron milk', 540.00, FALSE, TRUE, TRUE, TRUE, 1),
('a1111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', 'Subz Dum Biryani', 'Farm vegetables and aromatic spices slow cooked under puff pastry seal', 380.00, TRUE, FALSE, FALSE, TRUE, 2),

-- Desserts & Drinks
('a1111111-1111-1111-1111-111111111111', 'c5555555-5555-5555-5555-555555555555', 'Shahi Tukda with Rabdi', 'Ghee crisped milk bread soaked in saffron syrup topped with thick pistachio rabdi', 220.00, TRUE, FALSE, TRUE, TRUE, 1),
('a1111111-1111-1111-1111-111111111111', 'c5555555-5555-5555-5555-555555555555', 'Kesariya Thandai', 'Chilled spiced milk drink with crushed almonds, rose petals, and cardamom', 180.00, TRUE, FALSE, FALSE, TRUE, 2);

-- 6. Insert Default QR Codes
INSERT INTO public.qr_codes (restaurant_id, table_number, code_identifier, target_url, is_active)
VALUES 
('a1111111-1111-1111-1111-111111111111', '01', 'TRP-T01', 'https://qrdine.vercel.app/menu/the-royal-plate?table=01', TRUE),
('a1111111-1111-1111-1111-111111111111', '02', 'TRP-T02', 'https://qrdine.vercel.app/menu/the-royal-plate?table=02', TRUE),
('a1111111-1111-1111-1111-111111111111', '05', 'TRP-T05', 'https://qrdine.vercel.app/menu/the-royal-plate?table=05', TRUE)
ON CONFLICT (code_identifier) DO NOTHING;
