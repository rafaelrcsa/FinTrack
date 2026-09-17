import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useDashboardSummary, useDashboardTrend } from "../api/dashboard"
import { Card } from "../components/ui/Card"
import { EmptyState } from "../components/ui/EmptyState"
import { StatTile } from "../components/ui/StatTile"
import { useMonth } from "../context/MonthContext"
import { formatCurrency, monthName } from "../lib/format"

const INCOME_COLOR = "#008300"
const EXPENSE_COLOR = "#e34948"

export function DashboardPage() {
  const { year, month } = useMonth()
  const { data: summary, isLoading } = useDashboardSummary(year, month)
  const { data: trend } = useDashboardTrend(year, month, 6)

  const trendData = trend?.map((s) => ({
    label: `${monthName(s.month).slice(0, 3)}/${String(s.year).slice(2)}`,
    Receitas: s.totalIncome,
    Despesas: s.totalFixedExpenses + s.totalVariableExpenses,
  }))

  if (isLoading || !summary) {
    return <p className="text-sm text-slate-400">Carregando...</p>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Receitas" value={formatCurrency(summary.totalIncome)} tone="positive" />
        <StatTile label="Despesas Fixas" value={formatCurrency(summary.totalFixedExpenses)} />
        <StatTile label="Despesas Variáveis" value={formatCurrency(summary.totalVariableExpenses)} />
        <StatTile
          label="Saldo"
          value={formatCurrency(summary.balance)}
          tone={summary.balance >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Despesas por categoria</h2>
          {!summary.expenseByCategory.length ? (
            <EmptyState title="Sem despesas neste mês" />
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(220, summary.expenseByCategory.length * 40)}>
              <BarChart
                data={summary.expenseByCategory}
                layout="vertical"
                margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
                barCategoryGap={12}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e0d9" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => formatCurrency(v)}
                  tick={{ fill: "#898781", fontSize: 12 }}
                  axisLine={{ stroke: "#c3c2b7" }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="categoryName"
                  width={140}
                  tick={{ fill: "#52514e", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: 8, borderColor: "#e1e0d9", fontSize: 13 }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={24}>
                  {summary.expenseByCategory.map((entry) => (
                    <Cell key={entry.categoryId} fill={entry.categoryColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Receitas vs. despesas (6 meses)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e0d9" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#898781", fontSize: 12 }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
              <YAxis
                tickFormatter={(v: number) => formatCurrency(v)}
                tick={{ fill: "#898781", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ borderRadius: 8, borderColor: "#e1e0d9", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Line type="monotone" dataKey="Receitas" stroke={INCOME_COLOR} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Despesas" stroke={EXPENSE_COLOR} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
