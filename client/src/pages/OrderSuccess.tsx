import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, PartyPopper, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPesewas } from "@/lib/utils";
import { fetchOrderById } from "@/store/slices/ordersSlice";
import { useAppDispatch, useAppSelector } from "@/store/index";

const OrderSuccess = () => {

  const [searchParams] = useSearchParams();
  const orderId = Number(searchParams.get("id"));
  const dispatch = useAppDispatch();
  const { currentOrder, fetchStatus, error } = useAppSelector(state => state.orders);

  useEffect(()=> {
    document.title = "Order Confirmed | CupOcake";
    if(orderId) dispatch(fetchOrderById(orderId))
  },[orderId, dispatch])

    if (!orderId) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="container pt-28 text-center">
          <p className="text-muted-foreground">No order found.</p>
          <Link to="/" className="mt-4 inline-block text-primary underline">Back to home</Link>
        </section>
        <Footer />
      </main>
    );
  }
 if (fetchStatus === "loading") {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="container pt-28 text-center">
          <p className="text-muted-foreground animate-pulse">Loading your order…</p>
        </section>
        <Footer />
      </main>
    );
  }
  if (fetchStatus === "failed") {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="container pt-28 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <p className="mt-3 text-muted-foreground">{error ?? "Could not load your order."}</p>
          <Link to="/" className="mt-4 inline-block text-primary underline">Back to home</Link>
        </section>
        <Footer />
      </main>
    );
  }

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
            Your order has been received. We'll be in touch shortly to confirm.
          </p>

          {currentOrder && (
            <>
              <div className="mt-6 inline-flex flex-col items-center rounded-2xl bg-secondary/60 px-6 py-3">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Reference</span>
                <span className="font-serif text-2xl font-semibold text-foreground">{currentOrder.reference}</span>
              </div>

              <div className="mt-8 text-left">
                <h2 className="font-serif text-lg text-foreground">Order summary</h2>
                <ul className="mt-3 divide-y divide-border rounded-2xl border border-border">
                  {currentOrder.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between p-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground">
                          {item.quantity} × {item.product_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {[item.size, item.flavor_note].filter(Boolean).join(" • ")}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        {formatPesewas(item.unit_price_pesewas * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <dl className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between border-t border-border pt-2">
                    <dt className="font-serif text-base text-foreground">Total paid</dt>
                    <dd className="font-serif text-lg font-semibold text-primary">
                      {formatPesewas(currentOrder.total_pesewas)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-2xl bg-secondary/40 p-4 text-sm text-left">
                  <p className="font-semibold text-foreground">Delivering to</p>
                  <p className="mt-1 text-muted-foreground">
                    {currentOrder.customer_name} • {currentOrder.customer_phone}
                  </p>
                  <p className="text-muted-foreground">{currentOrder.delivery_address}</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">📱 Approve your MoMo payment</p>
              <p className="mt-1">Check your phone for a MoMo approval prompt. If you didn't receive one, dial <span className="font-semibold text-foreground">*170#</span> (MTN) or <span className="font-semibold text-foreground">*110#</span> (Telecel) to approve manually.</p>
              <p className="mt-2">Your order status will update automatically once payment is confirmed.</p>
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
  
}

export default OrderSuccess;