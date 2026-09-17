export type CategoryType = "Expense" | "Income"

export interface Category {
  id: number
  name: string
  type: CategoryType
  color: string
}

export type CategoryUpsert = Omit<Category, "id">

export interface CreditCard {
  id: number
  name: string
}

export type CreditCardUpsert = Omit<CreditCard, "id">

export interface FixedExpense {
  id: number
  name: string
  amount: number
  notes: string | null
  categoryId: number
  categoryName: string
  categoryColor: string
  startDate: string
  endDate: string | null
}

export interface FixedExpenseUpsert {
  name: string
  amount: number
  notes: string | null
  categoryId: number
  startDate: string
  endDate: string | null
}

export interface Income {
  id: number
  source: string
  amount: number
  notes: string | null
  categoryId: number
  categoryName: string
  categoryColor: string
  startDate: string
  endDate: string | null
}

export interface IncomeUpsert {
  source: string
  amount: number
  notes: string | null
  categoryId: number
  startDate: string
  endDate: string | null
}

export interface CreditCardExpense {
  id: number
  description: string
  amount: number
  date: string
  categoryId: number
  categoryName: string
  categoryColor: string
  creditCardId: number
  creditCardName: string
}

export interface CreditCardExpenseUpsert {
  description: string
  amount: number
  date: string
  categoryId: number
  creditCardId: number
}

export interface VariableExpense {
  id: number
  description: string
  amount: number
  date: string
  categoryId: number
  categoryName: string
  categoryColor: string
}

export interface VariableExpenseUpsert {
  description: string
  amount: number
  date: string
  categoryId: number
}

export interface CategoryBreakdownItem {
  categoryId: number
  categoryName: string
  categoryColor: string
  total: number
}

export interface DashboardSummary {
  year: number
  month: number
  totalIncome: number
  totalFixedExpenses: number
  totalVariableExpenses: number
  balance: number
  expenseByCategory: CategoryBreakdownItem[]
}
