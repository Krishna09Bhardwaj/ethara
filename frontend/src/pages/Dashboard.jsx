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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  )

  if (error) return (
    <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-6 py-4">{error}</div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Products" value={data.total_products} color="indigo" icon="📦" to="/products" />
        <StatsCard title="Total Customers" value={data.total_customers} color="green" icon="👥" to="/customers" />
        <StatsCard title="Total Orders" value={data.total_orders} color="indigo" icon="🛒" to="/orders" />
        <StatsCard title="Low Stock Items" value={data.low_stock_products.length} color={data.low_stock_products.length > 0 ? 'red' : 'green'} icon="⚠️" to="/products" />
      </div>

      {data.low_stock_products.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Low Stock Products</h2>
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.low_stock_products.map(p => (
                  <tr key={p.id} className="bg-red-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.sku}</td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">{p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.low_stock_products.length === 0 && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-6 py-4 text-sm">
          All products are adequately stocked.
        </div>
      )}
    </div>
  )
}
