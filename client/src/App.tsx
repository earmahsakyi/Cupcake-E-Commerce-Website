import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import FloatingCart from "@/components/FloatingCart";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import OrderSuccess from "./pages/OrderSuccess.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/index";
import { loadAdmin } from "@/store/slices/adminAuthSlice";
import CookieBanner from '@/components/common/CookieBanner.tsx';
import { AnimatePresence } from "framer-motion";

import ProtectedRoute from "@/admin/ProtectedRoute";
import Login from "@/admin/pages/Login";
import Signup from "@/admin/pages/Signup";
import ForgotPassword from "@/admin/pages/ForgotPassword";
import ResetPassword from "@/admin/pages/ResetPassword";
import AccountLocked from "@/admin/pages/AccountLocked";
import UnlockAccount from "@/admin/pages/UnlockAccount";
import Overview from "@/admin/pages/Overview";
import Transactions from "./admin/pages/Transactions.tsx";
import Orders from "@/admin/pages/Orders";
import OrderDetail from "@/admin/pages/OrderDetail";
import Products from "@/admin/pages/Products";
import Deliveries from "@/admin/pages/Deliveries";
import Payments from "@/admin/pages/Payments";
import SmsLog from "@/admin/pages/SmsLog";

const queryClient = new QueryClient();

const StorefrontExtras = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <CartDrawer />
      <FloatingCart />
    </>
  );
};

const AppInit = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadAdmin());
  }, [dispatch]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <AppInit/>
       
          <CartProvider>
            <AnimatePresence mode='wait'>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cake/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Admin auth */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/signup" element={<Signup />} />
              <Route path="/admin/forgot" element={<ForgotPassword />} />
              <Route path="/admin/reset" element={<ResetPassword />} />
              <Route path="/admin/locked" element={<AccountLocked />} />
              <Route path="/admin/unlock" element={<UnlockAccount />} />

              {/* Admin dashboard (protected) */}
              <Route path="/admin" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/admin/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/admin/deliveries" element={<ProtectedRoute><Deliveries /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
              <Route path="/admin/sms" element={<ProtectedRoute><SmsLog /></ProtectedRoute>} />
              <Route path="/admin/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </AnimatePresence>
            <StorefrontExtras />
            <CookieBanner />
          </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
