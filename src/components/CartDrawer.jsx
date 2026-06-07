import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const {
    isOpen, closeCart,
    lines, totalAmount, currency, checkoutUrl,
    removeFromCart, updateQuantity,
    loading, error,
  } = useCart()

  const fmt = amt =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amt)

  return (
    <>
      {isOpen && (
        <div
          className="cart-overlay"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      <aside className={`cart-drawer${isOpen ? ' open' : ''}`} aria-label="Cart">
        {/* Header */}
        <div className="cart-drawer-header">
          <span className="tag" style={{ margin: 0 }}>Your Cart</span>
          <button className="cart-close-btn" onClick={closeCart} aria-label="Close cart">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="cart-error">{error}</div>
        )}

        {/* Empty state */}
        {lines.length === 0 && !loading ? (
          <div className="cart-empty">
            <img src="/images/botanical.png" alt="" style={{ height: 64, opacity: 0.35, marginBottom: 16 }} />
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            {/* Line items */}
            <div className="cart-items">
              {lines.map(line => {
                const { id, quantity, merchandise } = line
                const img = merchandise.product.images.edges[0]?.node
                const isDefaultVariant = merchandise.title === 'Default Title'

                return (
                  <div key={id} className="cart-item">
                    <div className="cart-item-img">
                      {img
                        ? <img src={img.url} alt={img.altText || merchandise.product.title} />
                        : <div className="cart-item-img-empty" />
                      }
                    </div>

                    <div className="cart-item-info">
                      <span className="cart-item-title">{merchandise.product.title}</span>
                      {!isDefaultVariant && (
                        <span className="cart-item-variant">{merchandise.title}</span>
                      )}
                      <span className="cart-item-price">{fmt(merchandise.price.amount)}</span>
                    </div>

                    <div className="cart-item-right">
                      <div className="cart-qty-ctrl">
                        <button
                          onClick={() => updateQuantity(id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >−</button>
                        <span>{quantity}</span>
                        <button
                          onClick={() => updateQuantity(id, quantity + 1)}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(id)}
                        aria-label="Remove item"
                      >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="cart-footer">
              {loading && <span className="cart-updating">Updating…</span>}

              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span>{fmt(totalAmount)}</span>
              </div>

              <p className="cart-shipping-note">
                Shipping and taxes calculated at checkout.
              </p>

              <a
                href={checkoutUrl}
                className="btn btn-dark cart-checkout-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to Checkout →
              </a>

              <button className="cart-continue" onClick={closeCart}>
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
