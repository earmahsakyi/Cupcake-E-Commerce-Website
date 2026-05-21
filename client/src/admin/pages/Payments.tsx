import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { fetchPayments } from "@/store/slices/paymentsSlice";
import { formatPesewas } from "@/lib/utils";

const tone: Record<string, string> = {
    success: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    failed: "bg-destructive/10 text-destructive",
};

const networkLabel: Record<string, string> = {
    mtn: "MTN",
    vod: "Telecel",
    tgo: "AirtelTigo",
};

const Payments = () => {
    const dispatch = useAppDispatch();
    const { items: payments, status, error } = useAppSelector(s => s.payments);

    useEffect(() => {
        dispatch(fetchPayments());
    }, [dispatch]);

    const totalReceived = payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + p.amount_pesewas, 0);

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Payments</h1>
                    <p className="text-sm text-muted-foreground">{payments.length} records</p>
                </div>
                <div className="rounded-2xl bg-card border border-border px-4 py-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Total received</p>
                    <p className="font-serif text-xl font-semibold text-primary">
                        {formatPesewas(totalReceived)}
                    </p>
                </div>
            </div>

            {/* Loading */}
            {status === 'loading' && (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}

            {/* Error */}
            {status === 'failed' && (
                <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </p>
            )}

            {/* Table */}
            {status !== 'loading' && (
                <div className="rounded-2xl bg-card border border-border shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="px-5 py-3 text-left">Order</th>
                                <th className="px-5 py-3 text-left">Customer</th>
                                <th className="px-5 py-3 text-left">Reference</th>
                                <th className="px-5 py-3 text-left">Network</th>
                                <th className="px-5 py-3 text-left">Date</th>
                                <th className="px-5 py-3 text-left">Status</th>
                                <th className="px-5 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {payments.map((p) => (
                                <tr key={p.id} className="hover:bg-secondary/30">
                                    <td className="px-5 py-3">
                                        <Link
                                            to={`/admin/orders/${p.order_id}`}
                                            className="font-medium text-foreground hover:text-primary"
                                        >
                                            #{p.order_id}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">
                                        {p.customer_name ?? '—'}
                                    </td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                                        {p.paystack_reference}
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">
                                        {networkLabel[p.momo_network] ?? p.momo_network}
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">
                                        {p.paid_at
                                            ? new Date(p.paid_at).toLocaleString()
                                            : '—'
                                        }
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tone[p.status]}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right font-semibold text-foreground">
                                        {formatPesewas(p.amount_pesewas)}
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && status === 'succeeded' && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                                        No payments yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default Payments;