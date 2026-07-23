export default function HeatmapPanel({ incidents }) {
  return (
    <section className="panel">
      <h2>Incident Heatmap</h2>
      {incidents.map(item => (
        <div key={item.id} className="heat-item">
          <strong>{item.title}</strong>
          <div>{item.location}</div>
          <div>{item.type}</div>
        </div>
      ))}
    </section>
  )
}