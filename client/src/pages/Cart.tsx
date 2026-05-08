import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/data/cakes";

const Cart = () => {
  const { items, subtotal, setQuantity, removeItem } = useCart();
  const delivery = items.length ? 30 : 0;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container pt-24 sm:pt-28">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-foreground sm:text-4xl">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center rounded-3xl bg-card p-12 text-center shadow-card">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
              <ShoppingBag className="h-9 w-9 text-primary" />
            </div>
            <p className="font-serif text-xl text-foreground">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Add a delicious treat to get started.</p>
            <Link
              to="/#cakes"
              className="mt-6 rounded-full bg-gradient-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Browse cakes
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.key}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    className="flex flex-col gap-4 rounded-3xl bg-card p-4 shadow-card sm:flex-row"
                  >
                    <Link to={`/cake/${item.slug}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-32 w-full rounded-2xl object-cover sm:h-28 sm:w-28"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link to={`/cake/${item.slug}`} className="font-serif text-lg font-semibold text-foreground hover:text-primary">
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {[item.size, item.flavor].filter(Boolean).join(" • ")}
                          </p>
                          {item.message && (
                            <p className="mt-1 text-xs italic text-muted-foreground">"{item.message}"</p>
                          )}
                        </div>
                        <button
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.key)}
                          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            onClick={() => setQuantity(item.key, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-primary"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => setQuantity(item.key, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-primary"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-serif text-lg font-semibold text-primary">
                          {formatGHS(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <aside className="h-fit rounded-3xl bg-card p-6 shadow-card lg:sticky lg:top-24">
              <h2 className="font-serif text-xl text-foreground">Order summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold text-foreground">{formatGHS(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery (est.)</dt>
                  <dd className="font-semibold text-foreground">{formatGHS(delivery)}</dd>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <dt className="font-serif text-base text-foreground">Total</dt>
                  <dd className="font-serif text-xl font-semibold text-primary">
                    {formatGHS(subtotal + delivery)}
                  </dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </section>
      <div className="mt-20" />
      <Footer />
    </main>
  );
};

export default Cart;
