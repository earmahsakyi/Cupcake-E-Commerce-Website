import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import { smsStore } from "@/admin/store";
import { useStore } from "@/admin/useStore";

const triggerLabel: Record<string, string> = {
  manual: "Manual",
  payment: "Payment",
  out_for_delivery: "Out for delivery",
};

const SmsLog = () => {
  const log = useStore(smsStore);
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">SMS Log</h1>
        <p className="text-sm text-muted-foreground">All SMS messages sent (simulated).</p>
      </div>
      {log.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          <MessageSquare className="mx-auto mb-3 h-8 w-8 opacity-50" />
          No SMS messages yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {log.map((m) => (
            <li key={m.id} className="rounded-2xl bg-card border border-border p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Link to={`/admin/orders/${m.orderId}`} className="font-semibold text-foreground hover:text-primary">{m.orderId}</Link>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-foreground">{triggerLabel[m.trigger]}</span>
                <span className="text-xs text-muted-foreground">to {m.phone}</span>
                <span className="ml-auto text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</span>
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
