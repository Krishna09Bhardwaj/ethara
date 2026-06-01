import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import OrderForm from '../components/OrderForm.jsx'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  function fetchOrders() {
    setLoading(true)
    setError('')
    api.get('/orders/')
      .then(res => setOrders(res.data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  function handleCreate(data) {
    setFormLoading(true)
    setError('')
    api.post('/orders/', data)
      .then(() => {
        setSuccess('Order created.')
        fetchOrders()
        setShowModal(false)
        setTimeout(() => setSuccess(''), 3000)
      })
      .catch(err => setError(err.response?.data?.detail || 'Failed to create order.'))
      .finally(() => setFormLoading(false))
  }

  function handleComplete(id) {
    api.patch(`/orders/${id}/status`, { status: 'completed' })
      .then(() => {
        setSuccess('Order marked as completed.')
        fetchOrders()
        setTimeout(() => setSuccess(''), 3000)
      })
      .catch(err => setError(err.response?.data?.detail || 'Failed to update order.'))
  }

  function handleDelete(id) {
    if (!window.confirm(`Cancel order #${id}? Stock will be restored.`)) return
    api.delete(`/orders/${id}`)
      .then(() => {
        setSuccess('Order cancelled and stock restored.')
        fetchOrders()
        if (selectedOrder?.id === id) setSelectedOrder(null)
        setTimeout(() => setSuccess(''), 3000)
      })
      .catch(err => setError(err.response?.data?.detail || 'Failed to delete order.'))
  }

  function handleRowClick(order) {
    setSelectedOrder(prev => (prev?.id === order.id ? null : order))
  }

  const statusStyle = {
    pending: 'bg-amber-900/30 text-amber-400 border border-amber-600/30',
    completed: 'bg-green-900/30 text-green-400 border border-green-600/30',
    cancelled: 'bg-red-900/30 text-red-400 border border-red-600/30',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 shadow-lg shadow-fuchsia-600/20 hover:shadow-fuchsia-500/30">
          + Create Order
        </button>
      </div>

      {error && <div className="bg-red-900/20 border border-red-700/40 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}
      {success && <div className="bg-green-900/20 border border-green-700/40 text-green-400 rounded-lg px-4 py-3 text-sm mb-4">{success}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-500"></div>
        </div>
      ) : (
        <div className="bg-[#0f0f2a] rounded-xl border border-[#1e1e4a] overflow-hidden">
          <table className="min-w-full divide-y divide-[#1e1e4a]">
            <thead className="bg-[#111138]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e4a]">
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-600 text-sm">No orders yet. Create your first order.</td></tr>
              )}
              {orders.map(o => (
                <>
                  <tr key={o.id} onClick={() => handleRowClick(o)} className={`cursor-pointer transition-colors ${selectedOrder?.id === o.id ? 'bg-[#13133a]' : 'hover:bg-[#13133a]'}`}>
                    <td className="px-6 py-4 text-sm font-bold text-fuchsia-400">#{o.id}</td>
                    <td className="px-6 py-4 text-sm text-white">{o.customer_name || `Customer #${o.customer_id}`}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-400">${o.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[o.status] || 'bg-slate-800 text-slate-400'}`}>{o.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-3" onClick={e => e.stopPropagation()}>
                      {o.status === 'pending' && (
                        <button onClick={() => handleComplete(o.id)} className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">Complete</button>
                      )}
                      <button onClick={() => handleDelete(o.id)} className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors">Cancel</button>
                    </td>
                  </tr>
                  {selectedOrder?.id === o.id && (
                    <tr key={`detail-${o.id}`}>
                      <td colSpan={6} className="px-6 py-4 bg-[#0d0d35] border-t border-fuchsia-600/20">
                        <div className="text-xs font-semibold text-fuchsia-400 uppercase tracking-widest mb-3">Order Items</div>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-slate-500">
                              <th className="pb-2">Product</th>
                              <th className="pb-2">Qty</th>
                              <th className="pb-2">Unit Price</th>
                              <th className="pb-2">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1e1e4a]">
                            {o.items.map(item => (
                              <tr key={item.id}>
                                <td className="py-2 text-slate-300">{item.product_name || `Product #${item.product_id}`}</td>
                                <td className="py-2 text-slate-400">{item.quantity}</td>
                                <td className="py-2 text-slate-400">${item.unit_price.toFixed(2)}</td>
                                <td className="py-2 font-semibold text-white">${(item.quantity * item.unit_price).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-3 text-right text-sm font-bold text-fuchsia-400">Total: ${o.total_amount.toFixed(2)}</div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f2a] border border-[#2a2a5a] rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-screen overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">Create Order</h2>
            <OrderForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} loading={formLoading} />
          </div>
        </div>
      )}
    </div>
  )
}
