import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCollectionProducts, isConfigured } from '../lib/shopify'
import { getDesign } from '../data/designs'
import { useCart } from '../context/CartContext'
import ArtPlaceholder from '../components/ArtPlaceholder'

/* ── Live product option (Shopify connected) ─────────────── */
function LiveProductOption({ product }) {
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

/* ── Static product option (fallback) ────────────────────── */
function StaticProductOption({ product }) {
  const [selected, setSelected] = useState(product.variants[0])

  return (
    <div className="design-product-option">
      <span className="design-option-type">{product.type}</span>
      <span className="design-option-name">{product.title}</span>

      <div className="design-option-variants">
        {product.variants.map(v => (
          <button
            key={v.id}
            className={`variant-pill${selected?.id === v.id ? ' active' : ''}`}
            onClick={() => setSelected(v)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="design-option-footer">
        <span className="design-option-price">{selected?.price}</span>
        <Link to="/shop" className="btn btn-dark">
          View in Shop
        </Link>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────── */
export default function Design() {
  const { slug } = useParams()
  const [collection, setCollection] = useState(null)
  const [loading, setLoading]       = useState(isConfigured)

  const staticDesign = getDesign(slug)

  useEffect(() => {
    if (!isConfigured) return
    setLoading(true)
    getCollectionProducts(slug)
      .then(setCollection)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const liveProducts  = collection?.products?.edges?.map(e => e.node) ?? []
  const designImage   = collection?.image
  const designTitle   = collection?.title ?? staticDesign?.title ?? ''
  const showLive      = isConfigured && liveProducts.length > 0

  if (!staticDesign && !showLive && !loading) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <p>Design not found.</p>
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
            : <ArtPlaceholder index={staticDesign?.placeholderIndex ?? 0} />
          }
        </div>

        {/* Right — product options */}
        <div className="design-info">
          <Link to="/gallery" className="design-back">
            ← Gallery
          </Link>

          <h1 className="design-title">{designTitle}</h1>

          {loading && (
            <p className="design-loading">Loading products…</p>
          )}

          <div className="design-products">
            {showLive
              ? liveProducts.map(p => <LiveProductOption key={p.id} product={p} />)
              : staticDesign?.products.map(p => <StaticProductOption key={p.id} product={p} />)
            }
          </div>
        </div>

      </div>
    </div>
  )
}
