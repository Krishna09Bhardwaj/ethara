import { useState, useEffect } from 'react'
import api from '../api/axios.js'

export default function OrderForm({ onSubmit, onCancel, loading }) {
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([{ product_id: '', quantity: '' }])
  const [errors, setErrors] = useState({})
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    Promise.all([api.get('/customers/'), api.get('/products/')])
      .then(([cRes, pRes]) => {
        setCustomers(cRes.data)
        setProducts(pRes.data)
      })
      .catch(() => setFetchError('Failed to load customers and products.'))
  }, [])

  function addItem() {
    setItems(prev => [...prev, { product_id: '', quantity: '' }])
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function updateItem(index, field, value) {
    setItems(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
    setErrors(prev => ({ ...prev, [`item_${index}_${field}`]: undefined }))
  }

  function validate() {
    const e = {}
    if (!customerId) e.customer = 'Please select a customer'
    if (items.length === 0) e.items = 'Add at least one product'
    items.forEach((item, i) => {
      if (!item.product_id) e[`item_${i}_product_id`] = 'Select a product'
      if (!item.quantity || isNaN(item.quantity) || Number(item.quantity) <= 0 || !Number.isInteger(Number(item.quantity))) e[`item_${i}_quantity`] = 'Valid quantity required'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      customer_id: parseInt(customerId),
      items: items.map(it => ({ product_id: parseInt(it.product_id), quantity: parseInt(it.quantity) })),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fetchError && <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">{fetchError}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
        <select value={customerId} onChange={e => { setCustomerId(e.target.value); setErrors(prev => ({ ...prev, customer: undefined })) }} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.customer ? 'border-red-400' : 'border-gray-300'}`}>
          <option value="">Select customer...</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
        </select>
        {errors.customer && <p className="text-red-500 text-xs mt-1">{errors.customer}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Order Items *</label>
          <button type="button" onClick={addItem} className="text-indigo-600 text-sm hover:text-indigo-800 font-medium">+ Add Item</button>
        </div>
        {errors.items && <p className="text-red-500 text-xs mb-2">{errors.items}</p>}
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start mb-2">
            <div className="flex-1">
              <select value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[`item_${i}_product_id`] ? 'border-red-400' : 'border-gray-300'}`}>
                <option value="">Select product...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (stock: {p.quantity})</option>)}
              </select>
              {errors[`item_${i}_product_id`] && <p className="text-red-500 text-xs mt-1">{errors[`item_${i}_product_id`]}</p>}
            </div>
            <div className="w-24">
              <input type="number" min="1" step="1" placeholder="Qty" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[`item_${i}_quantity`] ? 'border-red-400' : 'border-gray-300'}`} />
              {errors[`item_${i}_quantity`] && <p className="text-red-500 text-xs mt-1">{errors[`item_${i}_quantity`]}</p>}
            </div>
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 px-2 py-2 text-sm">✕</button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {loading ? 'Creating...' : 'Create Order'}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
