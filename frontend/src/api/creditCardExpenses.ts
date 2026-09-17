import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./client"
import type { CreditCardExpense, CreditCardExpenseUpsert } from "./types"

const key = (year: number, month: number) => ["credit-card-expenses", year, month]

export function useCreditCardExpenses(year: number, month: number) {
  return useQuery({
    queryKey: key(year, month),
    queryFn: async () =>
      (await apiClient.get<CreditCardExpense[]>("/credit-card-expenses", { params: { year, month } })).data,
  })
}

export function useCreateCreditCardExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreditCardExpenseUpsert) =>
      (await apiClient.post<CreditCardExpense>("/credit-card-expenses", dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["credit-card-expenses"] }),
  })
}

export function useUpdateCreditCardExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: CreditCardExpenseUpsert }) =>
      (await apiClient.put(`/credit-card-expenses/${id}`, dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["credit-card-expenses"] }),
  })
}

export function useDeleteCreditCardExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => (await apiClient.delete(`/credit-card-expenses/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["credit-card-expenses"] }),
  })
}
