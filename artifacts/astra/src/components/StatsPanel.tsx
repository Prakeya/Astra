interface Stat {
  label: string
  value: string
  icon?: React.ReactNode
}

export default function StatsPanel({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-muted/30 rounded-xl p-3 border border-border/50"
        >
          <div className="text-lg font-bold text-foreground">{stat.value}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
