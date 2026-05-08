export type OrderStatus = "Pending" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
export type PaymentStatus = "paid" | "pending" | "failed";

export type AdminOrderItem = {
  key: string;
  cakeId: string;
  name: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  flavor?: string;
  message?: string;
};

export type AdminOrder = {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; address: string; deliveryDate: string; notes?: string };
  items: AdminOrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  status: OrderStatus;
  urgent?: boolean;
  paymentStatus: PaymentStatus;
  paymentRef: string;
};

export type AdminProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  active: boolean;
};

export type AdminPayment = {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  reference: string;
  createdAt: string;
};

export type SmsLogEntry = {
  id: string;
  orderId: string;
  phone: string;
  message: string;
  trigger: "manual" | "payment" | "out_for_delivery";
  createdAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // mock: plain b64
  locked: boolean;
  failedAttempts: number;
};
