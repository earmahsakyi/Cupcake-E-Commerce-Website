import { AdminOrder, AdminPayment, AdminProduct, AdminUser, SmsLogEntry, OrderStatus } from "./types";
import { cakes } from "@/data/cakes";

// ===== Generic localStorage helpers =====
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore */
  }
}

// ===== Keys =====
const K = {
  orders: "sc-admin-orders-v1",
  products: "sc-admin-products-v1",
  payments: "sc-admin-payments-v1",
  sms: "sc-admin-sms-v1",
  users: "sc-admin-users-v1",
  session: "sc-admin-session-v1",
  otps: "sc-admin-otps-v1",
};

export const ADMIN_SECRET_KEY = "SWEET2025";

// ===== Subscribe (cross-tab + same-tab events) =====
type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
function emit(key: string) {
  listeners.get(key)?.forEach((l) => l());
}
export function subscribe(key: string, fn: Listener) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) fn();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.get(key)?.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

// ===== Seed products from public catalog (one-time) =====
function seedProducts(): AdminProduct[] {
  return cakes.map((c) => ({
    id: c.id,
    name: c.name,
    price: c.price,
    description: c.description,
    images: c.images,
    active: true,
  }));
}

function seedOrders(): AdminOrder[] {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  return [
    {
      id: "SC-DEMO01",
      createdAt: new Date(today.getTime() - 3600_000).toISOString(),
      customer: {
        name: "Ama Mensah",
        phone: "+233 24 555 0101",
        address: "12 Oxford St, Osu, Accra",
        deliveryDate: tomorrow.toISOString().slice(0, 10),
        notes: "Please add 'Happy Birthday Kwame' on the cake.",
      },
      items: [
        { key: "1|", cakeId: "1", name: "Vanilla Bliss Cupcake", quantity: 12, unitPrice: 15, size: "Box of 12" },
      ],
      subtotal: 180,
      delivery: 30,
      total: 210,
      status: "Pending",
      urgent: true,
      paymentStatus: "paid",
      paymentRef: "PSK_DEMO_001",
    },
    {
      id: "SC-DEMO02",
      createdAt: new Date(today.getTime() - 7200_000).toISOString(),
      customer: {
        name: "Kojo Asante",
        phone: "+233 20 555 0202",
        address: "5 Cantonments Rd, Accra",
        deliveryDate: today.toISOString().slice(0, 10),
      },
      items: [{ key: "3|", cakeId: "3", name: "Classic Red Velvet", quantity: 1, unitPrice: 280, size: '6"' }],
      subtotal: 280,
      delivery: 30,
      total: 310,
      status: "Out for Delivery",
      paymentStatus: "paid",
      paymentRef: "PSK_DEMO_002",
    },
  ];
}

// ===== Orders =====
export const ordersStore = {
  all(): AdminOrder[] {
    let list = read<AdminOrder[]>(K.orders, []);
    if (list.length === 0 && !localStorage.getItem(K.orders + ":seeded")) {
      list = seedOrders();
      write(K.orders, list);
      localStorage.setItem(K.orders + ":seeded", "1");
    }
    return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
  get(id: string) {
    return this.all().find((o) => o.id === id);
  },
  add(order: AdminOrder) {
    const list = read<AdminOrder[]>(K.orders, []);
    list.unshift(order);
    write(K.orders, list);
    emit(K.orders);
  },
  update(id: string, patch: Partial<AdminOrder>) {
    const list = read<AdminOrder[]>(K.orders, []);
    const next = list.map((o) => (o.id === id ? { ...o, ...patch } : o));
    write(K.orders, next);
    emit(K.orders);
  },
  setStatus(id: string, status: OrderStatus) {
    this.update(id, { status });
    if (status === "Out for Delivery") {
      const o = this.get(id);
      if (o) smsStore.add({
        orderId: id,
        phone: o.customer.phone,
        message: `Hi ${o.customer.name}, your Sweet Crumbs order ${id} is out for delivery!`,
        trigger: "out_for_delivery",
      });
    }
  },
  subscribe(fn: Listener) {
    return subscribe(K.orders, fn);
  },
  key: K.orders,
};

// ===== Products =====
export const productsStore = {
  all(): AdminProduct[] {
    let list = read<AdminProduct[]>(K.products, []);
    if (list.length === 0 && !localStorage.getItem(K.products + ":seeded")) {
      list = seedProducts();
      write(K.products, list);
      localStorage.setItem(K.products + ":seeded", "1");
    }
    return list;
  },
  add(p: AdminProduct) {
    const list = this.all();
    list.push(p);
    write(K.products, list);
    emit(K.products);
  },
  update(id: string, patch: Partial<AdminProduct>) {
    const list = this.all().map((p) => (p.id === id ? { ...p, ...patch } : p));
    write(K.products, list);
    emit(K.products);
  },
  remove(id: string) {
    write(K.products, this.all().filter((p) => p.id !== id));
    emit(K.products);
  },
  subscribe(fn: Listener) {
    return subscribe(K.products, fn);
  },
};

// ===== Payments =====
export const paymentsStore = {
  all(): AdminPayment[] {
    return read<AdminPayment[]>(K.payments, []).sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );
  },
  add(p: AdminPayment) {
    const list = read<AdminPayment[]>(K.payments, []);
    list.push(p);
    write(K.payments, list);
    emit(K.payments);
  },
  subscribe(fn: Listener) {
    return subscribe(K.payments, fn);
  },
};

