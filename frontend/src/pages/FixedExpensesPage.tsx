import { useState, type FormEvent } from "react"
import { useCategories } from "../api/categories"
import {
  useCreateFixedExpense,
  useDeleteFixedExpense,
  useFixedExpenses,
  useUpdateFixedExpense,
} from "../api/fixedExpenses"
import type { FixedExpense, FixedExpenseUpsert } from "../api/types"
import { Button } from "../components/ui/Button"
import { CategoryBadge } from "../components/ui/CategoryBadge"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { EmptyState } from "../components/ui/EmptyState"
import { AmountInput, FieldWrapper, Input, Select, Textarea } from "../components/ui/Field"
import { Modal } from "../components/ui/Modal"
import { useMonth } from "../context/MonthContext"
import { formatCurrency, formatDate, toIsoDate } from "../lib/format"

function emptyForm(firstCategoryId: number): FixedExpenseUpsert {
  return {
    name: "",
    amount: 0,
    notes: null,
    categoryId: firstCategoryId,
    startDate: toIsoDate(new Date()),
    endDate: null,
  }
}

export function FixedExpensesPage() {
  const { year, month } = useMonth()
  const { data: expenses, isLoading } = useFixedExpenses(year, month)
  const { data: categories } = useCategories()
  const expenseCategories = categories?.filter((c) => c.type === "Expense") ?? []

  const createExpense = useCreateFixedExpense()
  const updateExpense = useUpdateFixedExpense()
  const deleteExpense = useDeleteFixedExpense()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FixedExpenseUpsert>(emptyForm(0))
  const [hasEndDate, setHasEndDate] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm(expenseCategories[0]?.id ?? 0))
    setHasEndDate(false)
    setModalOpen(true)
  }

  function openEdit(expense: FixedExpense) {
    setEditingId(expense.id)
    setForm({
      name: expense.name,
      amount: expense.amount,
      notes: expense.notes,
      categoryId: expense.categoryId,
      startDate: expense.startDate,
      endDate: expense.endDate,
    })
    setHasEndDate(expense.endDate !== null)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const dto: FixedExpenseUpsert = { ...form, endDate: hasEndDate ? form.endDate : null }
    if (editingId) {
      await updateExpense.mutateAsync({ id: editingId, dto })
    } else {
      await createExpense.mutateAsync(dto)
    }
    setModalOpen(false)
  }

  const isSaving = createExpense.isPending || updateExpense.isPending
  const total = expenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Despesas Fixas</h1>
          <p className="text-sm text-slate-500">Total do mês: {formatCurrency(total)}</p>
        </div>
        <Button onClick={openCreate}>+ Nova despesa fixa</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Carregando...</p>
      ) : !expenses?.length ? (
        <EmptyState title="Nenhuma despesa fixa neste mês" description="Cadastre aluguel, contas e assinaturas recorrentes." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Recorrência</th>
                <th className="px-4 py-3 text-right font-medium">Valor</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{expense.name}</td>
                  <td className="px-4 py-3">
                    <CategoryBadge name={expense.categoryName} color={expense.categoryColor} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {expense.endDate ? `Até ${formatDate(expense.endDate)}` : "Contínua"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" onClick={() => openEdit(expense)}>
                      Editar
                    </Button>
                    <Button variant="ghost" onClick={() => setDeletingId(expense.id)}>
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editingId ? "Editar despesa fixa" : "Nova despesa fixa"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldWrapper label="Nome">
            <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </FieldWrapper>
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Valor (R$)">
              <AmountInput required value={form.amount} onChange={(amount) => setForm((f) => ({ ...f, amount }))} />
            </FieldWrapper>
            <FieldWrapper label="Categoria">
              <Select
                required
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: Number(e.target.value) }))}
              >
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
          </div>
          <FieldWrapper label="Dia de vencimento (data de início)">
            <Input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            />
          </FieldWrapper>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={hasEndDate}
                onChange={(e) => setHasEndDate(e.target.checked)}
                className="rounded border-slate-300"
              />
              Essa despesa termina em algum mês
            </label>
            {hasEndDate && (
              <div className="mt-2">
                <FieldWrapper label="Último mês em que ela ocorre">
                  <Input
                    required
                    type="date"
                    value={form.endDate ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  />
                </FieldWrapper>
              </div>
            )}
          </div>
          <FieldWrapper label="Notas (opcional)">
            <Textarea
              value={form.notes ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value || null }))}
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
        title="Excluir despesa fixa"
        message="Tem certeza? Essa ação não pode ser desfeita."
        isLoading={deleteExpense.isPending}
        onCancel={() => setDeletingId(null)}
        onConfirm={async () => {
          if (deletingId) await deleteExpense.mutateAsync(deletingId)
          setDeletingId(null)
        }}
      />
    </div>
  )
}
