/**
 * MonthlyExpensesChart
 * Drop this into Overview.tsx inside the charts grid.
 *
 * Usage:
 *   import MonthlyExpensesChart from "@/admin/components/MonthlyExpensesChart";
 *   // inside the lg:grid-cols-2 section in Overview:
 *   <MonthlyExpensesChart />
 *
 * It reads from state.transactions so make sure transactionsSlice is wired
 * into your Redux store and fetchTransactions is dispatched (this component
 * does it itself on mount).
 */

import { useEffect } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { fetchTransactions } from "@/store/slices/transactionsSlice";
import { formatPesewas } from "@/lib/utils";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildMonthlyExpenses(
    transactions: { type: string; amount_pesewas: number; recorded_at: string }[]
) {
    const now = new Date();
    const buckets: { key: string; label: string; expenses: number }[] = [];

    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        buckets.push({ key, label: MONTHS[d.getMonth()], expenses: 0 });
    }

    const map = new Map(buckets.map((b) => [b.key, b]));

    transactions.forEach((t) => {
        if (t.type !== "expense") return;
        const key = t.recorded_at.slice(0, 7);
        const b = map.get(key);
        if (b) b.expenses += t.amount_pesewas;
    });

    return buckets;
}

const MonthlyExpensesChart = () => {
    const dispatch = useAppDispatch();
    const { items, status } = useAppSelector((s) => s.transactions);

    useEffect(() => {
        if (status === "idle") dispatch(fetchTransactions());
    }, [dispatch, status]);

    const data = buildMonthlyExpenses(items);
    const hasData = data.some((d) => d.expenses > 0);

    return (
        <div className="rounded-2xl bg-card p-5 shadow-sm border border-border">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="font-serif text-lg text-foreground">Expenses per month</h2>
                    <p className="text-xs text-muted-foreground">Manual expense entries, last 12 months</p>
                </div>
                <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                    GHS
                </span>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="label"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            width={50}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: 12,
                                fontSize: 12,
                            }}
                            cursor={{ fill: "hsl(var(--secondary))", opacity: 0.4 }}
                            formatter={(value: number) => [formatPesewas(value), "Expenses"]}
                        />
                        <Bar
                            dataKey="expenses"
                            fill="hsl(var(--destructive))"
                            radius={[6, 6, 0, 0]}
                            opacity={0.8}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {!hasData && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                    No expense entries yet — chart will populate as you log expenses.
                </p>
            )}
        </div>
    );
};

export default MonthlyExpensesChart;