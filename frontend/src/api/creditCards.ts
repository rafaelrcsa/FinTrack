import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./client"
import type { CreditCard, CreditCardUpsert } from "./types"

const KEY = ["credit-cards"]

export function useCreditCards() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => (await apiClient.get<CreditCard[]>("/credit-cards")).data,
  })
}

export function useCreateCreditCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreditCardUpsert) => (await apiClient.post<CreditCard>("/credit-cards", dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateCreditCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: CreditCardUpsert }) =>
      (await apiClient.put(`/credit-cards/${id}`, dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteCreditCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => (await apiClient.delete(`/credit-cards/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
