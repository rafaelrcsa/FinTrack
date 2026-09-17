import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./client"
import type { FixedExpense, FixedExpenseUpsert } from "./types"

const key = (year: number, month: number) => ["fixed-expenses", year, month]

export function useFixedExpenses(year: number, month: number) {
  return useQuery({
    queryKey: key(year, month),
    queryFn: async () =>
      (await apiClient.get<FixedExpense[]>("/fixed-expenses", { params: { year, month } })).data,
  })
}

export function useCreateFixedExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: FixedExpenseUpsert) => (await apiClient.post<FixedExpense>("/fixed-expenses", dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fixed-expenses"] }),
  })
}

export function useUpdateFixedExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: FixedExpenseUpsert }) =>
      (await apiClient.put(`/fixed-expenses/${id}`, dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fixed-expenses"] }),
  })
}

export function useDeleteFixedExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => (await apiClient.delete(`/fixed-expenses/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fixed-expenses"] }),
  })
}
