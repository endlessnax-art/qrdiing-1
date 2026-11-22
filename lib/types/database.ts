export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "super_admin" | "owner" | "manager" | "staff";

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  category: string;
  logo_url: string | null;
  cover_url: string | null;
  opening_time: string;
  closing_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantMember {
  id: string;
  restaurant_id: string;
  user_id: string;
  role: "owner" | "manager" | "staff";
  created_at: string;
}

export interface Branch {
  id: string;
  restaurant_id: string;
  name: string;
  address: string;
  phone: string | null;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Menu {
  id: string;
  restaurant_id: string;
  branch_id: string | null;
  name: string;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  menu_id: string | null;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  is_veg: boolean;
  is_spicy: boolean;
  is_bestseller: boolean;
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export interface QRCodeRecord {
  id: string;
  restaurant_id: string;
  branch_id: string | null;
  table_number: string | null;
  code_identifier: string;
  target_url: string;
  qr_image_url: string | null;
  scan_count: number;
  is_active: boolean;
  created_at: string;
}

export interface ScanAnalytics {
  id: string;
  restaurant_id: string;
  qr_code_id: string | null;
  table_number: string | null;
  device_type: string | null;
  user_agent: string | null;
  scanned_at: string;
}

export interface UploadedMenuFile {
  id: string;
  restaurant_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  status: "uploaded" | "processing" | "completed" | "failed";
  created_at: string;
}

export interface AIProcessingJob {
  id: string;
  restaurant_id: string;
  file_id: string;
  status: "pending" | "extracting" | "reconstructing" | "approved" | "rejected";
  confidence_score: number | null;
  extracted_data: Json | null;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  max_items: number;
  max_branches: number;
  qr_limit: number;
  ai_conversion_limit: number;
  features: string[];
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  restaurant_id: string;
  plan_id: string;
  status: "active" | "trialing" | "past_due" | "canceled";
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: Restaurant;
        Insert: Partial<Restaurant> & {
          name: string;
          slug: string;
          owner_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
        };
        Update: Partial<Restaurant>;
        Relationships: [];
      };
      restaurant_members: {
        Row: RestaurantMember;
        Insert: Partial<RestaurantMember> & {
          restaurant_id: string;
          user_id: string;
        };
        Update: Partial<RestaurantMember>;
        Relationships: [];
      };
      branches: {
        Row: Branch;
        Insert: Partial<Branch> & {
          restaurant_id: string;
          name: string;
          address: string;
        };
        Update: Partial<Branch>;
        Relationships: [];
      };
      menus: {
        Row: Menu;
        Insert: Partial<Menu> & {
          restaurant_id: string;
          name: string;
        };
        Update: Partial<Menu>;
        Relationships: [];
      };
      categories: {
        Row: MenuCategory;
        Insert: Partial<MenuCategory> & {
          restaurant_id: string;
          name: string;
        };
        Update: Partial<MenuCategory>;
        Relationships: [];
      };
      menu_items: {
        Row: MenuItem;
        Insert: Partial<MenuItem> & {
          restaurant_id: string;
          category_id: string;
          name: string;
          price: number;
        };
        Update: Partial<MenuItem>;
        Relationships: [];
      };
      qr_codes: {
        Row: QRCodeRecord;
        Insert: Partial<QRCodeRecord> & {
          restaurant_id: string;
          code_identifier: string;
          target_url: string;
        };
        Update: Partial<QRCodeRecord>;
        Relationships: [];
      };
      scan_analytics: {
        Row: ScanAnalytics;
        Insert: Partial<ScanAnalytics> & {
          restaurant_id: string;
        };
        Update: Partial<ScanAnalytics>;
        Relationships: [];
      };
      uploaded_menu_files: {
        Row: UploadedMenuFile;
        Insert: Partial<UploadedMenuFile> & {
          restaurant_id: string;
          file_url: string;
          file_name: string;
          file_type: string;
          file_size_bytes: number;
        };
        Update: Partial<UploadedMenuFile>;
        Relationships: [];
      };
      ai_processing_jobs: {
        Row: AIProcessingJob;
        Insert: Partial<AIProcessingJob> & {
          restaurant_id: string;
          file_id: string;
        };
        Update: Partial<AIProcessingJob>;
        Relationships: [];
      };
      subscription_plans: {
        Row: SubscriptionPlan;
        Insert: Partial<SubscriptionPlan> & {
          name: string;
          code: string;
          price_monthly: number;
          price_yearly: number;
        };
        Update: Partial<SubscriptionPlan>;
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription> & {
          restaurant_id: string;
          plan_id: string;
        };
        Update: Partial<Subscription>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_restaurant_member: {
        Args: { target_restaurant_id: string };
        Returns: boolean;
      };
      is_super_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