// ===== SMS Log =====
export const smsStore = {
  all(): SmsLogEntry[] {
    return read<SmsLogEntry[]>(K.sms, []).sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );
  },
  add(entry: Omit<SmsLogEntry, "id" | "createdAt">) {
    const list = read<SmsLogEntry[]>(K.sms, []);
    const full: SmsLogEntry = {
      ...entry,
      id: "SMS-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    list.push(full);
    write(K.sms, list);
    emit(K.sms);
    return full;
  },
  subscribe(fn: Listener) {
    return subscribe(K.sms, fn);
  },
};

// ===== Users / Auth =====
const hash = (s: string) => btoa(unescape(encodeURIComponent(s)));

export const usersStore = {
  all(): AdminUser[] {
    return read<AdminUser[]>(K.users, []);
  },
  byEmail(email: string) {
    return this.all().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  add(u: AdminUser) {
    const list = this.all();
    list.push(u);
    write(K.users, list);
  },
  update(email: string, patch: Partial<AdminUser>) {
    const list = this.all().map((u) =>
      u.email.toLowerCase() === email.toLowerCase() ? { ...u, ...patch } : u,
    );
    write(K.users, list);
  },
};

export type Session = { email: string; name: string } | null;

export const sessionStore = {
  get(): Session {
    return read<Session>(K.session, null);
  },
  set(s: Session) {
    write(K.session, s);
    emit(K.session);
  },
  clear() {
    localStorage.removeItem(K.session);
    emit(K.session);
  },
  subscribe(fn: Listener) {
    return subscribe(K.session, fn);
  },
};

// ===== OTP store (mock — stores codes in localStorage so reset/unlock pages can read them) =====
type OtpMap = Record<string, string>;
export const otpStore = {
  all(): OtpMap {
    return read<OtpMap>(K.otps, {});
  },
  generate(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const map = this.all();
    map[email.toLowerCase()] = code;
    write(K.otps, map);
    return code;
  },
  verify(email: string, code: string) {
    return this.all()[email.toLowerCase()] === code;
  },
  clear(email: string) {
    const map = this.all();
    delete map[email.toLowerCase()];
    write(K.otps, map);
  },
};

// ===== Auth API =====
export const auth = {
  signup(name: string, email: string, password: string, secret: string) {
    if (secret !== ADMIN_SECRET_KEY) throw new Error("Invalid admin secret key.");
    if (usersStore.byEmail(email)) throw new Error("An account with this email already exists.");
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");
    usersStore.add({
      id: "U-" + Math.random().toString(36).slice(2, 8),
      name,
      email,
      passwordHash: hash(password),
      locked: false,
      failedAttempts: 0,
    });
    sessionStore.set({ email, name });
  },
  login(email: string, password: string) {
    const u = usersStore.byEmail(email);
    if (!u) throw new Error("No account found with this email.");
    if (u.locked) {
      const err = new Error("Account locked.");
      (err as any).code = "LOCKED";
      throw err;
    }
    if (u.passwordHash !== hash(password)) {
      const attempts = (u.failedAttempts || 0) + 1;
      const locked = attempts >= 5;
      usersStore.update(email, { failedAttempts: attempts, locked });
      if (locked) {
        const err = new Error("Account locked after 5 failed attempts.");
        (err as any).code = "LOCKED";
        throw err;
      }
      throw new Error(`Invalid credentials. ${5 - attempts} attempts remaining.`);
    }
    usersStore.update(email, { failedAttempts: 0 });
    sessionStore.set({ email: u.email, name: u.name });
  },
  logout() {
    sessionStore.clear();
  },
  resetPassword(email: string, otp: string, newPassword: string) {
    const u = usersStore.byEmail(email);
    if (!u) throw new Error("No account found with this email.");
    if (!otpStore.verify(email, otp)) throw new Error("Invalid OTP code.");
    if (newPassword.length < 6) throw new Error("Password must be at least 6 characters.");
    usersStore.update(email, { passwordHash: hash(newPassword), failedAttempts: 0 });
    otpStore.clear(email);
  },
  unlockAccount(email: string, otp: string, secret: string) {
    const u = usersStore.byEmail(email);
    if (!u) throw new Error("No account found with this email.");
    if (secret !== ADMIN_SECRET_KEY) throw new Error("Invalid admin secret key.");
    if (!otpStore.verify(email, otp)) throw new Error("Invalid OTP code.");
    usersStore.update(email, { locked: false, failedAttempts: 0 });
    otpStore.clear(email);
  },
};
