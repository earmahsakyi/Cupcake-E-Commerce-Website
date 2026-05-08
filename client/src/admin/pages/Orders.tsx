import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import { ordersStore } from "@/admin/store";
import { useStore } from "@/admin/useStore";
import { formatGHS } from "@/data/cakes";
import StatusBadge from "@/admin/components/StatusBadge";
import { OrderStatus } from "@/admin/types";

const statuses: ("All" | OrderStatus)[] = ["All", "Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const Orders = () => {
  const orders = useStore(ordersStore);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");

  const filtered = orders.filter((o) => {
    if (filter !== "All" && o.status !== filter) return false;
    if (q) {
      const s = q.toLowerCase();
      return o.id.toLowerCase().includes(s) || o.customer.name.toLowerCase().includes(s) || o.customer.phone.includes(s);
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Orders</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {orders.length} orders</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search orders, customers, phone…"
            className="input-base !w-64 pl-9"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Order ID</th>
              <th className="px-5 py-3 text-left">Customer</th>
              <th className="px-5 py-3 text-left">Phone</th>
              <th className="px-5 py-3 text-left">Delivery</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((o) => (
              <tr key={o.id} className="cursor-pointer hover:bg-secondary/30">
                <td className="px-5 py-3 font-medium text-foreground">
                  <Link to={`/admin/orders/${o.id}`}>
                    {o.id} {o.urgent && <span className="ml-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase text-destructive">Urgent</span>}
                  </Link>
                </td>
                <td className="px-5 py-3"><Link to={`/admin/orders/${o.id}`} className="text-foreground">{o.customer.name}</Link></td>
                <td className="px-5 py-3 text-muted-foreground">{o.customer.phone}</td>
                <td className="px-5 py-3 text-muted-foreground">{o.customer.deliveryDate}</td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-3 text-right font-semibold text-foreground">{formatGHS(o.total)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">No orders match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Orders;
