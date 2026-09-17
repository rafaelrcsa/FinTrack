import { useEffect, useState, type FormEvent } from "react"
import { useCategories } from "../api/categories"
import {
  useCreateVariableExpense,
  useDeleteVariableExpense,
  useUpdateVariableExpense,
  useVariableExpenses,
} from "../api/variableExpenses"
import type { VariableExpense, VariableExpenseUpsert } from "../api/types"
import { Button } from "../components/ui/Button"
import { CategoryBadge } from "../components/ui/CategoryBadge"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { EmptyState } from "../components/ui/EmptyState"
import { AmountInput, FieldWrapper, Input, Select } from "../components/ui/Field"
import { Modal } from "../components/ui/Modal"
import { useMonth } from "../context/MonthContext"
import { formatCurrency, formatDate, toIsoDate } from "../lib/format"

function emptyForm(categoryId: number): VariableExpenseUpsert {
  return { description: "", amount: 0, date: toIsoDate(new Date()), categoryId }
}

export function VariableExpensesPage() {
  const { year, month } = useMonth()

  const { data: expenses, isLoading } = useVariableExpenses(year, month)
  const { data: categories } = useCategories()
  const expenseCategories = categories?.filter((c) => c.type === "Expense") ?? []

  const createExpense = useCreateVariableExpense()
  const updateExpense = useUpdateVariableExpense()
  const deleteExpense = useDeleteVariableExpense()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<VariableExpenseUpsert>(emptyForm(0))
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [savedMessage, setSavedMessage] = useState(false)

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm(expenseCategories[0]?.id ?? 0))
    setSavedMessage(false)
    setModalOpen(true)
  }

  function openEdit(expense: VariableExpense) {
    setEditingId(expense.id)
    setForm({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      categoryId: expense.categoryId,
    })
    setSavedMessage(false)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSavedMessage(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (editingId) {
      await updateExpense.mutateAsync({ id: editingId, dto: form })
      setModalOpen(false)
    } else {
      await createExpense.mutateAsync(form)
      setForm({ ...emptyForm(form.categoryId), date: form.date })
      setSavedMessage(true)
    }
  }

  useEffect(() => {
    if (!savedMessage) return
    const timer = setTimeout(() => setSavedMessage(false), 3000)
    return () => clearTimeout(timer)
  }, [savedMessage])

  const isSaving = createExpense.isPending || updateExpense.isPending
  const total = expenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Despesas Variáveis</h1>
          <p className="text-sm text-slate-500">Total do mês: {formatCurrency(total)}</p>
        </div>
        <Button onClick={openCreate}>+ Nova despesa</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Carregando...</p>
      ) : !expenses?.length ? (
        <EmptyState
          title="Nenhuma despesa variável neste mês"
          description="Lance gastos avulsos pagos em dinheiro, débito ou transferência."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 text-right font-medium">Valor</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{expense.description}</td>
                  <td className="px-4 py-3">
                    <CategoryBadge name={expense.categoryName} color={expense.categoryColor} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(expense.date)}</td>
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

      <Modal open={modalOpen} title={editingId ? "Editar despesa" : "Nova despesa"} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {savedMessage && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              Despesa salva com sucesso!
            </p>
          )}
          <FieldWrapper label="Descrição">
            <Input
              required
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </FieldWrapper>
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Valor (R$)">
              <AmountInput required value={form.amount} onChange={(amount) => setForm((f) => ({ ...f, amount }))} />
            </FieldWrapper>
            <FieldWrapper label="Data">
              <Input
                required
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </FieldWrapper>
          </div>
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
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
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
        title="Excluir despesa"
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
