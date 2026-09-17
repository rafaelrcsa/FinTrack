import { useQuery } from "@tanstack/react-query"
import { apiClient } from "./client"
import type { DashboardSummary } from "./types"

export function useDashboardSummary(year: number, month: number) {
  return useQuery({
    queryKey: ["dashboard-summary", year, month],
    queryFn: async () =>
      (await apiClient.get<DashboardSummary>("/dashboard/summary", { params: { year, month } })).data,
  })
}

function lastMonths(year: number, month: number, count: number): { year: number; month: number }[] {
  const result: { year: number; month: number }[] = []
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(year, month - 1 - i, 1)
    result.push({ year: date.getFullYear(), month: date.getMonth() + 1 })
  }
  return result
}

export function useDashboardTrend(year: number, month: number, monthsBack = 6) {
  const months = lastMonths(year, month, monthsBack)

  return useQuery({
    queryKey: ["dashboard-trend", year, month, monthsBack],
    queryFn: async () => {
      const summaries = await Promise.all(
        months.map((m) =>
          apiClient
            .get<DashboardSummary>("/dashboard/summary", { params: m })
            .then((r) => r.data),
        ),
      )
      return summaries
    },
  })
}
