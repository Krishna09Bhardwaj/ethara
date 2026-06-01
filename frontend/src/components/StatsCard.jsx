import { Link } from 'react-router-dom'

export default function StatsCard({ title, value, color = 'indigo', icon, to }) {
  const colorMap = {
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  }

  const inner = (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium opacity-75">{title}</p>
        <p className="text-4xl font-bold mt-1">{value}</p>
      </div>
      {icon && <span className="text-4xl opacity-60">{icon}</span>}
    </div>
  )

  const base = `rounded-xl border-2 p-6 transition-transform transition-shadow ${colorMap[color] || colorMap.indigo}`

  if (to) {
    return (
      <Link to={to} className={`${base} block hover:scale-105 hover:shadow-md cursor-pointer`}>
        {inner}
      </Link>
    )
  }

  return (
    <div className={base}>
      {inner}
    </div>
  )
}
