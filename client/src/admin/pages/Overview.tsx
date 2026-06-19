import { Link } from "react-router-dom";
import { ShoppingBag, Coins, CalendarDays, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import AdminLayout from "@/admin/AdminLayout";
import StatusBadge from "@/admin/components/StatusBadge";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { formatPesewas } from "@/lib/utils";
import { fetchAllOrders } from "@/store/slices/ordersSlice";
import { Order } from "@/store/types";
import { useEffect } from "react";
import MonthlyExpensesChart from "./Monthlyexpenseschart";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


function buildMonthlySeries(orders: Order[]) {
  const now = new Date();
  const buckets: { key: string; label: string; revenue: number; orders: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({ key, label: MONTHS[d.getMonth()], revenue: 0, orders: 0 });
  }
  const map = new Map(buckets.map((b) => [b.key, b]));
  orders.forEach((o) => {
    const key = o.created_at.slice(0, 7);
    const b = map.get(key);
    if (!b) return;
    b.orders += 1;
    if (o.status === "paid") b.revenue += o.total_pesewas;
  });
  return buckets;
}

const Overview = () => {
  const dispatch = useAppDispatch();
  const {list, listStatus} = useAppSelector((state) => state.orders);
  const today = new Date().toISOString().slice(0, 10);
  const totalFiltered = list.filter((o) => o.status === 'paid' || o.status ==='delivered');

  const totals = {
    orders: totalFiltered.length,
    revenue: list.filter((o) => o.status === "paid").reduce((s, o) => s + o.total_pesewas, 0),
    today: list.filter((o) => new Date(o.created_at).toISOString().slice(0, 10) === today && o.status === 'paid').length,
    pending: list.filter((o) => o.status === "pending").length,
    delivered: list.filter((o) => o.status === "delivered").length,
  };

  const filteredList = list.filter((o) => o.status === 'paid' || o.status === 'delivered' );
  const monthly = buildMonthlySeries(list);
  const hasData = monthly.some((m) => m.orders > 0 || m.revenue > 0);

  const cards = [
    { label: "Total Orders", value: totals.orders, icon: ShoppingBag, tone: "bg-primary-soft text-primary" },
    // { label: "Total Revenue", value: formatPesewas(totals.revenue), icon: Coins, tone: "bg-accent text-chocolate" },
    { label: "Orders Today", value: totals.today, icon: CalendarDays, tone: "bg-secondary text-foreground" },
    { label: "Pending", value: totals.pending, icon: Clock, tone: "bg-amber-100 text-amber-700" },
    { label: "Delivered", value: totals.delivered, icon: CheckCircle2, tone: "bg-emerald-100 text-emerald-700" },
  ];

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
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">A snapshot of your bakery's activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-card p-5 shadow-sm border border-border">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${c.tone}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>
      
        <div className="mt-8 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center justify-between p-5">
          <h2 className="font-serif text-lg text-foreground">Recent orders</h2>
          <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Order ID</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Delivery</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredList.slice(0, 6).map((o) => (
                <tr key={o.id} className="hover:bg-secondary/30">
                  <td className="px-5 py-3 font-medium text-foreground">
                    <Link to={`/admin/orders/${o.id}`} className="hover:text-primary">
                      {o.id} {o.is_urgent && <span className="ml-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase text-destructive">Urgent</span>}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-foreground">{o.customer_name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3 text-right font-semibold text-foreground">{formatPesewas(o.total_pesewas)}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-5 shadow-sm border border-border">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg text-foreground">Revenue per month</h2>
              <p className="text-xs text-muted-foreground">Paid orders, last 12 months</p>
            </div>
            <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">GHS</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={50} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [formatPesewas(value), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {!hasData && (
            <p className="mt-2 text-center text-xs text-muted-foreground">No paid orders yet — chart will populate as orders come in.</p>
          )}
        </div>

        <div className="rounded-2xl bg-card p-5 shadow-sm border border-border">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg text-foreground">Orders per month</h2>
              <p className="text-xs text-muted-foreground">All orders, last 12 months</p>
            </div>
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-chocolate">Count</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  cursor={{ fill: "hsl(var(--secondary))", opacity: 0.4 }}
                  formatter={(value: number) => [value, "Orders"]}
                />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
         <div className="lg:col-span-2">
          <MonthlyExpensesChart />
        </div>
      </div>

    
    </AdminLayout>
  );
};

export default Overview;
