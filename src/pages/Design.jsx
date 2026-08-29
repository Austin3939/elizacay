import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCollectionProducts, isConfigured } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import ArtPlaceholder from '../components/ArtPlaceholder'

/* ── Live product option ─────────────────────────────────── */
function ProductOption({ product }) {
  const { addToCart } = useCart()
  const variants = product.variants.edges.map(e => e.node)
  const available = variants.filter(v => v.availableForSale)
  const [selected, setSelected] = useState(available[0] ?? variants[0])
  const [adding, setAdding]     = useState(false)

  const price = parseFloat(selected?.price?.amount ?? 0)
  const currency = selected?.price?.currencyCode ?? 'USD'
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)

  const handleAdd = async () => {
    if (!selected) return
    setAdding(true)
    await addToCart(selected.id, 1)
    setAdding(false)
  }

  return (
    <div className="design-product-option">
      <span className="design-option-type">{product.productType || 'Product'}</span>
      <span className="design-option-name">{product.title}</span>

      {variants.length > 1 && (
        <div className="design-option-variants">
          {variants.map(v => (
            <button
              key={v.id}
              className={`variant-pill${selected?.id === v.id ? ' active' : ''}${!v.availableForSale ? ' sold-out' : ''}`}
              onClick={() => v.availableForSale && setSelected(v)}
              disabled={!v.availableForSale}
            >
              {v.title}
            </button>
          ))}
        </div>
      )}

      <div className="design-option-footer">
        <span className="design-option-price">{formatted}</span>
        <button
          className="btn btn-dark"
          onClick={handleAdd}
          disabled={adding || !selected?.availableForSale}
        >
          {adding ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────── */
export default function Design() {
  const { slug } = useParams()
  const [collection, setCollection] = useState(null)
  const [loading, setLoading]       = useState(isConfigured)

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return }
    setLoading(true)
    getCollectionProducts(slug)
      .then(setCollection)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const products    = collection?.products?.edges?.map(e => e.node) ?? []
  const designImage = collection?.image
  const designTitle = collection?.title ?? ''

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <p className="design-loading">Loading…</p>
      </div>
    )
  }

  if (!collection || products.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <p>This design isn't available right now.</p>
        <Link to="/gallery" className="btn btn-dark" style={{ marginTop: 24 }}>Back to Gallery</Link>
      </div>
    )
  }

  return (
    <div className="design-page">
      <div className="design-layout">

        {/* Left — artwork */}
        <div className="design-artwork">
          {designImage
            ? <img src={designImage.url} alt={designImage.altText || designTitle} />
            : <ArtPlaceholder />
          }
        </div>

        {/* Right — product options */}
        <div className="design-info">
          <Link to="/gallery" className="design-back">← Gallery</Link>
          <h1 className="design-title">{designTitle}</h1>

          <div className="design-products">
            {products.map(p => <ProductOption key={p.id} product={p} />)}
          </div>
        </div>

      </div>
    </div>
  )
}
