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
      .then(([cRes, pRes]) => { setCustomers(cRes.data); setProducts(pRes.data) })
      .catch(() => setFetchError('Failed to load customers and products.'))
  }, [])

  function addItem() { setItems(prev => [...prev, { product_id: '', quantity: '' }]) }
  function removeItem(index) { setItems(prev => prev.filter((_, i) => i !== index)) }

  function updateItem(index, field, value) {
    setItems(prev => { const next = [...prev]; next[index] = { ...next[index], [field]: value }; return next })
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

  const selectClass = (errKey) =>
    `w-full bg-[#0a0a20] border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors ${errors[errKey] ? 'border-red-500' : 'border-[#2a2a5a]'}`

  const inputClass = (errKey) =>
    `w-full bg-[#0a0a20] border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors ${errors[errKey] ? 'border-red-500' : 'border-[#2a2a5a]'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fetchError && <div className="bg-red-900/20 border border-red-700/40 text-red-400 rounded-lg px-4 py-3 text-sm">{fetchError}</div>}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Customer *</label>
        <select
          value={customerId}
          onChange={e => { setCustomerId(e.target.value); setErrors(prev => ({ ...prev, customer: undefined })) }}
          className={selectClass('customer')}
        >
          <option value="" className="bg-[#0a0a20]">Select customer...</option>
          {customers.map(c => <option key={c.id} value={c.id} className="bg-[#0a0a20]">{c.full_name} ({c.email})</option>)}
        </select>
        {errors.customer && <p className="text-red-400 text-xs mt-1">{errors.customer}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-300">Order Items *</label>
          <button type="button" onClick={addItem} className="text-fuchsia-400 hover:text-fuchsia-300 text-sm font-medium transition-colors">+ Add Item</button>
        </div>
        {errors.items && <p className="text-red-400 text-xs mb-2">{errors.items}</p>}
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start mb-2">
            <div className="flex-1">
              <select
                value={item.product_id}
                onChange={e => updateItem(i, 'product_id', e.target.value)}
                className={selectClass(`item_${i}_product_id`)}
              >
                <option value="" className="bg-[#0a0a20]">Select product...</option>
                {products.map(p => <option key={p.id} value={p.id} className="bg-[#0a0a20]">{p.name} (stock: {p.quantity})</option>)}
              </select>
              {errors[`item_${i}_product_id`] && <p className="text-red-400 text-xs mt-1">{errors[`item_${i}_product_id`]}</p>}
            </div>
            <div className="w-24">
              <input
                type="number" min="1" step="1" placeholder="Qty"
                value={item.quantity}
                onChange={e => updateItem(i, 'quantity', e.target.value)}
                className={inputClass(`item_${i}_quantity`)}
              />
              {errors[`item_${i}_quantity`] && <p className="text-red-400 text-xs mt-1">{errors[`item_${i}_quantity`]}</p>}
            </div>
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-400 px-2 py-2 text-sm transition-colors">✕</button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all duration-150 shadow-lg shadow-fuchsia-600/20">
          {loading ? 'Creating...' : 'Create Order'}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 border border-[#2a2a5a] text-slate-400 hover:text-white hover:border-slate-500 py-2 rounded-lg text-sm font-medium transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
