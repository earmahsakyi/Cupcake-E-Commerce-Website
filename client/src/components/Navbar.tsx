import { motion } from "framer-motion";
import { useState } from "react";
import { Cake,Menu,X } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
// import { useCart } from "@/context/CartContext";

const Navbar = () => {
  // const { count, openCart } = useCart();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const onHome = pathname === "/";
  const link = (hash: string) => (onHome ? `#${hash}` : `/#${hash}`);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-soft">
            <Cake className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl font-semibold text-foreground">Cup O' Cake</span>
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-float"></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href={link("cakes")} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Cakes</a>
          <a href={link("why")} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Why us</a>
          <a href={link("reviews")} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Reviews</a>
          <Link to="/cart" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Cart</Link>
          <Button variant="default" size="sm" asChild>
          <Link to="/admin/login">Staff login</Link>
        </Button>
        </nav>
        {/* <button
          onClick={openCart}
          aria-label={`Open cart, ${count} items`}
          className="relative inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {count > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-chocolate px-1.5 text-[10px] font-bold text-chocolate-foreground">
              {count}
            </span>
          )}
        </button> */}
        <div className="w-8 h-8 rounded-sm bg-primary/20 flex items-center justify-center md:hidden transition-all duration-200 hover:-translate-y-2 cursor-pointer">
          <button onClick={()=> setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="container top-0 left-0 right-0 md:hidden mb-3">
          <div className="flex  flex-col items-center space-y-6  text-sm text-muted-foreground">
            <a href={link("cakes")} onClick={()=> setIsOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Cakes</a>
            <a href={link("why")} onClick={()=> setIsOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Why us</a>
          <a href={link("reviews")} onClick={()=> setIsOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Reviews</a>
          <Link to="/cart" onClick={()=> setIsOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Cart</Link>
          <Button variant="default" size="sm" asChild>
          <Link to="/admin/login">Staff login</Link>
        </Button>


          </div>
          
        </div>
      )}
    </motion.header>
  );
};

export default Navbar;
