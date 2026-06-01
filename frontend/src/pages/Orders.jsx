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
        setSuccess('Order created successfully.')
        fetchOrders()
        setShowModal(false)
        setTimeout(() => setSuccess(''), 3000)
      })
      .catch(err => setError(err.response?.data?.detail || 'Failed to create order.'))
      .finally(() => setFormLoading(false))
  }

  function handleDelete(id) {
    if (!window.confirm(`Cancel and delete order #${id}? Stock will be restored.`)) return
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

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          + Create Order
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}
      {success && <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">{success}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm">No orders yet. Create your first order.</td></tr>
              )}
              {orders.map(o => (
                <>
                  <tr key={o.id} onClick={() => handleRowClick(o)} className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-600">#{o.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{o.customer_name || `Customer #${o.customer_id}`}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">${o.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleDelete(o.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Cancel</button>
                    </td>
                  </tr>
                  {selectedOrder?.id === o.id && (
                    <tr key={`detail-${o.id}`} className="bg-indigo-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-700 mb-2">Order Items:</div>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-gray-500">
                              <th className="pb-1">Product</th>
                              <th className="pb-1">Qty</th>
                              <th className="pb-1">Unit Price</th>
                              <th className="pb-1">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {o.items.map(item => (
                              <tr key={item.id}>
                                <td className="py-1 text-gray-800">{item.product_name || `Product #${item.product_id}`}</td>
                                <td className="py-1 text-gray-600">{item.quantity}</td>
                                <td className="py-1 text-gray-600">${item.unit_price.toFixed(2)}</td>
                                <td className="py-1 font-medium text-gray-800">${(item.quantity * item.unit_price).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-2 text-right text-sm font-bold text-indigo-700">Total: ${o.total_amount.toFixed(2)}</div>
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-screen overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Order</h2>
            <OrderForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} loading={formLoading} />
          </div>
        </div>
      )}
    </div>
  )
}
