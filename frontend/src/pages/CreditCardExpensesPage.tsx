import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useCategories } from "../api/categories"
import {
  useCreateCreditCardExpense,
  useCreditCardExpenses,
  useDeleteCreditCardExpense,
  useUpdateCreditCardExpense,
} from "../api/creditCardExpenses"
import { useCreditCards } from "../api/creditCards"
import type { CreditCardExpense, CreditCardExpenseUpsert } from "../api/types"
import { Button } from "../components/ui/Button"
import { CategoryBadge } from "../components/ui/CategoryBadge"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { EmptyState } from "../components/ui/EmptyState"
import { AmountInput, FieldWrapper, Input, Select } from "../components/ui/Field"
import { Modal } from "../components/ui/Modal"
import { useMonth } from "../context/MonthContext"
import { formatCurrency, formatDate, toIsoDate } from "../lib/format"

function emptyForm(categoryId: number, cardId: number): CreditCardExpenseUpsert {
  return { description: "", amount: 0, date: toIsoDate(new Date()), categoryId, creditCardId: cardId }
}

export function CreditCardExpensesPage() {
  const { year, month } = useMonth()
  const [cardFilter, setCardFilter] = useState<number | "all">("all")

  const { data: expenses, isLoading } = useCreditCardExpenses(year, month)
  const { data: categories } = useCategories()
  const { data: cards } = useCreditCards()
  const expenseCategories = categories?.filter((c) => c.type === "Expense") ?? []

  const createExpense = useCreateCreditCardExpense()
  const updateExpense = useUpdateCreditCardExpense()
  const deleteExpense = useDeleteCreditCardExpense()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<CreditCardExpenseUpsert>(emptyForm(0, 0))
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [savedMessage, setSavedMessage] = useState(false)

  const filteredExpenses = useMemo(
    () => expenses?.filter((e) => cardFilter === "all" || e.creditCardId === cardFilter) ?? [],
    [expenses, cardFilter],
  )

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm(expenseCategories[0]?.id ?? 0, cards?.[0]?.id ?? 0))
    setSavedMessage(false)
    setModalOpen(true)
  }

  function openEdit(expense: CreditCardExpense) {
    setEditingId(expense.id)
    setForm({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      categoryId: expense.categoryId,
      creditCardId: expense.creditCardId,
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
      setForm({ ...emptyForm(form.categoryId, form.creditCardId), date: form.date })
      setSavedMessage(true)
    }
  }

  useEffect(() => {
    if (!savedMessage) return
    const timer = setTimeout(() => setSavedMessage(false), 3000)
    return () => clearTimeout(timer)
  }, [savedMessage])

  const isSaving = createExpense.isPending || updateExpense.isPending
  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
  const noCards = !cards?.length

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Cartão de Crédito</h1>
          <p className="text-sm text-slate-500">Total do mês: {formatCurrency(total)}</p>
        </div>
        <div className="flex items-center gap-2">
          {cards && cards.length > 0 && (
            <Select
              value={cardFilter}
              onChange={(e) => setCardFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="!w-auto"
            >
              <option value="all">Todos os cartões</option>
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          )}
          <Button onClick={openCreate} disabled={noCards}>
            + Nova despesa
          </Button>
        </div>
      </div>

      {noCards && (
        <p className="mb-4 text-sm text-amber-600">
          Cadastre pelo menos um cartão na página "Cartões" antes de lançar despesas.
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-400">Carregando...</p>
      ) : !filteredExpenses.length ? (
        <EmptyState title="Nenhuma despesa neste mês" description="Lance suas compras variáveis no cartão de crédito." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Cartão</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 text-right font-medium">Valor</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{expense.description}</td>
                  <td className="px-4 py-3">
                    <CategoryBadge name={expense.categoryName} color={expense.categoryColor} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{expense.creditCardName}</td>
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
          <div className="grid grid-cols-2 gap-4">
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
            <FieldWrapper label="Cartão">
              <Select
                required
                value={form.creditCardId}
                onChange={(e) => setForm((f) => ({ ...f, creditCardId: Number(e.target.value) }))}
              >
                {cards?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
          </div>
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
