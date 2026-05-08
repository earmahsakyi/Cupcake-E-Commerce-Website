import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Printer, MessageSquare, Send } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import { ordersStore, smsStore } from "@/admin/store";
import { useStore } from "@/admin/useStore";
import { formatGHS } from "@/data/cakes";
import StatusBadge from "@/admin/components/StatusBadge";
import { OrderStatus } from "@/admin/types";
import { toast } from "sonner";

const SMS_TEMPLATES = [
  { label: "Order confirmation", text: (name: string, id: string) => `Hi ${name}, thanks for your order ${id}! We're preparing it with love. — Sweet Crumbs` },
  { label: "Delivery on the way", text: (name: string, id: string) => `Hi ${name}, your order ${id} is on the way! Please be available to receive it. — Sweet Crumbs` },
  { label: "Delivered confirmation", text: (name: string, id: string) => `Hi ${name}, we hope you enjoy your cake! Order ${id}. Please rate us. — Sweet Crumbs` },
];

const STATUSES: OrderStatus[] = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const OrderDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const orders = useStore(ordersStore);
  const order = useMemo(() => orders.find((o) => o.id === id), [orders, id]);

  const [smsOpen, setSmsOpen] = useState(false);
  const [smsText, setSmsText] = useState("");

  if (!order) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground">Order not found.</p>
        <Link to="/admin/orders" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
      </AdminLayout>
    );
  }

  const setStatus = (s: OrderStatus) => {
    ordersStore.setStatus(order.id, s);
    toast.success(`Status updated to ${s}`);
  };

  const toggleUrgent = () => {
    ordersStore.update(order.id, { urgent: !order.urgent });
    toast.success(order.urgent ? "Urgent flag removed" : "Marked as urgent");
  };

  const sendSms = (text: string) => {
    if (!text.trim()) return;
    smsStore.add({ orderId: order.id, phone: order.customer.phone, message: text, trigger: "manual" });
    toast.success(`SMS sent to ${order.customer.phone}`);
    setSmsOpen(false);
    setSmsText("");
  };

  return (
    <AdminLayout>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div id="print-area" className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Order {order.id}</h1>
            <p className="text-sm text-muted-foreground">
              Placed {new Date(order.createdAt).toLocaleString()}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={order.status} />
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : order.paymentStatus === "pending" ? "bg-amber-100 text-amber-700" : "bg-destructive/10 text-destructive"}`}>
                Payment: {order.paymentStatus}
              </span>
              {order.urgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold uppercase text-destructive">
                  <AlertTriangle className="h-3 w-3" /> Urgent
                </span>
              )}
            </div>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            <button onClick={toggleUrgent} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary">
              <AlertTriangle className="h-4 w-4" /> {order.urgent ? "Remove urgent" : "Mark urgent"}
            </button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button onClick={() => setSmsOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft">
              <MessageSquare className="h-4 w-4" /> Send SMS
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-card border border-border p-5">
              <h2 className="font-serif text-lg text-foreground">Items</h2>
              <ul className="mt-3 divide-y divide-border">
                {order.items.map((it) => (
                  <li key={it.key} className="flex items-center gap-3 py-3">
                    {it.image && <img src={it.image} alt={it.name} className="h-14 w-14 rounded-xl object-cover" />}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{it.quantity} × {it.name}</p>
                      <p className="text-xs text-muted-foreground">{[it.size, it.flavor].filter(Boolean).join(" • ")}</p>
                      {it.message && <p className="mt-1 text-xs italic text-primary">“{it.message}”</p>}
                    </div>
                    <p className="font-semibold text-foreground">{formatGHS(it.unitPrice * it.quantity)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
                <Row label="Subtotal" value={formatGHS(order.subtotal)} />
                <Row label="Delivery" value={formatGHS(order.delivery)} />
                <Row label="Total" value={formatGHS(order.total)} bold />
              </dl>
            </div>

            <div className="no-print rounded-2xl bg-card border border-border p-5">
              <h2 className="font-serif text-lg text-foreground">Update status</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                      order.status === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:bg-secondary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-card border border-border p-5">
              <h2 className="font-serif text-lg text-foreground">Customer</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Name" value={order.customer.name} />
                <Row label="Phone" value={order.customer.phone} />
                <Row label="Address" value={order.customer.address} />
                <Row label="Delivery date" value={order.customer.deliveryDate} />
                {order.customer.notes && <Row label="Notes" value={order.customer.notes} />}
              </dl>
            </div>
            <div className="rounded-2xl bg-card border border-border p-5">
              <h2 className="font-serif text-lg text-foreground">Payment</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Status" value={order.paymentStatus} />
                <Row label="Reference" value={order.paymentRef} />
                <Row label="Amount" value={formatGHS(order.total)} bold />
              </dl>
            </div>
          </div>
        </div>
      </div>

      {smsOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setSmsOpen(false)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-foreground">Send SMS to {order.customer.name}</h3>
            <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Templates</p>
              <div className="flex flex-wrap gap-2">
                {SMS_TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setSmsText(t.text(order.customer.name, order.id))}
                    className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              rows={4}
              maxLength={300}
              placeholder="Type a message…"
              className="input-base mt-4 resize-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setSmsOpen(false)} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary">Cancel</button>
              <button onClick={() => sendSms(smsText)} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft">
                <Send className="h-4 w-4" /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const Row = ({ label, value, bold }: { label: string; value: React.ReactNode; bold?: boolean }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className={`text-right ${bold ? "font-serif text-base font-semibold text-primary" : "text-foreground"}`}>{value}</dd>
  </div>
);

export default OrderDetail;
