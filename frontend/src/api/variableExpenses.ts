import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./client"
import type { VariableExpense, VariableExpenseUpsert } from "./types"

const key = (year: number, month: number) => ["variable-expenses", year, month]

export function useVariableExpenses(year: number, month: number) {
  return useQuery({
    queryKey: key(year, month),
    queryFn: async () =>
      (await apiClient.get<VariableExpense[]>("/variable-expenses", { params: { year, month } })).data,
  })
}

export function useCreateVariableExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: VariableExpenseUpsert) =>
      (await apiClient.post<VariableExpense>("/variable-expenses", dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["variable-expenses"] }),
  })
}

export function useUpdateVariableExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: VariableExpenseUpsert }) =>
      (await apiClient.put(`/variable-expenses/${id}`, dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["variable-expenses"] }),
  })
}

export function useDeleteVariableExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => (await apiClient.delete(`/variable-expenses/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["variable-expenses"] }),
  })
}
