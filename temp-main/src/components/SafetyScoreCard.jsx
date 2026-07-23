export default function SafetyScoreCard({ score, confidence, riskLevel, reasons }) {
  return (
    <section className="panel">
      <h2>Safety Intelligence</h2>
      <p>Safety Level: {riskLevel}</p>
      <p>Score: {score}%</p>
      <p>Confidence: {confidence}%</p>
      <ul>
        {reasons.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </section>
  )
}