import { useState } from "react"
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../api/categories"
import type { Category, CategoryType, CategoryUpsert } from "../api/types"
import { Button } from "../components/ui/Button"
import { CategoryBadge } from "../components/ui/CategoryBadge"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { EmptyState } from "../components/ui/EmptyState"
import { FieldWrapper, Input, Select } from "../components/ui/Field"
import { Modal } from "../components/ui/Modal"

const EMPTY_FORM: CategoryUpsert = { name: "", type: "Expense", color: "#6366F1" }

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<CategoryUpsert>(EMPTY_FORM)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(category: Category) {
    setEditingId(category.id)
    setForm({ name: category.name, type: category.type, color: category.color })
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingId) {
      await updateCategory.mutateAsync({ id: editingId, dto: form })
    } else {
      await createCategory.mutateAsync(form)
    }
    setModalOpen(false)
  }

  const isSaving = createCategory.isPending || updateCategory.isPending

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Categorias</h1>
        <Button onClick={openCreate}>+ Nova categoria</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Carregando...</p>
      ) : !categories?.length ? (
        <EmptyState title="Nenhuma categoria ainda" description="Crie categorias para organizar despesas e receitas." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-3">
                    <CategoryBadge name={category.name} color={category.color} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {category.type === "Expense" ? "Despesa" : "Receita"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" onClick={() => openEdit(category)}>
                      Editar
                    </Button>
                    <Button variant="ghost" onClick={() => setDeletingId(category.id)}>
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editingId ? "Editar categoria" : "Nova categoria"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldWrapper label="Nome">
            <Input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </FieldWrapper>
          <FieldWrapper label="Tipo">
            <Select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CategoryType }))}
            >
              <option value="Expense">Despesa</option>
              <option value="Income">Receita</option>
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Cor">
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              className="h-10 w-16 cursor-pointer rounded-md border border-slate-300"
            />
          </FieldWrapper>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deletingId !== null}
        title="Excluir categoria"
        message="Tem certeza? Essa ação não pode ser desfeita."
        isLoading={deleteCategory.isPending}
        onCancel={() => setDeletingId(null)}
        onConfirm={async () => {
          if (deletingId) await deleteCategory.mutateAsync(deletingId)
          setDeletingId(null)
        }}
      />
    </div>
  )
}
