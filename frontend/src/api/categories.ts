import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./client"
import type { Category, CategoryUpsert } from "./types"

const KEY = ["categories"]

export function useCategories() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => (await apiClient.get<Category[]>("/categories")).data,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CategoryUpsert) => (await apiClient.post<Category>("/categories", dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: CategoryUpsert }) =>
      (await apiClient.put(`/categories/${id}`, dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => (await apiClient.delete(`/categories/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
