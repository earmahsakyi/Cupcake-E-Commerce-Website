import { OrderStatus } from "@/store/types";

const styles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-muted text-muted-foreground",
};

const StatusBadge = ({ status }: { status: OrderStatus }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
    {status}
  </span>
);

export default StatusBadge;
