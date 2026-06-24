import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'
import type { Incident } from '../data/sampleIncidents'

const SEVERITY_LABELS: Record<number, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Critical',
}

const SEVERITY_COLORS: Record<number, string> = {
  1: '#81B29A',
  2: '#A8C5B5',
  3: '#F2CC8F',
  4: '#E07A5F',
  5: '#c0392b',
}

export default function SeverityChart({ incidents }: { incidents: Incident[] }) {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  incidents.forEach((i) => {
    counts[i.severity] = (counts[i.severity] || 0) + 1
  })

  const data = [1, 2, 3, 4, 5].map((sev) => ({
    severity: sev,
    label: SEVERITY_LABELS[sev],
    count: counts[sev],
    color: SEVERITY_COLORS[sev],
  }))

  return (
    <div className="w-full h-36">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: '#3D405B' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: '#3D405B' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value) => [value, 'Incidents']}
            contentStyle={{
              background: '#FDF6E3',
              border: '1px solid rgba(61,64,91,0.12)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.severity} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
