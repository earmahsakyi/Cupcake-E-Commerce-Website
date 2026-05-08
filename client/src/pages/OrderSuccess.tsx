import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, PartyPopper } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatGHS } from "@/data/cakes";

type Order = {
  id: string;
  items: { key: string; name: string; quantity: number; unitPrice: number; size?: string; flavor?: string }[];
  subtotal: number;
  delivery: number;
  total: number;
  customer: { name: string; phone: string; address: string; deliveryDate: string };
};

const OrderSuccess = () => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    document.title = "Order Confirmed | Sweet Crumbs Ghana";
    try {
      const raw = sessionStorage.getItem("sweet-crumbs-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl rounded-3xl bg-card p-8 text-center shadow-card sm:p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft"
          >
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="mt-6 font-serif text-3xl text-foreground sm:text-4xl">
            Thank you! <PartyPopper className="inline h-7 w-7 text-primary" />
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your order has been received. We'll be in touch shortly to confirm the details.
          </p>

          {order && (
            <>
              <div className="mt-6 inline-flex flex-col items-center rounded-2xl bg-secondary/60 px-6 py-3">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Order ID</span>
                <span className="font-serif text-2xl font-semibold text-foreground">{order.id}</span>
              </div>

              <div className="mt-8 text-left">
                <h2 className="font-serif text-lg text-foreground">Summary</h2>
                <ul className="mt-3 divide-y divide-border rounded-2xl border border-border">
                  {order.items.map((i) => (
                    <li key={i.key} className="flex items-center justify-between p-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground">
                          {i.quantity} × {i.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {[i.size, i.flavor].filter(Boolean).join(" • ")}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">{formatGHS(i.unitPrice * i.quantity)}</p>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="text-foreground">{formatGHS(order.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="text-foreground">{formatGHS(order.delivery)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <dt className="font-serif text-base text-foreground">Total paid</dt>
                    <dd className="font-serif text-lg font-semibold text-primary">{formatGHS(order.total)}</dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-2xl bg-secondary/40 p-4 text-sm">
                  <p className="font-semibold text-foreground">Delivery to</p>
                  <p className="text-muted-foreground">{order.customer.name} • {order.customer.phone}</p>
                  <p className="text-muted-foreground">{order.customer.address}</p>
                  <p className="mt-1 text-muted-foreground">
                    Delivery date: <span className="font-medium text-foreground">{order.customer.deliveryDate}</span>
                  </p>
                </div>
              </div>
            </>
          )}

          <Link
            to="/"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-gradient-primary px-8 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
          >
            Back to home
          </Link>
        </motion.div>
      </section>
      <div className="mt-20" />
      <Footer />
    </main>
  );
};

export default OrderSuccess;
