import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPesewas } from "@/lib/utils";

const CartDrawer = () => {
  const { isOpen, closeCart, items, subtotal, setQuantity, removeItem } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.4, 0, 0.2, 1], duration: 0.35 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-soft"
            aria-label="Shopping cart"
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 font-serif text-xl text-foreground">
                <ShoppingBag className="h-5 w-5 text-primary" /> Your Cart
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full p-2 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
                    <ShoppingBag className="h-9 w-9 text-primary" />
                  </div>
                  <p className="font-serif text-lg text-foreground">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">Browse our cakes to get started.</p>
                  <button
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
                  >
                    Continue browsing
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        className="flex gap-3 rounded-2xl bg-card p-3 shadow-card"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                        />
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-serif text-sm font-semibold text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {[item.size, item.flavor_note].filter(Boolean).join(" • ")}
                              </p>
                            </div>
                            <button
                              aria-label={`Remove ${item.name}`}
                              onClick={() => removeItem(item.key)}
                              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="inline-flex items-center rounded-full border border-border">
                              <button
                                onClick={() => setQuantity(item.key, item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-primary"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-7 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                              <button
                                onClick={() => setQuantity(item.key, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-primary"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-primary">
                              {formatPesewas(item.unitPrice * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border bg-secondary/40 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-xl font-semibold text-foreground">
                    {formatPesewas(subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Delivery fees calculated at checkout.</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted"
                  >
                    View cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-soft"
                  >
                    Checkout
                  </Link>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
