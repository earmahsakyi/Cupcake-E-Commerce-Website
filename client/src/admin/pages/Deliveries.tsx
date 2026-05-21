import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { fetchAllOrders } from "@/store/slices/ordersSlice";
import { formatPesewas } from "@/lib/utils";
import { Order } from "@/store/types";
import StatusBadge from "@/admin/components/StatusBadge";

const Deliveries = () => {
    const dispatch = useAppDispatch();
    const { list, listStatus } = useAppSelector(s => s.orders);
    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    // Only show active orders that haven't been delivered or cancelled
    const active = list.filter(o =>
        o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'pending'
    );

    // Group by delivery_date — orders with no date go into 'unscheduled'
    const grouped = active.reduce<Record<string, Order[]>>((acc, o) => {
        const key = o.delivery_date
            ? new Date(o.delivery_date).toISOString().slice(0, 10)
            : 'unscheduled';
        (acc[key] ||= []).push(o);
        return acc;
    }, {});

    const dates = Object.keys(grouped).filter(d => d !== 'unscheduled').sort();
    const todayOrders = grouped[today] || [];
    const upcomingDates = dates.filter(d => d > today);
    const pastDates = dates.filter(d => d < today);
    const unscheduled = grouped['unscheduled'] || [];

    if (listStatus === 'loading') return (
        <AdminLayout>
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Delivery Scheduler</h1>
                <p className="text-sm text-muted-foreground">Active orders grouped by delivery date.</p>
            </div>

            {/* Today */}
            <Section
                title={`Today — ${today}`}
                orders={todayOrders}
                emptyText="No deliveries scheduled for today."
                highlight
            />

            {/* Upcoming */}
            <div className="mt-8">
                <h2 className="mb-3 font-serif text-lg text-foreground">Upcoming</h2>
                {upcomingDates.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No upcoming deliveries.</p>
                ) : (
                    <div className="space-y-6">
                        {upcomingDates.map(d => (
                            <Section key={d} title={d} orders={grouped[d]} />
                        ))}
                    </div>
                )}
            </div>

            {/* Overdue */}
            {pastDates.length > 0 && (
                <div className="mt-8">
                    <h2 className="mb-3 font-serif text-lg text-foreground">Overdue</h2>
                    <div className="space-y-6">
                        {pastDates.map(d => (
                            <Section key={d} title={d} orders={grouped[d]} highlight />
                        ))}
                    </div>
                </div>
            )}

            {/* Unscheduled — no delivery_date set */}
            {unscheduled.length > 0 && (
                <div className="mt-8">
                    <h2 className="mb-3 font-serif text-lg text-foreground">No date set</h2>
                    <Section title="Unscheduled orders" orders={unscheduled} />
                </div>
            )}
        </AdminLayout>
    );
};

// ─── Section component ────────────────────────────────────────────────────────

const Section = ({
    title,
    orders,
    emptyText,
    highlight,
}: {
    title: string;
    orders: Order[];
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
                <span className="text-xs font-semibold text-muted-foreground">
                    {orders.length} order{orders.length > 1 ? 's' : ''}
                </span>
            </div>
            <ul className="divide-y divide-border">
                {orders.map(o => (
                    <li
                        key={o.id}
                        className={`flex flex-wrap items-center gap-3 px-5 py-3 ${highlight && o.is_urgent ? 'bg-destructive/5' : ''}`}
                    >
                        <Link
                            to={`/admin/orders/${o.id}`}
                            className="font-semibold text-foreground hover:text-primary"
                        >
                            #{o.id}
                        </Link>
                        {o.is_urgent && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase text-destructive">
                                <AlertTriangle className="h-3 w-3" /> Urgent
                            </span>
                        )}
                        <span className="text-sm text-foreground">{o.customer_name}</span>
                        <span className="text-sm text-muted-foreground">{o.customer_phone}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {o.delivery_address}
                        </span>
                        <span className="ml-auto flex items-center gap-3">
                            <StatusBadge status={o.status} />
                            <span className="font-semibold text-foreground">
                                {formatPesewas(o.total_pesewas)}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Deliveries;