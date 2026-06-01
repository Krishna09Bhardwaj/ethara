import { useState, useEffect } from 'react'

export default function CustomerForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', ...initial })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) setForm({ full_name: '', email: '', phone: '', ...initial })
  }, [initial])

  function validate() {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone is required'
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
    onSubmit({ full_name: form.full_name.trim(), email: form.email.trim(), phone: form.phone.trim() })
  }

  const inputClass = (field) =>
    `w-full bg-[#0a0a20] border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors ${errors[field] ? 'border-red-500' : 'border-[#2a2a5a]'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name *</label>
        <input name="full_name" value={form.full_name} onChange={handleChange} className={inputClass('full_name')} placeholder="e.g. John Smith" />
        {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass('email')} placeholder="e.g. john@example.com" />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Phone *</label>
        <input name="phone" value={form.phone} onChange={handleChange} className={inputClass('phone')} placeholder="e.g. +1-555-0100" />
        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all duration-150 shadow-lg shadow-fuchsia-600/20">
          {loading ? 'Saving...' : 'Save Customer'}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 border border-[#2a2a5a] text-slate-400 hover:text-white hover:border-slate-500 py-2 rounded-lg text-sm font-medium transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
