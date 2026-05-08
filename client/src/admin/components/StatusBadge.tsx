import { OrderStatus } from "@/admin/types";

const styles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Preparing: "bg-blue-100 text-blue-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-muted text-muted-foreground",
};

const StatusBadge = ({ status }: { status: OrderStatus }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
    {status}
  </span>
);

export default StatusBadge;
