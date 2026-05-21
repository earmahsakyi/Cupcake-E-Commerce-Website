import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section id="order" className="py-20 sm:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-chocolate px-6 py-16 text-center sm:rounded-[2.5rem] sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-serif text-3xl text-chocolate-foreground sm:text-4xl lg:text-5xl">
              Ready to taste happiness?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-chocolate-foreground/80 sm:text-lg">
              Browse our cakes, build your order, and check out,  all in one place.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#cakes"
                className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-8 text-base font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105 sm:w-auto"
              >
                Shop Cakes
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                to="/cart"
                className="inline-flex h-14 w-full items-center justify-center rounded-full border border-chocolate-foreground/20 bg-chocolate-foreground/5 px-8 text-base font-semibold text-chocolate-foreground backdrop-blur transition-colors hover:bg-chocolate-foreground/10 sm:w-auto"
              >
                View Cart
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
