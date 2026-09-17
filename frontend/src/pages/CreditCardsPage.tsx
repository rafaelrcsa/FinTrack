import { useState } from "react"
import {
  useCreateCreditCard,
  useCreditCards,
  useDeleteCreditCard,
  useUpdateCreditCard,
} from "../api/creditCards"
import type { CreditCard, CreditCardUpsert } from "../api/types"
import { Button } from "../components/ui/Button"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { EmptyState } from "../components/ui/EmptyState"
import { FieldWrapper, Input } from "../components/ui/Field"
import { Modal } from "../components/ui/Modal"

const EMPTY_FORM: CreditCardUpsert = { name: "" }

export function CreditCardsPage() {
  const { data: cards, isLoading } = useCreditCards()
  const createCard = useCreateCreditCard()
  const updateCard = useUpdateCreditCard()
  const deleteCard = useDeleteCreditCard()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<CreditCardUpsert>(EMPTY_FORM)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(card: CreditCard) {
    setEditingId(card.id)
    setForm({ name: card.name })
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingId) {
      await updateCard.mutateAsync({ id: editingId, dto: form })
    } else {
      await createCard.mutateAsync(form)
    }
    setModalOpen(false)
  }

  const isSaving = createCard.isPending || updateCard.isPending

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Cartões de Crédito</h1>
        <Button onClick={openCreate}>+ Novo cartão</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Carregando...</p>
      ) : !cards?.length ? (
        <EmptyState title="Nenhum cartão cadastrado" description="Adicione seus cartões para lançar despesas variáveis." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="font-medium text-slate-800">{card.name}</span>
              <div>
                <Button variant="ghost" onClick={() => openEdit(card)}>
                  Editar
                </Button>
                <Button variant="ghost" onClick={() => setDeletingId(card.id)}>
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editingId ? "Editar cartão" : "Novo cartão"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldWrapper label="Nome">
            <Input
              required
              placeholder="Ex: Nubank"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
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
        title="Excluir cartão"
        message="Tem certeza? Todas as despesas vinculadas a este cartão também serão removidas."
        isLoading={deleteCard.isPending}
        onCancel={() => setDeletingId(null)}
        onConfirm={async () => {
          if (deletingId) await deleteCard.mutateAsync(deletingId)
          setDeletingId(null)
        }}
      />
    </div>
  )
}
