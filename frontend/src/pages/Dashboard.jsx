import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import StatsCard from '../components/StatsCard.jsx'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load dashboard data. Make sure the backend is running.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500"></div>
    </div>
  )

  if (error) return (
    <div className="bg-red-900/20 border border-red-700/40 text-red-400 rounded-lg px-6 py-4">{error}</div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your inventory and orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Products" value={data.total_products} color="indigo" icon="📦" to="/products" />
        <StatsCard title="Total Customers" value={data.total_customers} color="green" icon="👥" to="/customers" />
        <StatsCard title="Total Orders" value={data.total_orders} color="indigo" icon="🛒" to="/orders" />
        <StatsCard title="Low Stock Items" value={data.low_stock_products.length} color={data.low_stock_products.length > 0 ? 'red' : 'green'} icon="⚠️" to="/products" />
      </div>

      {data.low_stock_products.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Low Stock Alert</h2>
          <div className="bg-[#0f0f2a] rounded-xl border border-[#1e1e4a] overflow-hidden">
            <table className="min-w-full divide-y divide-[#1e1e4a]">
              <thead className="bg-[#111138]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e4a]">
                {data.low_stock_products.map(p => (
                  <tr key={p.id} className="bg-red-900/10 hover:bg-red-900/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-mono">{p.sku}</td>
                    <td className="px-6 py-4 text-sm font-bold text-red-400">{p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.low_stock_products.length === 0 && (
        <div className="bg-green-900/20 border border-green-700/30 text-green-400 rounded-lg px-6 py-4 text-sm">
          All products are adequately stocked.
        </div>
      )}
    </div>
  )
}
