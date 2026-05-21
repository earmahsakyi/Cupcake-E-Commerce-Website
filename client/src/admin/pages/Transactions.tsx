import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { formatPesewas } from "@/lib/utils";
import {
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    clearMutateError,
} from "@/store/slices/transactionsSlice";
import { Transaction, TransactionType } from "@/store/types";

// ─── Modal form state 
interface FormState {
    type: TransactionType;
    amount: string;          // user types in GHS, we convert to pesewas on submit
    description: string;
    recorded_at?: string;
}

const emptyForm = (): FormState => ({ type: "revenue", amount: "", description: "", recorded_at:"" });

const typeTone: Record<TransactionType, string> = {
    revenue: "bg-emerald-100 text-emerald-700",
    expense: "bg-destructive/10 text-destructive",
};

// ─── Component 
const Transactions = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const minDate = today.toISOString().slice(0, 10);
    const dispatch = useAppDispatch();
    const { items, status, error, mutating, mutateError } = useAppSelector(
        (s) => s.transactions
    );

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Transaction | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm());
    const [formError, setFormError] = useState<string | null>(null);

    // Confirm-delete state
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    // ─── Derived stats 
    const totalRevenue = items
        .filter((t) => t.type === "revenue")
        .reduce((s, t) => s + t.amount_pesewas, 0);

    const totalExpenses = items
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount_pesewas, 0);

    const netBalance = totalRevenue - totalExpenses;

    // ─── Modal helpers 
    const openCreate = () => {
        setEditTarget(null);
        setForm(emptyForm());
        setFormError(null);
        dispatch(clearMutateError());
        setModalOpen(true);
    };

    const openEdit = (t: Transaction) => {
        setEditTarget(t);
        setForm({
            type: t.type,
            amount: (t.amount_pesewas / 100).toFixed(2),
            description: t.description,
            recorded_at: t.recorded_at
        });
        setFormError(null);
        dispatch(clearMutateError());
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditTarget(null);
    };

    const handleSubmit = async () => {
        const amountPesewas = Math.round(parseFloat(form.amount) * 100);
        if (!form.description.trim() || !form.amount) {
            setFormError("Description is required and amount is required!");
            return;
        }
        if (isNaN(amountPesewas) || amountPesewas <= 0) {
            setFormError("Enter a valid amount.");
            return;
        }
        setFormError(null);

        if (editTarget) {
            const result = await dispatch(
                updateTransaction({
                    id: editTarget.id,
                    data: {
                        type: form.type,
                        amount_pesewas: amountPesewas,
                        description: form.description.trim(),
                        recorded_at: form.recorded_at,
                    },
                })
            );
            if (updateTransaction.fulfilled.match(result)) closeModal();
        } else {
            const result = await dispatch(
                createTransaction({
                    type: form.type,
                    amount_pesewas: amountPesewas,
                    description: form.description.trim(),
                    source: "manual",
                    recorded_at: form.recorded_at,
                })
            );
            if (createTransaction.fulfilled.match(result)) {
                dispatch(fetchTransactions());
                closeModal();
            }
        }
    };

    const handleDelete = async (id: number) => {
        await dispatch(deleteTransaction(id));
        setDeleteId(null);
    };

    // ─── Render 
    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Transactions</h1>
                    <p className="text-sm text-muted-foreground">{items.length} records</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                >
                    <Plus className="h-4 w-4" /> New entry
                </button>
            </div>

            {/* Summary cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <SummaryCard
                    label="Total Revenue"
                    value={formatPesewas(totalRevenue)}
                    icon={<TrendingUp className="h-5 w-5" />}
                    tone="bg-emerald-100 text-emerald-700"
                />
                <SummaryCard
                    label="Total Expenses"
                    value={formatPesewas(totalExpenses)}
                    icon={<TrendingDown className="h-5 w-5" />}
                    tone="bg-destructive/10 text-destructive"
                />
                <SummaryCard
                    label="Net Balance"
                    value={formatPesewas(netBalance)}
                    icon={<Wallet className="h-5 w-5" />}
                    tone={netBalance >= 0 ? "bg-primary-soft text-primary" : "bg-amber-100 text-amber-700"}
                />
            </div>

            {/* Loading */}
            {status === "loading" && (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}

            {/* Error */}
            {status === "failed" && (
                <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
            )}

            {/* Table */}
            {status !== "loading" && (
                <div className="rounded-2xl bg-card border border-border shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="px-5 py-3 text-left">Date</th>
                                <th className="px-5 py-3 text-left">Type</th>
                                <th className="px-5 py-3 text-left">Description</th>
                                <th className="px-5 py-3 text-left">Source</th>
                                <th className="px-5 py-3 text-right">Amount</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {items.map((t) => (
                                <tr key={t.id} className="hover:bg-secondary/30">
                                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                                        {new Date(t.recorded_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${typeTone[t.type]}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-foreground max-w-xs truncate">
                                        {t.description}
                                        {t.order_id && (
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                (Order #{t.order_id})
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground capitalize">{t.source}</td>
                                    <td className={`px-5 py-3 text-right font-semibold ${t.type === "revenue" ? "text-emerald-700" : "text-destructive"}`}>
                                        {t.type === "expense" ? "−" : "+"}{formatPesewas(t.amount_pesewas)}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        {t.source === "manual" ? (
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(t)}
                                                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(t.id)}
                                                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && status === "succeeded" && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                                        No transactions recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ─── Create / Edit Modal  */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-xl">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <h2 className="font-serif text-lg text-foreground">
                                {editTarget ? "Edit transaction" : "New transaction"}
                            </h2>
                            <button onClick={closeModal} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-4 px-6 py-5">
                            {/* Type */}
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Type
                                </label>
                                <div className="flex gap-2">
                                    {(["revenue", "expense"] as TransactionType[]).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setForm((f) => ({ ...f, type: t }))}
                                            className={`flex-1 rounded-xl py-2 text-sm font-medium capitalize transition-colors border ${
                                                form.type === t
                                                    ? t === "revenue"
                                                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                                                        : "bg-destructive/10 text-destructive border-destructive/30"
                                                    : "border-border text-muted-foreground hover:bg-secondary"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Amount (GHS)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={form.amount}
                                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Flour and butter supplies"
                                    value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Recorded_At
                                </label>
                                <input
                                    type='date'
                                    value={form.recorded_at}
                                    min={minDate}
                                    onChange={(e) => setForm((f) => ({ ...f, recorded_at: e.target.value }))}
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>

                            {/* Errors */}
                            {(formError || mutateError) && (
                                <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
                                    {formError || mutateError}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3 border-t border-border px-6 py-4">
                            <button
                                onClick={closeModal}
                                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={mutating}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity"
                            >
                                {mutating && <Loader2 className="h-4 w-4 animate-spin" />}
                                {editTarget ? "Save changes" : "Add entry"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Delete confirmation  */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-card border border-border shadow-xl p-6 space-y-4">
                        <h2 className="font-serif text-lg text-foreground">Delete transaction?</h2>
                        <p className="text-sm text-muted-foreground">
                            This action cannot be undone. The record will be permanently removed.
                        </p>
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                disabled={mutating}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-destructive py-2.5 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-60 transition-opacity"
                            >
                                {mutating && <Loader2 className="h-4 w-4 animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

// ─── SummaryCard helper 
const SummaryCard = ({
    label,
    value,
    icon,
    tone,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
    tone: string;
}) => (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-sm">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>{icon}</div>
        <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1 font-serif text-2xl font-semibold text-foreground">{value}</p>
    </div>
);

export default Transactions;