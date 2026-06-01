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
        setSuccess('Customer created successfully.')
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
      .then(() => {
        setSuccess('Customer deleted.')
        fetchCustomers()
        setTimeout(() => setSuccess(''), 3000)
      })
      .catch(err => setError(err.response?.data?.detail || 'Failed to delete customer.'))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          + Add Customer
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">No customers yet. Add your first customer.</td></tr>
              )}
              {customers.map(c => (
                <tr key={c.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.phone}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(c.id, c.full_name)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Customer</h2>
            <CustomerForm onSubmit={handleSubmit} onCancel={() => setShowModal(false)} loading={formLoading} />
          </div>
        </div>
      )}
    </div>
  )
}
