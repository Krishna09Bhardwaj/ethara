import { useState, useEffect } from 'react'

export default function ProductForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ name: '', sku: '', price: '', quantity: '', ...initial })
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

  const inputClass = (field) =>
    `w-full bg-[#0a0a20] border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors ${errors[field] ? 'border-red-500' : 'border-[#2a2a5a]'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Product Name *</label>
        <input name="name" value={form.name} onChange={handleChange} className={inputClass('name')} placeholder="e.g. Widget Pro" />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">SKU *</label>
        <input name="sku" value={form.sku} onChange={handleChange} className={inputClass('sku')} placeholder="e.g. WGT-001" />
        {errors.sku && <p className="text-red-400 text-xs mt-1">{errors.sku}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Price ($) *</label>
        <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className={inputClass('price')} placeholder="e.g. 29.99" />
        {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Quantity *</label>
        <input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={handleChange} className={inputClass('quantity')} placeholder="e.g. 100" />
        {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all duration-150 shadow-lg shadow-fuchsia-600/20">
          {loading ? 'Saving...' : 'Save Product'}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 border border-[#2a2a5a] text-slate-400 hover:text-white hover:border-slate-500 py-2 rounded-lg text-sm font-medium transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
