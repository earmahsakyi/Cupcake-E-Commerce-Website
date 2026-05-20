import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import StatusBadge from "@/admin/components/StatusBadge";
import { OrderStatus } from "@/store/types";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { formatPesewas } from "@/lib/utils";
import { fetchAllOrders } from "@/store/slices/ordersSlice";

const statuses: ("All" | OrderStatus)[] = ["All", "pending", "paid", "processing", "delivered", "cancelled"];

const Orders = () => {
  const dispatch = useAppDispatch();

  const {list, listStatus} = useAppSelector((state) => state.orders);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");

  const filtered = list.filter((o) => {
    if (filter !== "All" && o.status !== filter) return false;
    if (q) {
      const s = q.toLowerCase();
      return String(o.id).includes(s) || o.customer_name.toLowerCase().includes(s) || o.customer_phone.includes(s)
    }
    return true;
  });

  useEffect(()=> {
    dispatch(fetchAllOrders())
  },[dispatch]);

  if (listStatus === 'loading') return (
    <AdminLayout>
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"/>

      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Orders</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {list.length} orders</p>
        </div>
        <div className="relative flex gap-3">
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
                    {o.id} {o.is_urgent && <span className="ml-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase text-destructive">Urgent</span>}
                  </Link>
                </td>
                <td className="px-5 py-3"><Link to={`/admin/orders/${o.id}`} className="text-foreground">{o.customer_name}</Link></td>
                <td className="px-5 py-3 text-muted-foreground">{o.customer_phone}</td>
                <td className="px-5 py-3 text-muted-foreground">{new Date(o.delivery_address || o.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-3 text-right font-semibold text-foreground">{formatPesewas(o.total_pesewas)}</td>
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
