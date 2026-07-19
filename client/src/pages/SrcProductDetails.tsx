import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { knustSrcCakes, type SrcCake, getSrcCakeBySlug } from "@/data/srcCakes";
import { formatPesewas } from "@/lib/utils";

const ProductSrcDetail = () => {
  const { slug = "" } = useParams();
  const [product, setProduct] = useState<SrcCake | null>(null);

  useEffect(() => {
    const srcCake = getSrcCakeBySlug(slug);
    if (srcCake) {
      setProduct(srcCake);
      document.title = `${srcCake.name} | Cup O' Cake - SRC Week`;
    } else {
      // Optional: You can fallback to original logic later
      setProduct(null);
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 text-center">
          <h1 className="font-serif text-3xl text-foreground">Cake not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary underline">
            Back to SRC Specials
          </Link>
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
          <ArrowLeft className="h-4 w-4" /> Back to SRC Specials
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted shadow-card">
              <AnimatePresence mode="wait">
                <motion.img
                  key={0}
                  src={product.images[0]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail Gallery */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border-2 border-transparent opacity-70 hover:opacity-100 transition-all cursor-pointer"
                >
                  <img
                    src={img}
                    alt=""
                    className="aspect-square h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground">
              {product.name}
            </h1>

            <p className="mt-2 text-3xl font-semibold text-primary">
              {formatPesewas(product.price)}
            </p>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* SRC Week Notice */}
            <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/20 p-6">
              <p className="text-sm font-medium text-primary">
                Available at our KNUST SRC Week Stand
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Come visit us to purchase this cake. We look forward to serving you!
              </p>
            </div>

            {/* Optional Extra Info */}
            {product.shortDesc && (
              <div className="mt-8">
                <h3 className="font-medium text-foreground">Highlights</h3>
                <p className="mt-2 text-muted-foreground">{product.shortDesc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProductSrcDetail;