export type UserRole = "super_admin" | "restaurant_admin" | "kitchen_staff" | "waiter_staff" | "customer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  restaurantId?: string; // Tenant isolation key (null for super_admin)
  pin?: string; // 4-digit fast pin for waiter/kitchen
  avatarUrl?: string;
  createdAt: string;
}

export type RestaurantCategory = "Fine Dining" | "Casual Dining" | "Café & Bakery" | "Fast Food" | "Cloud Kitchen" | "Bar & Pub" | "Biryani & Arabic";

export interface RestaurantSubscription {
  planId: "free_trial" | "starter" | "growth" | "enterprise";
  planName: string;
  status: "active" | "trial" | "expired" | "pending_payment";
  startDate: string;
  endDate: string;
  monthlyPrice: number;
  menuItemLimit: number; // Base allowed items
  purchasedAddonItems: number; // Extra bought packages
  totalAllowedItems: number; // Limit + purchased
  staffLimit: number;
  tableLimit: number;
  features: string[];
}

export interface RestaurantSettings {
  currency: string; // "INR"
  taxRatePercent: number; // e.g. 5% GST
  taxGstin?: string;
  serviceChargePercent: number;
  upiVpa?: string; // e.g. "arabian.delight@okicici"
  upiName?: string;
  razorpayKeyId?: string;
  autoAcceptOrders: boolean;
  enableTakeaway: boolean;
  enableDineIn: boolean;
  enableLoyaltyStamp: boolean;
  enableSpinToWin: boolean;
  primaryColor: string;
  secondaryColor: string;
}

export interface Restaurant {
  id: string;
  slug: string; // e.g. "arabian-delight"
  name: string;
  tagline: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  category: RestaurantCategory;
  logo: string;
  coverImage: string;
  openingTime: string;
  closingTime: string;
  isVerified: boolean;
  isActive: boolean;
  subscription: RestaurantSubscription;
  settings: RestaurantSettings;
  createdAt: string;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  nameHi?: string;
  nameTe?: string;
  nameUr?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FoodVariant {
  id: string;
  name: string; // e.g. "Half", "Full", "Small", "Large"
  price: number;
}

export interface FoodAddon {
  id: string;
  name: string; // e.g. "Extra Garlic Mayo", "Extra Cheese"
  price: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  nameHi?: string; // Hindi
  nameTe?: string; // Telugu
  nameUr?: string; // Urdu
  description: string;
  descriptionHi?: string;
  descriptionTe?: string;
  descriptionUr?: string;
  basePrice: number;
  image: string;
  isVeg: boolean;
  isBestseller: boolean;
  isAvailable: boolean; // In Stock or Sold Out
  variants?: FoodVariant[];
  addons?: FoodAddon[];
  preparationTimeMinutes: number;
  sortOrder: number;
}

export type TableStatus = "available" | "occupied" | "order_pending" | "preparing" | "ready" | "bill_requested";

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  tableNumber: string; // e.g. "01", "02", "T-05"
  tableName?: string; // e.g. "VIP Booth 1", "Rooftop 3"
  location?: string; // e.g. "Main Dining", "Rooftop", "AC Cabin", "Patio"
  capacity: number;
  status: TableStatus;
  qrToken: string; // Secure cryptographic token embedded in QR
  destinationUrl?: string; // Full target URL encoded in QR
  isActive?: boolean; // Whether table QR code is active and accepting orders
  activeOrderId?: string;
  assignedWaiterId?: string;
  assignedWaiterName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  selectedVariant?: FoodVariant;
  selectedAddons?: FoodAddon[];
  specialInstructions?: string;
  totalPrice: number;
}

export type OrderStatus = "new" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";
export type OrderType = "dine_in" | "takeaway";
export type PaymentMethod = "cash" | "upi" | "razorpay_online";
export type PaymentStatus = "pending" | "paid" | "refunded";

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  orderNumber: string; // e.g. "#AD-1042"
  orderType: OrderType;
  tableNumber?: string;
  tableName?: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number; // GST 5%
  serviceCharge: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  cancellationReason?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryMinutes?: number;
}

export interface WaiterCall {
  id: string;
  restaurantId: string;
  tableNumber: string;
  type: "call_waiter" | "bill_request" | "water_request" | "cutlery_request";
  status: "pending" | "acknowledged" | "resolved";
  createdAt: string;
}

export interface Coupon {
  id: string;
  restaurantId: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number; // e.g. 20 for 20% or 100 for ₹100
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  maxUsage?: number;
  isActive: boolean;
}

export interface LoyaltyStampCard {
  restaurantId: string;
  minOrderPerStamp: number; // e.g. ₹250
  targetStamps: number; // e.g. 5
  rewardDescription: string; // e.g. "Free Dessert or Arabian Mocktail"
  rewardDiscountPercent?: number;
  isActive: boolean;
}

export interface Customer {
  id: string;
  restaurantId: string;
  phone: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  stampsCount: number;
  availableRewards: string[];
}

export interface InventoryItem {
  id: string;
  restaurantId: string;
  ingredientName: string;
  unit: "kg" | "g" | "litres" | "ml" | "pieces";
  currentStock: number;
  minThreshold: number; // Low stock alert trigger
  costPerUnit: number;
  lastRestocked: string;
}

export interface PlatformSubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  menuItemLimit: number;
  tableLimit: number;
  staffLimit: number;
  features: string[];
  isPopular?: boolean;
}

export interface MenuItemPackage {
  id: string;
  itemCount: number; // e.g. 10 or 20
  price: number; // e.g. ₹299 or ₹499
  description: string;
}

export interface AuditLog {
  id: string;
  restaurantId?: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}
