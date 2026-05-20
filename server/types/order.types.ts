// what comes from the database

export interface OrderRow {
    id: number;
    reference: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    total_pesewas: number;
    status: 'pending' | 'paid' | 'processing' | 'delivered' | 'cancelled';
    is_urgent: boolean;
    created_at: Date;
    notes?: string | null;
    delivery_date?: Date | null;
}

export interface OrderItemRow {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    unit_price_pesewas: number;
    size: 'small' | 'medium' | 'large' | null;
    flavor_note: string | null;
    selected_flavors: string[] | null;
}

export interface PaymentRow {
    id: number;
    order_id: number;
    paystack_reference: string;
    amount_pesewas: number;
    momo_network: 'mtn' | 'vod'  | 'tgo';
    phone: string;
    status: 'pending' | 'success' | 'failed';
    paid_at: Date | null;
}

// what the API sends to the frontend
export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price_pesewas: number;
    size: 'small' | 'medium' | 'large' | null;
    flavor_note: string | null;
    selected_flavors: string[] | null;
}

export interface Order {
    id: number;
    reference: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    total_pesewas: number;
    status: 'pending' | 'paid' | 'processing' | 'delivered' | 'cancelled';
    is_urgent: boolean;
    items: OrderItem[];
    created_at: Date;
    notes?: string | null;
    delivery_date?: Date | null;
}

// what comes in from the customer placing an order
export interface CartItem {
    product_id: number;
    quantity: number;
    size?: 'small' | 'medium' | 'large';
    selected_flavors?: string[];
    flavor_note?: string;
    slot_flavors?: { slot_number: number; flavor: string }[];
}
export interface SubmitOtpBody {
  otp: string;
  reference: string;
}
export interface CreateOrderBody {
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    momo_network: 'mtn' | 'tgo' | 'vod';
    notes?: string | null;
    delivery_date?: Date | null;
    items: CartItem[];
}

export interface TransactionRow {
    id: number;
    type: 'revenue' | 'expense';
    amount_pesewas: number;
    description: string;
    source: 'order' | 'manual';
    order_id: number | null;
    recorded_at: Date;
}

// what comes in from admin for manual entry
export interface CreateTransactionBody {
    type: 'revenue' | 'expense';
    amount_pesewas: number;
    description: string;
}