import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import ProductForm from '../components/ProductForm.jsx'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  function fetchProducts() {
    setLoading(true)
    setError('')
    api.get('/products/')
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  function openAdd() {
    setEditing(null)
    setShowModal(true)
  }

  function openEdit(product) {
    setEditing(product)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditing(null)
  }

  function handleSubmit(data) {
    setFormLoading(true)
    setError('')
    const req = editing ? api.put(`/products/${editing.id}`, data) : api.post('/products/', data)
    req
      .then(() => {
        setSuccess(editing ? 'Product updated successfully.' : 'Product created successfully.')
        fetchProducts()
        closeModal()
        setTimeout(() => setSuccess(''), 3000)
      })
      .catch(err => {
        const msg = err.response?.data?.detail || 'Failed to save product.'
        setError(msg)
      })
      .finally(() => setFormLoading(false))
  }

  function handleDelete(id, name) {
    if (!window.confirm(`Delete product "${name}"? This cannot be undone.`)) return
    api.delete(`/products/${id}`)
      .then(() => {
        setSuccess('Product deleted.')
        fetchProducts()
        setTimeout(() => setSuccess(''), 3000)
      })
      .catch(err => setError(err.response?.data?.detail || 'Failed to delete product.'))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button onClick={openAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          + Add Product
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">No products yet. Add your first product.</td></tr>
              )}
              {products.map(p => (
                <tr key={p.id} className={p.quantity < 10 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{p.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-medium ${p.quantity < 10 ? 'text-red-600' : 'text-gray-700'}`}>{p.quantity}</span>
                    {p.quantity < 10 && <span className="ml-2 text-xs text-red-500 font-medium">Low Stock</span>}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEdit(p)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
            <ProductForm
              initial={editing ? { name: editing.name, sku: editing.sku, price: editing.price, quantity: editing.quantity } : null}
              onSubmit={handleSubmit}
              onCancel={closeModal}
              loading={formLoading}
            />
          </div>
        </div>
      )}
    </div>
  )
}
