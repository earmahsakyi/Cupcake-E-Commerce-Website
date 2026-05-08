import { motion } from "framer-motion";
import { Leaf, Palette, Truck, HeartHandshake } from "lucide-react";

const features = [
  { icon: Leaf, title: "Fresh Ingredients", desc: "Locally sourced, premium quality, baked the same day." },
  { icon: Palette, title: "Custom Designs", desc: "Tell us your vision. We'll bring it to life in frosting." },
  { icon: Truck, title: "Fast Delivery", desc: "Same-day delivery across Kumasi and major Ghanaian cities." },
  { icon: HeartHandshake, title: "Affordable Pricing", desc: "Premium quality at prices that suit every celebration." },
];

const WhyChooseUs = () => {
  return (
    <section id="why" className="bg-gradient-warm py-20 sm:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-primary">Why Choose Us</span>
          <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Crafted to make you smile
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-3xl bg-card p-6 text-center shadow-card transition-transform hover:-translate-y-1"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <f.icon className="h-7 w-7" strokeWidth={1.8} />
              </div>
              <h3 className="mt-5 font-serif text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
