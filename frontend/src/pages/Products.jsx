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

  function openAdd() { setEditing(null); setShowModal(true) }
  function openEdit(product) { setEditing(product); setShowModal(true) }
  function closeModal() { setShowModal(false); setEditing(null) }

  function handleSubmit(data) {
    setFormLoading(true)
    setError('')
    const req = editing ? api.put(`/products/${editing.id}`, data) : api.post('/products/', data)
    req
      .then(() => {
        setSuccess(editing ? 'Product updated.' : 'Product created.')
        fetchProducts()
        closeModal()
        setTimeout(() => setSuccess(''), 3000)
      })
      .catch(err => setError(err.response?.data?.detail || 'Failed to save product.'))
      .finally(() => setFormLoading(false))
  }

  function handleDelete(id, name) {
    if (!window.confirm(`Delete product "${name}"? This cannot be undone.`)) return
    api.delete(`/products/${id}`)
      .then(() => { setSuccess('Product deleted.'); fetchProducts(); setTimeout(() => setSuccess(''), 3000) })
      .catch(err => setError(err.response?.data?.detail || 'Failed to delete product.'))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} item{products.length !== 1 ? 's' : ''} in inventory</p>
        </div>
        <button onClick={openAdd} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 shadow-lg shadow-fuchsia-600/20 hover:shadow-fuchsia-500/30">
          + Add Product
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e4a]">
              {products.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-600 text-sm">No products yet. Add your first product.</td></tr>
              )}
              {products.map(p => (
                <tr key={p.id} className={`transition-colors ${p.quantity < 10 ? 'bg-amber-900/10 hover:bg-amber-900/20' : 'hover:bg-[#13133a]'}`}>
                  <td className="px-6 py-4 text-sm font-medium text-white">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 font-mono">{p.sku}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-semibold ${p.quantity < 10 ? 'text-red-400' : 'text-slate-300'}`}>{p.quantity}</span>
                    {p.quantity < 10 && <span className="ml-2 text-xs text-amber-500 font-medium bg-amber-900/30 px-2 py-0.5 rounded-full">Low Stock</span>}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(p)} className="text-fuchsia-400 hover:text-fuchsia-300 text-sm font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors">Delete</button>
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
            <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
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
