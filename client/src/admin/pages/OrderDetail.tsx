import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Printer, MessageSquare, Send, Loader2 } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import StatusBadge from "@/admin/components/StatusBadge";

import { OrderStatus } from "@/store/types";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { formatPesewas } from "@/lib/utils";
import { sendSms, clearSendError } from "@/store/slices/smsSlice";
import {
    fetchOrderById,
    updateOrderStatus,
    toggleUrgent,
    clearMutateError,
} from "@/store/slices/ordersSlice";

import { toast } from "sonner";

const SMS_TEMPLATES = [
  { label: "Order confirmation", text: (name: string, reference: string) => `Hi ${name}, thanks for your order with reference ${reference} ! We're preparing it with love. — Cup O' Cake` },
  { label: "Delivery on the way", text: (name: string, reference: string) => `Hi ${name}, your order with reference ${reference}  is on the way! Please be available to receive it. — Cup O' Cake` },
  { label: "Delivered confirmation", text: (name: string, reference: string) => `Hi ${name}, we hope you enjoy your cake! Order with reference ${reference}. Please rate us. — Cup O' Cake` },
];

const STATUSES: OrderStatus[] = ["pending", "paid", "processing", "delivered", "cancelled"];

const OrderDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentOrder: order, fetchStatus, mutating, mutateError }
    = useAppSelector((state) => state.orders);
    const { sending, sendError } = useAppSelector((state) => state.sms);

  const [smsOpen, setSmsOpen] = useState(false);
  const [smsText, setSmsText] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchOrderById(Number(id)));
  }, [dispatch, id]);

  // Show mutation errors as toasts
  useEffect(() => {
    if (mutateError) {
      toast.error(mutateError);
      dispatch(clearMutateError());
    }
  }, [mutateError, dispatch]);

    // Show SMS send errors
  useEffect(() => {
    if (sendError) {
      toast.error(sendError);
      dispatch(clearSendError());
    }
  }, [sendError, dispatch]);

  if (fetchStatus === 'loading') return (
    <AdminLayout>
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    </AdminLayout>
  );

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

  const setStatus = async (s: OrderStatus) => {
    if (s === order.status) return; // no-op if same status
    try {
      await dispatch(updateOrderStatus({ id: Number(id), status: s })).unwrap();
      toast.success(`Status updated to "${s}"`);
    } catch {
      // error already handled by mutateError effect above
    }
  };

  const handleToggleUrgent = async () => {
    try {
      await dispatch(toggleUrgent(Number(id))).unwrap();
      toast.success(order.is_urgent ? 'Urgent flag removed' : 'Order marked as urgent');
    } catch {
      // error already handled by mutateError effect above
    }
  };

  const handleSendSms = async () => {
    if (!smsText.trim()) return;
    try {
      await dispatch(sendSms({
        order_id: order.id,
        phone: order.customer_phone,
        message: smsText.trim(),
        trigger_type: 'manual',
      })).unwrap();
      toast.success('SMS sent successfully');
      setSmsOpen(false);
      setSmsText("");
    } catch {
      // handled by sendError effect
    }
  };

  return (
    <AdminLayout>
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div id="print-area" className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Order #{order.id}</h1>
            <p className="text-sm text-muted-foreground">
              Placed {new Date(order.created_at).toLocaleString()}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={order.status} />
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                order.status === "paid" 
                  ? "bg-emerald-100 text-emerald-700" 
                  : order.status === "pending" 
                  ? "bg-amber-100 text-amber-700" 
                  : "bg-destructive/10 text-destructive"
              }`}>
                Payment: {order.status}
              </span>
              {order.is_urgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold uppercase text-destructive">
                  <AlertTriangle className="h-3 w-3" /> Urgent
                </span>
              )}
            </div>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <button 
              onClick={handleToggleUrgent}
              disabled={mutating}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary disabled:opacity-60"
            >
              {mutating
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <AlertTriangle className="h-4 w-4" />
              }
              {order.is_urgent ? "Remove urgent" : "Mark urgent"}
            </button>
            <button 
              onClick={() => window.print()} 
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button 
              onClick={() => setSmsOpen(true)} 
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              <MessageSquare className="h-4 w-4" /> Send SMS
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">

            {/* Items */}
            <div className="rounded-2xl bg-card border border-border p-5">
              <h2 className="font-serif text-lg text-foreground">Items</h2>
              <ul className="mt-3 divide-y divide-border">
                {order.items.map((it) => (
                  <li key={it.id} className="flex justify-between gap-4 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {it.quantity} × {it.product_name}
                      </p>
                      {it.size && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Size: <span className="capitalize">{it.size}</span>
                        </p>
                      )}
                      {it.selected_flavors && it.selected_flavors.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Flavors: <span className="capitalize">{it.selected_flavors.join(", ")}</span>
                        </p>
                      )}
                      {it.slot_flavors && it.slot_flavors.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs font-medium text-muted-foreground">Slot Flavors:</p>
                          <ul className="text-xs text-muted-foreground pl-4 list-disc mt-0.5 space-y-0.5">
                            {it.slot_flavors.map((slot, idx: number) => (
                              <li key={idx}>
                                Slot {slot.slot_number}: <span className="capitalize">{slot.flavor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {it.flavor_note && (
                        <p className="text-xs text-rose-600 mt-1.5 italic">
                          Note: "{it.flavor_note}"
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-foreground whitespace-nowrap self-start">
                      {formatPesewas(it.unit_price_pesewas * it.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
                <Row label="Total" value={formatPesewas(order.total_pesewas)} bold />
              </dl>
            </div>

            {/* Status update */}
            <div className="no-print rounded-2xl bg-card border border-border p-5">
              <h2 className="font-serif text-lg text-foreground">Update status</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    disabled={mutating}
                    className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors disabled:opacity-60 ${
                      order.status === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:bg-secondary"
                    }`}
                  >
                    {mutating && order.status !== s ? s : s}
                  </button>
                ))}
              </div>
              {mutating && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Saving…
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-card border border-border p-5">
              <h2 className="font-serif text-lg text-foreground">Customer</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Name" value={order.customer_name} />
                <Row label="Phone" value={order.customer_phone} />
                <Row label="Address" value={order.delivery_address} />
              </dl>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5">
              <h2 className="font-serif text-lg text-foreground">Order info</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <Row
                  label="Delivery date"
                  value={order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : '—'}
                />
                <Row label="Notes" value={order.notes || '—'} />
              </dl>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5">
              <h2 className="font-serif text-lg text-foreground">Payment</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Reference" value={order.reference} />
                <Row label="Amount" value={formatPesewas(order.total_pesewas)} bold />
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Modal */}
        {smsOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4"
          onClick={() => setSmsOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-xl text-foreground">
              Send SMS to {order.customer_name}
            </h3>
            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Templates
              </p>
              <div className="flex flex-wrap gap-2">
                {SMS_TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setSmsText(t.text(order.customer_name, order.reference))}
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
              placeholder="Type custom message…"
              className="input-base mt-4 resize-none w-full"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSmsOpen(false)}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSendSms}
                disabled={sending || !smsText.trim()}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-70"
              >
                {sending
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Send className="h-4 w-4" />
                }
                {sending ? 'Sending…' : 'Send'}
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
    <dd className={`text-right ${bold ? "font-serif text-base font-semibold text-primary" : "text-foreground"}`}>
      {value}
    </dd>
  </div>
);

export default OrderDetail;