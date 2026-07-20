import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { knustSrcCakes, type SrcCake } from "@/data/srcCakes";
import { formatPesewas } from "@/lib/utils";

const FeaturedSrcCakes = () => {
  // ==================== SRC WEEK STATIC MENU ====================
  // This is temporary for KNUST SRC Week only.
  // After the event, revert to the original Redux version.
  // ============================================================

  const srcCakes: SrcCake[] = knustSrcCakes;

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
          <span className="text-3xl font-medium uppercase tracking-widest text-primary">
            KNUST SRC WEEK EDITION
          </span>
          <h2 className="mt-3 font-serif text-xl text-foreground sm:text-2xl lg:text-2xl">
            Special Menu
          </h2>
          <p className="mt-4 text-muted-foreground">
            Handcrafted cakes available at our SRC Week stand. Tap any cake to view details and prices.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {srcCakes.map((cake, i) => (
            <motion.article
              key={cake.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-3xl bg-card shadow-card transition-shadow hover:shadow-soft"
            >
              <Link to={`/cake/${cake.slug}`} aria-label={`View ${cake.name}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={cake.images[0]}
                    alt={cake.name}
                    width={800}
                    height={800}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {cake.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {formatPesewas(cake.price)}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary-soft px-4 py-2 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    View
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSrcCakes;