import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import CustomerForm from '../components/CustomerForm.jsx'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  function fetchCustomers() {
    setLoading(true)
    setError('')
    api.get('/customers/')
      .then(res => setCustomers(res.data))
      .catch(() => setError('Failed to load customers.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCustomers() }, [])

  function handleSubmit(data) {
    setFormLoading(true)
    setError('')
    api.post('/customers/', data)
      .then(() => {
        setSuccess('Customer created.')
        fetchCustomers()
        setShowModal(false)
        setTimeout(() => setSuccess(''), 3000)
      })
      .catch(err => setError(err.response?.data?.detail || 'Failed to create customer.'))
      .finally(() => setFormLoading(false))
  }

  function handleDelete(id, name) {
    if (!window.confirm(`Delete customer "${name}"? This cannot be undone.`)) return
    api.delete(`/customers/${id}`)
      .then(() => { setSuccess('Customer deleted.'); fetchCustomers(); setTimeout(() => setSuccess(''), 3000) })
      .catch(err => setError(err.response?.data?.detail || 'Failed to delete customer.'))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-500 text-sm mt-1">{customers.length} registered customer{customers.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 shadow-lg shadow-fuchsia-600/20 hover:shadow-fuchsia-500/30">
          + Add Customer
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e4a]">
              {customers.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-600 text-sm">No customers yet. Add your first customer.</td></tr>
              )}
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-[#13133a] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">{c.full_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{c.phone}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(c.id, c.full_name)} className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f2a] border border-[#2a2a5a] rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Add Customer</h2>
            <CustomerForm onSubmit={handleSubmit} onCancel={() => setShowModal(false)} loading={formLoading} />
          </div>
        </div>
      )}
    </div>
  )
}
