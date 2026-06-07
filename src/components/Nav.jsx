import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const { totalQty, openCart } = useCart()

  return (
    <>
      <nav className="nav">
        <NavLink to="/" className="nav-logo" onClick={close}>
          <img src="/images/botanical.png" alt="" className="nav-logo-icon" />
          <span className="nav-logo-text">eliza cay</span>
        </NavLink>

        <ul className="nav-links">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <button
            className="nav-cart-btn"
            onClick={openCart}
            aria-label={`Open cart${totalQty ? `, ${totalQty} items` : ''}`}
          >
            <CartIcon />
            {totalQty > 0 && (
              <span className="nav-cart-badge">{totalQty}</span>
            )}
          </button>

          <button
            className={`nav-burger${open ? ' open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`nav-mobile${open ? ' open' : ''}`}>
        {LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={close}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M2 2h1.5l2.1 9.5h9l1.9-7H5.5"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="8.5" cy="16.5" r="1.1" fill="currentColor"/>
      <circle cx="14.5" cy="16.5" r="1.1" fill="currentColor"/>
    </svg>
  )
}

const LINKS = [
  { to: '/gallery',    label: 'Gallery'    },
  { to: '/shop',       label: 'Shop'       },
  { to: '/commission', label: 'Commission' },
  { to: '/about',      label: 'About'      },
]
