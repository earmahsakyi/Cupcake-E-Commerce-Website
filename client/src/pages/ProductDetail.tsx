import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { fetchProducts } from "@/store/slices/productsSlice";
import { formatPesewas, getStartingPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { slug = "" } = useParams();
  const dispatch = useAppDispatch();
  const { items: products = [], status = 'idle' } = useAppSelector((state) => state.products);
  const product = products.find((p) => p.slug === slug);

  const { addItem, openCart } = useCart();

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<'small' | 'medium' | 'large' | undefined>();
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [slotFlavors, setSlotFlavors] = useState<{ slot_number: number; flavor: string }[]>([]);
  const [flavorNote, setFlavorNote] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [dispatch, status]);

  // Reset form when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImg(0);
    setSize(product?.variants?.[0]?.size);
    setSelectedFlavors([]);
    setSlotFlavors([]);
    setFlavorNote("");
    setQty(1);
  }, [slug, product]);

  useEffect(() => {
    if (product) document.title = `${product.name} | Cup O' Cake`;
  }, [product]);

  // Initialize slot flavors for boxes
  useEffect(() => {
    if (product?.product_type === 'box' && product.box_slot_count && product.flavors.length > 0) {
      setSlotFlavors(
        Array.from({ length: product.box_slot_count }, (_, i) => ({
          slot_number: i + 1,
          flavor: product.flavors[0],
        }))
      );
    }
  }, [product]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    if (product.variants?.length > 0) {
      const variant = product.variants.find((v) => v.size === size);
      return variant?.price_pesewas ?? product.variants[0].price_pesewas;
    }
    return product.box_price_pesewas ?? 0;
  }, [product, size]);

  const displayPrice = useMemo(() => {
    if (product?.product_type === 'cupcake' && size) {
      return unitPrice;
    }
    return getStartingPrice(product);
  }, [product, size, unitPrice]);

  const related = useMemo(() => 
    products.filter((p) => p.id !== product?.id).slice(0, 3), 
    [product, products]
  );

  const handleAdd = () => {
    if (!product) return;

    const baseItem = {
      cakeId: String(product.id),
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? '',
      unitPrice: displayPrice,
      quantity: qty,
    };

    let cartItem: any = { ...baseItem };

    if (product.product_type === 'cupcake') {
      cartItem = {
        ...cartItem,
        size,
        selected_flavors: selectedFlavors.length > 0 ? selectedFlavors : undefined,
        flavor_note: flavorNote.trim() || undefined,
      };
    } 
    else if (product.product_type === 'box') {
      cartItem = {
        ...cartItem,
        slot_flavors: slotFlavors,
      };
    } 
    else if (product.product_type === 'custom_cake') {
      cartItem = {
        ...cartItem,
        flavor_note: flavorNote.trim() || undefined,
      };
    }

    addItem(cartItem);
    setAdded(true);
    toast({ 
      title: "Added to cart", 
      description: `${qty} × ${product.name}` 
    });
    setTimeout(() => setAdded(false), 1600);
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
        </div>
      </main>
    );
  }

  if (!product) {
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
                  src={product.images[activeImg]}
                  alt={`${product.name} view ${activeImg + 1}`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
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
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground">{product.name}</h1>
            <p className="mt-2 text-2xl font-semibold text-primary">
              {formatPesewas(displayPrice)}
              {product.product_type === 'cupcake' && !size && " starting"}
            </p>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{product.description}</p>

            {/* CUPCAKE OPTIONS */}
            {product.product_type === 'cupcake' && (
              <>
                {product.variants.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-foreground mb-2">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.size}
                          onClick={() => setSize(v.size)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            size === v.size
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-foreground hover:border-primary"
                          }`}
                        >
                          {v.size} - {formatPesewas(v.price_pesewas)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.flavors.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-foreground mb-2">Flavors (select multiple)</p>
                    <div className="flex flex-wrap gap-2">
                      {product.flavors.map((f) => (
                        <button
                          key={f}
                          onClick={() => {
                            setSelectedFlavors((prev) =>
                              prev.includes(f) ? prev.filter((fl) => fl !== f) : [...prev, f]
                            );
                          }}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            selectedFlavors.includes(f)
                              ? "border-primary bg-primary-soft text-primary"
                              : "border-border bg-card hover:border-primary"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <label className="text-sm font-semibold text-foreground block mb-1">
                    Any notes about your mix?
                  </label>
                  <textarea
                    value={flavorNote}
                    onChange={(e) => setFlavorNote(e.target.value)}
                    placeholder="E.g. more vanilla, extra chocolate, etc."
                    className="w-full rounded-xl border border-border bg-card p-3 text-sm min-h-[80px] resize-y"
                  />
                </div>
              </>
            )}

            {/* BOX OPTIONS */}
            {product.product_type === 'box' && product.box_slot_count && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Choose flavor for each slot
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {slotFlavors.map((slot, index) => (
                    <div key={index}>
                      <label className="text-xs text-muted-foreground block mb-1">
                        Slot {slot.slot_number}
                      </label>
                      <select
                        value={slot.flavor}
                        onChange={(e) => {
                          const updated = [...slotFlavors];
                          updated[index] = { ...updated[index], flavor: e.target.value };
                          setSlotFlavors(updated);
                        }}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                      >
                        {product.flavors.map((flavor) => (
                          <option key={flavor} value={flavor}>
                            {flavor}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CUSTOM CAKE OPTIONS */}
            {product.product_type === 'custom_cake' && (
              <div className="mt-6">
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Describe your custom cake
                </label>
                <textarea
                  value={flavorNote}
                  onChange={(e) => setFlavorNote(e.target.value)}
                  placeholder="E.g. 2-tier red velvet cake with white roses, gold drip, serve 20 people..."
                  className="w-full rounded-xl border border-border bg-card p-4 min-h-[140px] text-sm"
                />
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-border bg-card">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-primary"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold text-foreground">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-semibold text-foreground">{formatPesewas(displayPrice * qty)}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-primary px-8 text-base font-semibold text-primary-foreground shadow-soft hover:scale-[1.02]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <Check className="h-5 w-5" /> Added!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
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

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="font-serif text-2xl sm:text-3xl text-foreground">You may also love</h2>
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
                    <p className="mt-1 text-sm font-medium text-primary">
                      {formatPesewas(getStartingPrice(c))}
                    </p>
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
      <Footer />
    </main>
  );
};

export default ProductDetail;