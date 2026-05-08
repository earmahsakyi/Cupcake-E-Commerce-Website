import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cakes, formatGHS, getCakeBySlug } from "@/data/cakes";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { slug = "" } = useParams();
  const cake = getCakeBySlug(slug);
  const { addItem, openCart } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | undefined>(cake?.sizes?.[0]?.label);
  const [flavor, setFlavor] = useState<string | undefined>(cake?.flavors?.[0]);
  const [message, setMessage] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImg(0);
    setSize(cake?.sizes?.[0]?.label);
    setFlavor(cake?.flavors?.[0]);
    setMessage("");
    setQty(1);
  }, [slug, cake]);

  useEffect(() => {
    if (cake) document.title = `${cake.name} | Cup O' Cake`;
  }, [cake]);

  const unitPrice = useMemo(() => {
    if (!cake) return 0;
    const delta = cake.sizes?.find((s) => s.label === size)?.priceDelta ?? 0;
    return cake.price + delta;
  }, [cake, size]);

  const related = useMemo(() => cakes.filter((c) => c.id !== cake?.id).slice(0, 3), [cake]);

  if (!cake) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 text-center">
          <h1 className="font-serif text-3xl text-foreground">Cake not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary underline">Back to home</Link>
        </div>
      </main>
    );
  }

  const handleAdd = () => {
    addItem({
      cakeId: cake.id,
      slug: cake.slug,
      name: cake.name,
      image: cake.images[0],
      unitPrice,
      quantity: qty,
      size,
      flavor,
      message: message.trim().slice(0, 120) || undefined,
    });
    setAdded(true);
    toast({ title: "Added to cart", description: `${qty} × ${cake.name}` });
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container pt-24 sm:pt-28">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to cakes
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted shadow-card">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={cake.images[activeImg]}
                  alt={`${cake.name} view ${activeImg + 1}`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              {cake.tag && (
                <span className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                  {cake.tag}
                </span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {cake.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={`overflow-hidden rounded-2xl border-2 transition-all ${
                    activeImg === i ? "border-primary shadow-soft" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="aspect-square h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="font-serif text-3xl text-foreground sm:text-4xl">{cake.name}</h1>
            <p className="mt-2 text-2xl font-semibold text-primary">{formatGHS(unitPrice)}</p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{cake.description}</p>

            {cake.sizes && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-foreground">Size</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cake.sizes.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setSize(s.label)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        size === s.label
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-primary"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cake.flavors && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-foreground">Flavor</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cake.flavors.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFlavor(f)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        flavor === f
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-card text-foreground hover:border-primary"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cake.allowMessage && (
              <div className="mt-5">
                <label htmlFor="msg" className="text-sm font-semibold text-foreground">
                  Custom message <span className="font-normal text-muted-foreground">(optional, max 120 chars)</span>
                </label>
                <input
                  id="msg"
                  type="text"
                  value={message}
                  maxLength={120}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Happy Birthday Ama!"
                  className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-border bg-card">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Decrease quantity"
                  className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-primary"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold text-foreground">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  aria-label="Increase quantity"
                  className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-semibold text-foreground">{formatGHS(unitPrice * qty)}</span>
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-primary px-8 text-base font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Check className="h-5 w-5" /> Added!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="inline-flex items-center gap-2"
                    >
                      <ShoppingBag className="h-5 w-5" /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <button
                onClick={() => {
                  handleAdd();
                  setTimeout(openCart, 200);
                }}
                className="inline-flex h-14 items-center justify-center rounded-full border border-border bg-card px-8 text-base font-semibold text-foreground hover:bg-muted"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-20">
          <h2 className="font-serif text-2xl text-foreground sm:text-3xl">You may also love</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <Link
                key={c.id}
                to={`/cake/${c.slug}`}
                className="group overflow-hidden rounded-3xl bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={c.images[0]}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{c.name}</h3>
                    <p className="mt-1 text-sm font-medium text-primary">{formatGHS(c.price)}</p>
                  </div>
                  <span className="rounded-full bg-primary-soft px-4 py-2 text-xs font-semibold text-primary">
                    View
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="mt-20" />
      <Footer />
    </main>
  );
};

export default ProductDetail;
