import { Card } from "./Card"

interface StatTileProps {
  label: string
  value: string
  tone?: "default" | "positive" | "negative"
}

const TONE_CLASSES: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "text-slate-900",
  positive: "text-emerald-600",
  negative: "text-red-600",
}

export function StatTile({ label, value, tone = "default" }: StatTileProps) {
  return (
    <Card className="p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${TONE_CLASSES[tone]}`}>{value}</p>
    </Card>
  )
}
