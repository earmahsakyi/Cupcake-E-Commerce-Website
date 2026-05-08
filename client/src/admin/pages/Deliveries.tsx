import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import { ordersStore } from "@/admin/store";
import { useStore } from "@/admin/useStore";
import { formatGHS } from "@/data/cakes";
import StatusBadge from "@/admin/components/StatusBadge";

const Deliveries = () => {
  const orders = useStore(ordersStore);
  const today = new Date().toISOString().slice(0, 10);

  const grouped = orders
    .filter((o) => o.status !== "Delivered" && o.status !== "Cancelled")
    .reduce<Record<string, typeof orders>>((acc, o) => {
      (acc[o.customer.deliveryDate] ||= []).push(o);
      return acc;
    }, {});

  const dates = Object.keys(grouped).sort();
  const todayOrders = grouped[today] || [];
  const upcomingDates = dates.filter((d) => d > today);
  const pastDates = dates.filter((d) => d < today);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Delivery Scheduler</h1>
        <p className="text-sm text-muted-foreground">Orders grouped by delivery date.</p>
      </div>

      <Section title={`Today's deliveries (${today})`} orders={todayOrders} emptyText="No deliveries scheduled for today." highlight />

      <div className="mt-8">
        <h2 className="mb-3 font-serif text-lg text-foreground">Upcoming</h2>
        {upcomingDates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming deliveries.</p>
        ) : (
          <div className="space-y-6">
            {upcomingDates.map((d) => (
              <Section key={d} title={d} orders={grouped[d]} />
            ))}
          </div>
        )}
      </div>

      {pastDates.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-serif text-lg text-foreground">Overdue</h2>
          <div className="space-y-6">
            {pastDates.map((d) => (
              <Section key={d} title={d} orders={grouped[d]} highlight />
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const Section = ({
  title,
  orders,
  emptyText,
  highlight,
}: {
  title: string;
  orders: ReturnType<typeof useStore<any>>;
  emptyText?: string;
  highlight?: boolean;
}) => {
  if (!orders || orders.length === 0) {
    return emptyText ? (
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
        <p className="font-serif text-lg text-foreground">{title}</p>
        <p className="mt-1">{emptyText}</p>
      </div>
    ) : null;
  }
  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <p className="font-serif text-lg text-foreground">{title}</p>
        <span className="text-xs font-semibold text-muted-foreground">{orders.length} order{orders.length > 1 ? "s" : ""}</span>
      </div>
      <ul className="divide-y divide-border">
        {orders.map((o: any) => (
          <li key={o.id} className={`flex flex-wrap items-center gap-3 px-5 py-3 ${highlight && o.urgent ? "bg-destructive/5" : ""}`}>
            <Link to={`/admin/orders/${o.id}`} className="font-semibold text-foreground hover:text-primary">
              {o.id}
            </Link>
            {o.urgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase text-destructive">
                <AlertTriangle className="h-3 w-3" /> Urgent
              </span>
            )}
            <span className="text-sm text-foreground">{o.customer.name}</span>
            <span className="text-sm text-muted-foreground">{o.customer.phone}</span>
            <span className="ml-auto flex items-center gap-3">
              <StatusBadge status={o.status} />
              <span className="font-semibold text-foreground">{formatGHS(o.total)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Deliveries;
