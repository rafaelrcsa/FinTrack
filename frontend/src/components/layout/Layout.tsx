import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import { MonthSwitcher } from "./MonthSwitcher"

const NAV_ITEMS = [
  { to: "/", label: "Painel", end: true },
  { to: "/despesas-fixas", label: "Despesas Fixas" },
  { to: "/cartao-de-credito", label: "Cartão de Crédito" },
  { to: "/despesas-variaveis", label: "Despesas Variáveis" },
  { to: "/renda", label: "Renda" },
  { to: "/categorias", label: "Categorias" },
  { to: "/cartoes", label: "Cartões" },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              F
            </div>
            <span className="text-lg font-bold text-slate-900">FinTrack</span>
          </div>
          <MonthSwitcher />
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  )
}
