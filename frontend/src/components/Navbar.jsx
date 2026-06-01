import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/customers', label: 'Customers' },
  { to: '/orders', label: 'Orders' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="border-b border-[#1e1e4a] bg-[#0a0a18]/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center shadow-lg shadow-fuchsia-600/40">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">Ethara</span>
            <span className="text-slate-600 text-sm hidden sm:block">/ Inventory & Orders</span>
          </div>
          <div className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                  location.pathname === link.to
                    ? 'bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-600/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
