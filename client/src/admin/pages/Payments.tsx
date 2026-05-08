import { Link } from "react-router-dom";
import AdminLayout from "@/admin/AdminLayout";
import { paymentsStore } from "@/admin/store";
import { useStore } from "@/admin/useStore";
import { formatGHS } from "@/data/cakes";

const tone: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-destructive/10 text-destructive",
};

const Payments = () => {
  const payments = useStore(paymentsStore);
  const total = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Payments</h1>
          <p className="text-sm text-muted-foreground">{payments.length} transactions</p>
        </div>
        <div className="rounded-2xl bg-card border border-border px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total received</p>
          <p className="font-serif text-xl font-semibold text-primary">{formatGHS(total)}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Order ID</th>
              <th className="px-5 py-3 text-left">Reference</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/30">
                <td className="px-5 py-3">
                  <Link to={`/admin/orders/${p.orderId}`} className="font-medium text-foreground hover:text-primary">{p.orderId}</Link>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{p.reference}</td>
                <td className="px-5 py-3 text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tone[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3 text-right font-semibold text-foreground">{formatGHS(p.amount)}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No payments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Payments;
