export default function ReplayPanel({ journeys }) {
  return (
    <section className="panel">
      <h2>Safety Replay</h2>
      {journeys.map(step => (
        <div key={step.id} className="replay-item">
          <strong>{step.time}</strong> — {step.event}
        </div>
      ))}
    </section>
  )
}