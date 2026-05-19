// ─── Product types 
export interface ProductVariant {
  size: "small" | "medium" | "large";
  price_pesewas: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  short_desc: string;
  description: string;
  product_type: "cupcake" | "box" | "custom_cake" | "other";
  images: string[];
  flavors: string[];
  variants: ProductVariant[];
  box_slot_count: number | null;
  box_price_pesewas: number | null;
  is_active: boolean;
}

// ─── Order types 
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price_pesewas: number;
  size: "small" | "medium" | "large" | null;
  flavor_note: string | null;
  selected_flavors: string[] | null;
  slot_flavors?: { slot_number: number; flavor: string }[] | null;
}

export interface Order {
  id: number;
  reference: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total_pesewas: number;
  status: OrderStatus;
  is_urgent: boolean;
  items: OrderItem[];
  created_at: string;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  momo_network: "mtn" | "telecel" | "vodafone" | "airteltigo";
  items: CartItemPayload[];
}

export interface CartItemPayload {
  product_id: number;
  quantity: number;
  size?: "small" | "medium" | "large";
  selected_flavors?: string[];
  flavor_note?: string;
  slot_flavors?: { slot_number: number; flavor: string }[];
}

// ─── Admin auth types
export interface AdminUser {
  name: string;
  email: string;
  role: string;
}