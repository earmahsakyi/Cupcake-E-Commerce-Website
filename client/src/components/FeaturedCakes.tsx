import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { fetchProducts } from "@/store/slices/productsSlice";
import { formatPesewas } from "@/lib/utils";
import { getStartingPrice } from "@/lib/utils";






const FeaturedCakes = () => {

  const dispatch = useAppDispatch();
  const {items: products, status} = useAppSelector(state => state.products)

  useEffect(() => {
    if(status === 'idle') dispatch(fetchProducts());
  },[dispatch, status])
  return (
    <section id="cakes" className="bg-background py-20 sm:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-primary">Our Menu</span>
          <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Handcrafted with love
          </h2>
          <p className="mt-4 text-muted-foreground">
            From dreamy cupcakes to grand celebration cakes just tap any cake to explore.
          </p>
        </motion.div>

        {status === "loading" && (
          <div className="mt-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
          </div>
        )}

        {status === "failed" && (
          <p className="mt-12 text-center text-muted-foreground">
            Could not load products. Please refresh the page.
          </p>
        )}

        {status === "succeeded" && products.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            No products available right now.
          </p>
        )}

      {status === 'succeeded' && products.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {products.map((product, i) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-3xl bg-card shadow-card transition-shadow hover:shadow-soft"
            >
              <Link to={`/cake/${product.slug}`} aria-label={`View ${product.name}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    width={800}
                    height={800}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{product.name}</h3>
                    <p className="mt-1 text-sm font-medium text-primary">{getStartingPrice(product) > 0 ?  formatPesewas(getStartingPrice(product)): 'Price on request'}</p>
                  </div>
                  <span className="rounded-full bg-primary-soft px-4 py-2 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    View
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
      </div>
    </section>
  );
};

export default FeaturedCakes;
