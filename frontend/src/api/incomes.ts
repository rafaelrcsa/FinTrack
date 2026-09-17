import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./client"
import type { Income, IncomeUpsert } from "./types"

const key = (year: number, month: number) => ["incomes", year, month]

export function useIncomes(year: number, month: number) {
  return useQuery({
    queryKey: key(year, month),
    queryFn: async () => (await apiClient.get<Income[]>("/incomes", { params: { year, month } })).data,
  })
}

export function useCreateIncome() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: IncomeUpsert) => (await apiClient.post<Income>("/incomes", dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incomes"] }),
  })
}

export function useUpdateIncome() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: IncomeUpsert }) =>
      (await apiClient.put(`/incomes/${id}`, dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incomes"] }),
  })
}

export function useDeleteIncome() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => (await apiClient.delete(`/incomes/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incomes"] }),
  })
}
