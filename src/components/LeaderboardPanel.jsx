export default function LeaderboardPanel({ guardians }) {
  return (
    <section className="panel">
      <h2>Guardian Reputation</h2>
      {guardians.map((g, index) => (
        <div key={g.name} className="leader-row">
          <span>{index + 1}. {g.name}</span>
          <span>{g.trust}%</span>
          <span>{g.responseTime}</span>
        </div>
      ))}
    </section>
  )
}