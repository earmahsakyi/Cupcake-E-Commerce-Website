import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/data/cakes";
import { toast } from "@/hooks/use-toast";
import { ordersStore, paymentsStore, smsStore } from "@/admin/store";
import { AdminOrder } from "@/admin/types";

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryDate: "",
    notes: "",
  });

  const delivery = items.length ? 30 : 0;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="container pt-32 text-center">
          <h1 className="font-serif text-3xl text-foreground">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Add some cakes before checking out.</p>
          <Link
            to="/#cakes"
            className="mt-6 mb-6 inline-block rounded-full bg-gradient-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            Browse cakes
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.deliveryDate) {
      toast({ title: "Missing details", description: "Please fill out all required fields.", variant: "destructive" });
      return;
    }
    if (!/^[+\d\s-]{7,20}$/.test(form.phone)) {
      toast({ title: "Invalid phone", description: "Please enter a valid phone number.", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    // Paystack-ready placeholder. Replace with Paystack popup integration later.
    setTimeout(() => {
      const orderId = "SC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const paymentRef = "PSK_" + Math.random().toString(36).slice(2, 12).toUpperCase();
      const createdAt = new Date().toISOString();

      const adminOrder: AdminOrder = {
        id: orderId,
        createdAt,
        customer: { ...form },
        items: items.map((i) => ({
          key: i.key,
          cakeId: i.cakeId,
          name: i.name,
          image: i.image,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          size: i.size,
          flavor: i.flavor,
          message: i.message,
        })),
        subtotal,
        delivery,
        total,
        status: "Pending",
        paymentStatus: "paid",
        paymentRef,
      };

      // Persist to admin store
      ordersStore.add(adminOrder);
      paymentsStore.add({
        id: "PAY-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        orderId,
        amount: adminOrder.total,
        status: "paid",
        reference: paymentRef,
        createdAt,
      });
      // Auto SMS on payment
      smsStore.add({
        orderId,
        phone: form.phone,
        message: `Hi ${form.name}, we received your payment for order ${orderId}. We're getting it ready! — Sweet Crumbs`,
        trigger: "payment",
      });

      const order = { id: orderId, items, subtotal, delivery, total, customer: form, createdAt };
      try {
        sessionStorage.setItem("sweet-crumbs-last-order", JSON.stringify(order));
      } catch {
        /* ignore */
      }
      clear();
      setSubmitting(false);
      navigate("/order-success");
    }, 900);
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container pt-24 sm:pt-28">
        <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-foreground sm:text-4xl">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl bg-card p-6 shadow-card sm:p-8"
          >
            <h2 className="font-serif text-xl text-foreground">Delivery details</h2>

            <Field label="Full name" required>
              <input
                type="text"
                required
                value={form.name}
                onChange={set("name")}
                maxLength={80}
                className="input-base"
                placeholder="Ama Mensah"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone number" required>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={set("phone")}
                  maxLength={20}
                  className="input-base"
                  placeholder="+233 24 000 0000"
                />
              </Field>
              <Field label="Delivery date" required>
                <input
                  type="date"
                  required
                  min={minDate}
                  value={form.deliveryDate}
                  onChange={set("deliveryDate")}
                  className="input-base"
                />
              </Field>
            </div>

            <Field label="Delivery address" required>
              <textarea
                required
                value={form.address}
                onChange={set("address")}
                maxLength={250}
                rows={3}
                className="input-base resize-none"
                placeholder="House number, street, area, city"
              />
            </Field>

            <Field label="Order notes (optional)">
              <textarea
                value={form.notes}
                onChange={set("notes")}
                maxLength={300}
                rows={2}
                className="input-base resize-none"
                placeholder="Anything we should know?"
              />
            </Field>

            <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CreditCard className="h-4 w-4 text-primary" /> Payment
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Secure payments powered by Paystack. Pay with card, mobile money, or bank transfer at checkout.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary text-base font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              <Lock className="h-4 w-4" />
              {submitting ? "Processing…" : `Pay Now • ${formatGHS(total)}`}
            </button>
          </motion.form>

          <aside className="h-fit rounded-3xl bg-card p-6 shadow-card lg:sticky lg:top-24">
            <h2 className="font-serif text-xl text-foreground">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map((i) => (
                <li key={i.key} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={i.image} alt={i.name} className="h-14 w-14 rounded-xl object-cover" />
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {i.quantity}
                    </span>
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-foreground">{i.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[i.size, i.flavor].filter(Boolean).join(" • ")}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatGHS(i.unitPrice * i.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold text-foreground">{formatGHS(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="font-semibold text-foreground">{formatGHS(delivery)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <dt className="font-serif text-base text-foreground">Total</dt>
                <dd className="font-serif text-xl font-semibold text-primary">{formatGHS(total)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
      <div className="mt-20" />
      <Footer />
    </main>
  );
};

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-foreground">
      {label} {required && <span className="text-primary">*</span>}
    </span>
    {children}
  </label>
);

export default Checkout;
