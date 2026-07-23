export default function StatsPanel({ stats }) {
  return (
    <section className="panel">
      <h2>Impact Metrics</h2>
      <div className="stats-grid">
        {stats.map(item => (
          <div key={item.label} className="stat-card">
            <p className="stat-value">{item.value}</p>
            <p className="stat-label">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}