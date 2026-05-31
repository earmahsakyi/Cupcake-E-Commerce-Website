import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Alexandra  Yeboah",
    role: "Birthday celebrant, Accra",
    quote: "My birthday cake was a dream, gorgeous and even more delicious. Cup O' Cake made my day unforgettable!",
    initial: "A",
  },
  {
    name: "Hayzel Addison",
    role: "Birthday celebrant",
    quote: "Ordered cupcakes for my daughter's birthday and everyone was blown away. So fresh and beautifully packaged.",
    initial: "H",
  },
  {
    name: "Gregory Daniels",
    role: "Event planner, Kumasi",
    quote: "My go-to bakery for client events. Reliable, creative, and the taste? Out of this world.",
    initial: "G",
  },
];

const Testimonials = () => {
  return (
    <section id="reviews" className="bg-background py-20 sm:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-primary">Loved by 500+ customers</span>
          <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Sweet words from sweet people
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex h-full flex-col rounded-3xl bg-gradient-warm p-7 shadow-card"
            >
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-serif text-lg italic leading-relaxed text-foreground">
                "{r.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground">
                  {r.initial}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
