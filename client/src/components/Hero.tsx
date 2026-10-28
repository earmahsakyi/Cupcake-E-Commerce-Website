import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Megaphone, MapPin } from "lucide-react";
import heroCake from "@/assets/hero-cake1.png";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-hero pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary-soft/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-accent/50 blur-3xl" />

      <div className="container relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center lg:text-left"
        >
          <div className="flex flex-col items-center md:items-start md:flex-row flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Pre-Order Only
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur">
              <Megaphone className="h-3.5 w-3.5" /> Deliveries dispatch after 5:00 PM
            </span>
            
          </div>

          <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            Sweet moments deserve
            <span className="block bg-gradient-to-r from-primary to-chocolate bg-clip-text text-transparent">
              perfect cakes 🎂
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            Cup O’ Cake creates cakes, cupcakes, cake parfaits and custom cakes for birthdays, celebrations and special moments. Browse our available products, view prices and place your order online. For custom designs and special requests, contact our team to discuss your requirements.
          </p>

          <p className="mt-3 text-xs leading-normal text-muted-foreground/90 max-w-lg mx-auto lg:mx-0">
            We are based in Ayeduase, near KNUST, Kumasi, Ghana. Please contact us to confirm product availability, custom cake arrangements and delivery availability for your location.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="#cakes"
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-8 text-base font-semibold text-primary-foreground shadow-soft transition-all hover:scale-[1.03] hover:shadow-glow sm:w-auto"
            >
              Shop Cakes
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#why"
              className="inline-flex h-14 w-full items-center justify-center rounded-full border border-border bg-card/60 px-8 text-base font-semibold text-foreground backdrop-blur transition-colors hover:bg-card sm:w-auto"
            >
              Why us
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground lg:justify-start">
            <div>
              <span className="block font-serif text-xl font-semibold text-foreground sm:text-2xl">Fresh</span>
              Baked to order
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="block font-serif text-xl font-semibold text-foreground sm:text-2xl">Custom</span>
              Bespoke designs
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="block font-serif text-xl font-semibold text-foreground sm:text-2xl">Local</span>
              Kumasi delivery
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="absolute inset-0 -rotate-6 rounded-[2.5rem] bg-gradient-primary opacity-20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-soft animate-float">
            <img
              src={heroCake}
              alt="Handcrafted celebration cake by Cup O' Cake in Kumasi, Ghana"
              width={1536}
              height={1536}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-5 -left-3 rounded-2xl bg-card px-4 py-3 shadow-card sm:-left-6"
          >
            <p className="text-xs text-muted-foreground">Today's special</p>
            <p className="font-serif text-base font-semibold text-foreground">Bento Cake</p>
            <p className="text-xs font-medium text-primary">GH₵ 100</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
