import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

interface MonthContextValue {
  year: number
  month: number
  setYear: (year: number) => void
  setMonth: (month: number) => void
  goToPreviousMonth: () => void
  goToNextMonth: () => void
}

const MonthContext = createContext<MonthContextValue | null>(null)

export function MonthProvider({ children }: { children: ReactNode }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  const value = useMemo<MonthContextValue>(
    () => ({
      year,
      month,
      setYear,
      setMonth,
      goToPreviousMonth: () => {
        if (month === 1) {
          setMonth(12)
          setYear((y) => y - 1)
        } else {
          setMonth((m) => m - 1)
        }
      },
      goToNextMonth: () => {
        if (month === 12) {
          setMonth(1)
          setYear((y) => y + 1)
        } else {
          setMonth((m) => m + 1)
        }
      },
    }),
    [year, month],
  )

  return <MonthContext.Provider value={value}>{children}</MonthContext.Provider>
}

export function useMonth() {
  const ctx = useContext(MonthContext)
  if (!ctx) throw new Error("useMonth must be used within a MonthProvider")
  return ctx
}
