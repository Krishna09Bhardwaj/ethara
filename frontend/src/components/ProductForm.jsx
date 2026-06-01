import { useState, useEffect } from 'react'

export default function ProductForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    quantity: '',
    ...initial,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) setForm({ name: '', sku: '', price: '', quantity: '', ...initial })
  }, [initial])

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.sku.trim()) e.sku = 'SKU is required'
    if (form.price === '' || isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price required (>= 0)'
    if (form.quantity === '' || isNaN(form.quantity) || Number(form.quantity) < 0 || !Number.isInteger(Number(form.quantity))) e.quantity = 'Valid integer quantity required (>= 0)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ name: form.name.trim(), sku: form.sku.trim(), price: Number(form.price), quantity: parseInt(form.quantity) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
        <input name="name" value={form.name} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`} placeholder="e.g. Widget Pro" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
        <input name="sku" value={form.sku} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.sku ? 'border-red-400' : 'border-gray-300'}`} placeholder="e.g. WGT-001" />
        {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
        <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.price ? 'border-red-400' : 'border-gray-300'}`} placeholder="e.g. 29.99" />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
        <input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.quantity ? 'border-red-400' : 'border-gray-300'}`} placeholder="e.g. 100" />
        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {loading ? 'Saving...' : 'Save Product'}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
