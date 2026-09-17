import { useState, type FormEvent } from "react"
import { useCategories } from "../api/categories"
import { useCreateIncome, useDeleteIncome, useIncomes, useUpdateIncome } from "../api/incomes"
import type { Income, IncomeUpsert } from "../api/types"
import { Button } from "../components/ui/Button"
import { CategoryBadge } from "../components/ui/CategoryBadge"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { EmptyState } from "../components/ui/EmptyState"
import { AmountInput, FieldWrapper, Input, Select, Textarea } from "../components/ui/Field"
import { Modal } from "../components/ui/Modal"
import { useMonth } from "../context/MonthContext"
import { formatCurrency, formatDate, toIsoDate } from "../lib/format"

function emptyForm(firstCategoryId: number): IncomeUpsert {
  return {
    source: "",
    amount: 0,
    notes: null,
    categoryId: firstCategoryId,
    startDate: toIsoDate(new Date()),
    endDate: null,
  }
}

export function IncomePage() {
  const { year, month } = useMonth()
  const { data: incomes, isLoading } = useIncomes(year, month)
  const { data: categories } = useCategories()
  const incomeCategories = categories?.filter((c) => c.type === "Income") ?? []

  const createIncome = useCreateIncome()
  const updateIncome = useUpdateIncome()
  const deleteIncome = useDeleteIncome()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<IncomeUpsert>(emptyForm(0))
  const [hasEndDate, setHasEndDate] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm(incomeCategories[0]?.id ?? 0))
    setHasEndDate(false)
    setModalOpen(true)
  }

  function openEdit(income: Income) {
    setEditingId(income.id)
    setForm({
      source: income.source,
      amount: income.amount,
      notes: income.notes,
      categoryId: income.categoryId,
      startDate: income.startDate,
      endDate: income.endDate,
    })
    setHasEndDate(income.endDate !== null)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const dto: IncomeUpsert = { ...form, endDate: hasEndDate ? form.endDate : null }
    if (editingId) {
      await updateIncome.mutateAsync({ id: editingId, dto })
    } else {
      await createIncome.mutateAsync(dto)
    }
    setModalOpen(false)
  }

  const isSaving = createIncome.isPending || updateIncome.isPending
  const total = incomes?.reduce((sum, e) => sum + e.amount, 0) ?? 0

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Renda</h1>
          <p className="text-sm text-slate-500">Total do mês: {formatCurrency(total)}</p>
        </div>
        <Button onClick={openCreate}>+ Nova renda</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Carregando...</p>
      ) : !incomes?.length ? (
        <EmptyState title="Nenhuma renda neste mês" description="Cadastre salário e outras fontes de renda." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Origem</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Recorrência</th>
                <th className="px-4 py-3 text-right font-medium">Valor</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incomes.map((income) => (
                <tr key={income.id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{income.source}</td>
                  <td className="px-4 py-3">
                    <CategoryBadge name={income.categoryName} color={income.categoryColor} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {income.endDate ? `Até ${formatDate(income.endDate)}` : "Contínua"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600">
                    {formatCurrency(income.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" onClick={() => openEdit(income)}>
                      Editar
                    </Button>
                    <Button variant="ghost" onClick={() => setDeletingId(income.id)}>
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editingId ? "Editar renda" : "Nova renda"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldWrapper label="Origem">
            <Input required value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} />
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
                {incomeCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
          </div>
          <FieldWrapper label="Data de recebimento (início)">
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
              Essa renda termina em algum mês (ou é única)
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
        title="Excluir renda"
        message="Tem certeza? Essa ação não pode ser desfeita."
        isLoading={deleteIncome.isPending}
        onCancel={() => setDeletingId(null)}
        onConfirm={async () => {
          if (deletingId) await deleteIncome.mutateAsync(deletingId)
          setDeletingId(null)
        }}
      />
    </div>
  )
}
