import { motion } from "framer-motion";
import { ArrowRight, Sparkles,Megaphone } from "lucide-react";
import heroCake from "@/assets/hero-cake.jpg";

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
          <div className='flex flex-col items-center space-y-2 md:space-y-0 md:space-x-2'>
            <span className="inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Freshly baked in Kumasi, Ghana
          </span>
          <p className="inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur">
            <Megaphone className="h-3.5 w-3.5" /> Kindly take note delivery goes out after 5pm!
          </p>
          </div>
          
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            Sweet moments deserve
            <span className="block bg-gradient-to-r from-primary to-chocolate bg-clip-text text-transparent">
              perfect cakes 🎂
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground sm:text-lg lg:mx-0">
            Handcrafted cupcakes and custom cakes baked with love, order online and we'll deliver fresh to your door.
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
            <div><span className="block font-serif text-2xl font-semibold text-foreground">500+</span>Happy clients</div>
            <div className="h-8 w-px bg-border" />
            <div><span className="block font-serif text-2xl font-semibold text-foreground">4.9★</span>Customer rating</div>
            <div className="h-8 w-px bg-border" />
            <div><span className="block font-serif text-2xl font-semibold text-foreground">24h</span>Fast delivery</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none "
        >
          <div className="absolute inset-0 -rotate-6 rounded-[2.5rem] bg-gradient-primary opacity-20 blur-2xl " />
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-soft animate-float">
            <img
              src={heroCake}
              alt="Pink rose celebration cake handcrafted by Sweet Crumbs Ghana"
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
            <p className="font-serif text-base font-semibold text-foreground">Rose Bloom Cake</p>
            <p className="text-xs font-medium text-primary">From GH₵ 250</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
