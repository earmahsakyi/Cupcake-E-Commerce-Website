import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const FloatingCart = () => {
  const { count, openCart } = useCart();
  return (
    <motion.button
      onClick={openCart}
      aria-label={`Open cart, ${count} items`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-soft sm:h-16 sm:w-16"
    >
      <ShoppingBag className="h-6 w-6" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-chocolate px-1.5 text-xs font-bold text-chocolate-foreground shadow-card"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default FloatingCart;
