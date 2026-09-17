const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

export function monthName(month: number): string {
  return MONTH_NAMES[month - 1]
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number)
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
