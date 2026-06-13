import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getProducts, isConfigured } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import ArtPlaceholder from '../components/ArtPlaceholder'

/* ── Static fallback (shown until Shopify is connected) ──── */
const STATIC_PRINTS = [
  { id: 's1', handle: 'bell-flower-study-i',  title: 'Bell Flower Study I',   meta: '8 × 10 in · Archival print', price: '$45', placeholderIndex: 0 },
  { id: 's2', handle: 'fern-pressed-series',  title: 'Fern — Pressed Series', meta: '8 × 10 in · Archival print', price: '$52', placeholderIndex: 1 },
  { id: 's3', handle: 'waning-moon',          title: 'Waning Moon',           meta: '10 × 12 in · Archival print', price: '$55', placeholderIndex: 3 },
  { id: 's4', handle: 'seed-pods-i',          title: 'Seed Pods I',           meta: '8 × 10 in · Archival print', price: '$50', placeholderIndex: 5 },
  { id: 's5', handle: 'wreath-study',         title: 'Wreath Study',          meta: '10 × 10 in · Archival print', price: '$42', placeholderIndex: 4 },
  { id: 's6', handle: 'bell-flower-study-ii', title: 'Bell Flower Study II',  meta: '5 × 7 in · Archival print',  price: '$28', placeholderIndex: 0 },
]

const STATIC_APPAREL = [
  { id: 'a1', handle: 'wreath-tee',       title: 'Wreath Tee',       meta: 'Unisex · Bone',       price: '$38', placeholderIndex: 4 },
  { id: 'a2', handle: 'bell-flower-tee',  title: 'Bell Flower Tee',  meta: 'Unisex · Sage',       price: '$38', placeholderIndex: 0 },
  { id: 'a3', handle: 'forest-floor-tee', title: 'Forest Floor Tee', meta: 'Unisex · Off-white',  price: '$38', placeholderIndex: 2 },
  { id: 'a4', handle: 'moon-tee',         title: 'Moon Tee',         meta: 'Unisex · Charcoal',   price: '$40', placeholderIndex: 3 },
]

/* ── Normalize Shopify product → common card shape ────────── */
function normalize(product, idx) {
  const variants  = product.variants.edges.map(e => e.node)
  const firstImg  = product.images.edges[0]?.node
  const price     = parseFloat(product.priceRange.minVariantPrice.amount)
  const currency  = product.priceRange.minVariantPrice.currencyCode
  const fmt       = new Intl.NumberFormat('en-US', { style: 'currency', currency })

  return {
    id:              product.id,
    handle:          product.handle,
    title:           product.title,
    price:           fmt.format(price),
    meta:            product.productType || '',
    imageUrl:        firstImg?.url,
    imageAlt:        firstImg?.altText || product.title,
    variants,
    defaultVariant:  variants.find(v => v.availableForSale) ?? variants[0],
    placeholderIndex: idx % 6,
    isShopify:       true,
  }
}

/* ── Classify by productType or tags ─────────────────────── */
function classify(products) {
  const prints  = []
  const apparel = []
  products.forEach((p, i) => {
    const norm = normalize(p, i)
    const type = (p.productType + ' ' + p.tags.join(' ')).toLowerCase()
    if (/shirt|tee|apparel|clothing|top/.test(type)) apparel.push(norm)
    else prints.push(norm)
  })
  return { prints, apparel }
}

/* ── Product card ─────────────────────────────────────────── */
function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [selectedId, setSelectedId] = useState(product.defaultVariant?.id ?? null)
  const [adding, setAdding]         = useState(false)

  const hasVariants = product.isShopify && product.variants?.length > 1

  const handleAdd = async () => {
    if (!isConfigured || !selectedId) return
    setAdding(true)
    await addToCart(selectedId, 1)
    setAdding(false)
  }

  return (
    <article className="art-card">
      <Link to={`/product/${product.handle}`} className="art-card-image-link">
        <div className="art-card-image">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.imageAlt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <ArtPlaceholder index={product.placeholderIndex} />
          }
        </div>
      </Link>

      <div className="art-card-info">
        <Link to={`/product/${product.handle}`} className="art-card-title-link">
          <span className="art-card-title">{product.title}</span>
        </Link>
        {product.meta && <span className="art-card-meta">{product.meta}</span>}

        {hasVariants && (
          <select
            className="art-card-select"
            value={selectedId ?? ''}
            onChange={e => setSelectedId(e.target.value)}
          >
            {product.variants.map(v => (
              <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                {v.title}{!v.availableForSale ? ' — Sold out' : ''}
              </option>
            ))}
          </select>
        )}

        <span className="art-card-price">{product.price}</span>
      </div>

      <div className="art-card-actions">
        {isConfigured ? (
          <button
            className="btn btn-dark"
            style={{ fontSize: '0.58rem', padding: '9px 20px' }}
            onClick={handleAdd}
            disabled={adding || !selectedId}
          >
            {adding ? 'Adding…' : 'Add to Cart'}
          </button>
        ) : (
          <span className="shop-unconfigured">
            Connect Shopify to enable checkout
          </span>
        )}
      </div>
    </article>
  )
}

/* ── Page ─────────────────────────────────────────────────── */
export default function Shop() {
  const [searchParams] = useSearchParams()
  const [tab, setTab]  = useState('prints')
  const [live, setLive]  = useState({ prints: [], apparel: [] })
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (searchParams.get('tab') === 'apparel') setTab('apparel')
    else setTab('prints')
  }, [searchParams])

  useEffect(() => {
    if (!isConfigured) return
    setFetching(true)
    getProducts(50)
      .then(all => setLive(classify(all)))
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [])

  const prints  = isConfigured ? live.prints  : STATIC_PRINTS
  const apparel = isConfigured ? live.apparel : STATIC_APPAREL
  const current = tab === 'prints' ? prints : apparel

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="tag">Eliza Cay</span>
          <h1>Shop</h1>
          <p>
            Limited-edition fine art prints and original designs
            on quality apparel — all shipped with care.
          </p>
          {!isConfigured && (
            <p className="shop-config-notice">
              Add your Shopify credentials to <code>.env</code> to enable live
              products and checkout.
            </p>
          )}
        </div>
      </div>

      <div className="container">
        <div className="shop-tabs">
          <button className={tab === 'prints'  ? 'active' : ''} onClick={() => setTab('prints')}>
            Art Prints
          </button>
          <button className={tab === 'apparel' ? 'active' : ''} onClick={() => setTab('apparel')}>
            Apparel
          </button>
        </div>

        <section className="shop-section">
          {fetching ? (
            <div className="shop-loading">Loading products…</div>
          ) : (
            <div className="product-grid">
              {current.map((p, i) => (
                <ProductCard key={p.id} product={p} />
              ))}
              {current.length === 0 && isConfigured && (
                <p className="shop-empty">
                  No {tab} found. Make sure your Shopify products have a
                  <strong> Product type</strong> set.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
