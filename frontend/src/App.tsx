import { Route, Routes } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { CategoriesPage } from "./pages/CategoriesPage"
import { CreditCardExpensesPage } from "./pages/CreditCardExpensesPage"
import { CreditCardsPage } from "./pages/CreditCardsPage"
import { DashboardPage } from "./pages/DashboardPage"
import { FixedExpensesPage } from "./pages/FixedExpensesPage"
import { IncomePage } from "./pages/IncomePage"
import { VariableExpensesPage } from "./pages/VariableExpensesPage"

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/despesas-fixas" element={<FixedExpensesPage />} />
        <Route path="/cartao-de-credito" element={<CreditCardExpensesPage />} />
        <Route path="/despesas-variaveis" element={<VariableExpensesPage />} />
        <Route path="/renda" element={<IncomePage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/cartoes" element={<CreditCardsPage />} />
      </Routes>
    </Layout>
  )
}
