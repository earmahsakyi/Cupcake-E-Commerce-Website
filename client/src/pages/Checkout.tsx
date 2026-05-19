import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { formatPesewas } from "@/lib/utils";
import { createOrder, resetOrderState } from "@/store/slices/orderSlices";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { toast } from "@/hooks/use-toast";
import { CreateOrderPayload } from "@/store/types";

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { submitStatus, error } = useAppSelector(state => state.orders);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryDate: "",
    notes: "",
    network: "mtn" as "mtn" | "vod" | "tgo"
  });

  useEffect(() => {
    dispatch(resetOrderState());
  }, [dispatch]);

  const total = subtotal;

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast({ title: "Missing details", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const payload: CreateOrderPayload = {
      customer_name: form.name,
      customer_phone: form.phone,
      delivery_address: form.address,
      momo_network: form.network,
      items: items.map((item) => {
        const base = {
          product_id: Number(item.cakeId),
          quantity: item.quantity,
        };

        // Handle different product types
        if (item.slot_flavors && item.slot_flavors.length > 0) {
          // BOX
          return {
            ...base,
            slot_flavors: item.slot_flavors,
          };
        } 
        else if (item.selected_flavors || item.size) {
          // CUPCAKE
          return {
            ...base,
            size: item.size as 'small' | 'medium' | 'large' | undefined,
            selected_flavors: item.selected_flavors || undefined,
            flavor_note: item.flavor_note || undefined,
          };
        } 
        else {
          // CUSTOM CAKE or others
          return {
            ...base,
            flavor_note: item.flavor_note || undefined,
          };
        }
      }),
    };

    try {
      const result = await dispatch(createOrder(payload)).unwrap();
      clear();
      navigate(`/order-success?id=${result.orderId}&reference=${result.reference}`);
    } catch (err: any) {
      toast({
        title: "Order failed",
        description: err || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

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

        {error && (
          <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

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
              <Field label="Preferred delivery date" required>
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
                placeholder="Anything we should know? (e.g. delivery instructions)"
              />
            </Field>

            <Field label="Mobile Money Network" required>
              <select
                value={form.network}
                onChange={set("network")}
                className="input-base"
                required
              >
                <option value="mtn">MTN Mobile Money</option>
                <option value="vod">Telecel Cash</option>
                <option value="tgo">AirtelTigo Money</option>
              </select>
            </Field>

            <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CreditCard className="h-4 w-4 text-primary" /> Secure Payment
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You will be redirected to complete payment via Mobile Money after placing order.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitStatus === 'loading'}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary text-base font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              <Lock className="h-4 w-4" />
              {submitStatus === 'loading' ? "Processing…" : `Pay Now • ${formatPesewas(total)}`}
            </button>

            {submitStatus === 'loading' && (
              <div className="mt-4 rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground text-center">
                <p className="font-semibold text-foreground">Check your phone 📱</p>
                <p className="mt-1">
                  You should receive a MoMo prompt shortly. Approve it to complete your order.
                </p>
              </div>
            )}
          </motion.form>

          {/* Order Summary */}
          <aside className="h-fit rounded-3xl bg-card p-6 shadow-card lg:sticky lg:top-24">
            <h2 className="font-serif text-xl text-foreground">Order summary</h2>
            <ul className="mt-4 space-y-4">
              {items.map((i) => (
                <li key={i.key} className="flex gap-3">
                  <div className="relative flex-shrink-0">
                    <img src={i.image} alt={i.name} className="h-14 w-14 rounded-xl object-cover" />
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {i.quantity}
                    </span>
                  </div>

                  <div className="flex-1 text-sm">
                    <p className="font-medium text-foreground">{i.name}</p>
                    
                    {/* Display details based on type */}
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      {i.size && <p>Size: {i.size}</p>}
                      {i.selected_flavors && i.selected_flavors.length > 0 && (
                        <p>Flavors: {i.selected_flavors.join(", ")}</p>
                      )}
                      {i.slot_flavors && i.slot_flavors.length > 0 && (
                        <p>Custom box selected</p>
                      )}
                      {i.flavor_note && (
                        <p className="italic text-rose-600">Note: {i.flavor_note}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                    {formatPesewas(i.unitPrice * i.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatPesewas(subtotal)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <dt className="font-serif text-base text-foreground">Total</dt>
                <dd className="font-serif text-xl font-semibold text-primary">
                  {formatPesewas(total)}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
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