export default function TimelinePanel({ items }) {
  return (
    <section className="panel">
      <h2>Safety Timeline</h2>
      {items.map(item => (
        <div key={item.id} className="timeline-item">
          <strong>{item.time}</strong> — {item.event}
        </div>
      ))}
    </section>
  )
}