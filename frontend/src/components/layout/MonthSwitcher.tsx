import { useMonth } from "../../context/MonthContext"
import { monthName } from "../../lib/format"

export function MonthSwitcher() {
  const { year, month, goToPreviousMonth, goToNextMonth } = useMonth()

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
      <button
        onClick={goToPreviousMonth}
        aria-label="Mês anterior"
        className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      >
        ‹
      </button>
      <span className="w-32 text-center text-sm font-semibold text-slate-800">
        {monthName(month)} {year}
      </span>
      <button
        onClick={goToNextMonth}
        aria-label="Próximo mês"
        className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      >
        ›
      </button>
    </div>
  )
}
