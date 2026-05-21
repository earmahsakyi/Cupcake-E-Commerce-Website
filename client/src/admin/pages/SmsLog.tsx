import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Loader2 } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { fetchSmsLogs } from "@/store/slices/smsSlice";

const triggerLabel: Record<string, string> = {
    manual: "Manual",
    payment: "Payment",
    out_for_delivery: "Out for delivery",
};

const triggerColor: Record<string, string> = {
    manual: "bg-blue-100 text-blue-700",
    payment: "bg-emerald-100 text-emerald-700",
    out_for_delivery: "bg-amber-100 text-amber-700",
};

const SmsLog = () => {
    const dispatch = useAppDispatch();
    const { logs, logsStatus, logsError } = useAppSelector(s => s.sms);

    useEffect(() => {
        dispatch(fetchSmsLogs());
    }, [dispatch]);

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="font-serif text-2xl text-foreground sm:text-3xl">SMS Log</h1>
                <p className="text-sm text-muted-foreground">
                    All SMS messages sent to customers.
                </p>
            </div>

            {/* Loading */}
            {logsStatus === 'loading' && (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}

            {/* Error */}
            {logsStatus === 'failed' && (
                <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {logsError}
                </p>
            )}

            {/* Empty state */}
            {logsStatus === 'succeeded' && logs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
                    <MessageSquare className="mx-auto mb-3 h-8 w-8 opacity-50" />
                    No SMS messages yet.
                </div>
            )}

            {/* Log list */}
            {logs.length > 0 && (
                <ul className="space-y-3">
                    {logs.map((m) => (
                        <li key={m.id} className="rounded-2xl bg-card border border-border p-4 shadow-sm">
                            <div className="flex flex-wrap items-center gap-2">
                                <Link
                                    to={`/admin/orders/${m.order_id}`}
                                    className="font-semibold text-foreground hover:text-primary"
                                >
                                    Order #{m.order_id}
                                </Link>
                                {m.customer_name && (
                                    <span className="text-sm text-muted-foreground">— {m.customer_name}</span>
                                )}
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${triggerColor[m.trigger_type] ?? 'bg-secondary text-foreground'}`}>
                                    {triggerLabel[m.trigger_type] ?? m.trigger_type}
                                </span>
                                <span className="text-xs text-muted-foreground">to {m.phone}</span>
                                <span className="ml-auto text-xs text-muted-foreground">
                                    {new Date(m.sent_at).toLocaleString()}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-foreground">{m.message}</p>
                        </li>
                    ))}
                </ul>
            )}
        </AdminLayout>
    );
};

export default SmsLog;
