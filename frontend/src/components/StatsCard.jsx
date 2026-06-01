import { Link } from 'react-router-dom'

export default function StatsCard({ title, value, color = 'indigo', icon, to }) {
  const borderMap = {
    indigo: 'border-t-indigo-500',
    green: 'border-t-green-500',
    yellow: 'border-t-amber-500',
    red: 'border-t-red-500',
  }
  const textMap = {
    indigo: 'text-indigo-400',
    green: 'text-green-400',
    yellow: 'text-amber-400',
    red: 'text-red-400',
  }

  const borderColor = borderMap[color] || borderMap.indigo
  const textColor = textMap[color] || textMap.indigo

  const inner = (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{title}</p>
        <p className={`text-4xl font-bold mt-2 ${textColor}`}>{value}</p>
      </div>
      {icon && <span className="text-2xl opacity-40 mt-1">{icon}</span>}
    </div>
  )

  const base = `rounded-xl border border-[#1e1e4a] border-t-4 ${borderColor} bg-[#0f0f2a] p-6 shadow-lg transition-all duration-200`

  if (to) {
    return (
      <Link to={to} className={`${base} block hover:scale-[1.03] hover:shadow-xl hover:border-fuchsia-600/30 hover:bg-[#111135] cursor-pointer`}>
        {inner}
      </Link>
    )
  }

  return <div className={base}>{inner}</div>
}
