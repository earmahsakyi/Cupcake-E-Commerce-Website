import { ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Cake, LayoutDashboard, ShoppingBag, Package, Truck, CreditCard,
  MessageSquare, LogOut, Menu, X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { logoutAdmin } from "@/store/slices/adminAuthSlice";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/deliveries", label: "Deliveries", icon: Truck },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/sms", label: "SMS Log", icon: MessageSquare },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const admin = useAppSelector((state) => state.adminAuth.admin);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {open && (
        <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r border-border transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link to="/admin" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-soft">
              <Cake className="h-5 w-5" />
            </span>
            <span className="font-serif text-lg font-semibold text-foreground">Admin</span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute inset-x-3 bottom-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs text-muted-foreground">Cup O' Cake Admin</p>
            <p className="font-serif text-lg text-foreground">
              Welcome back, {admin?.name?.split(" ")[0] ?? "Admin"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{admin?.name}</p>
              <p className="text-xs text-muted-foreground">{admin?.email}</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-primary-foreground font-semibold">
              {(admin?.name?.[0] ?? "A").toUpperCase()}
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;