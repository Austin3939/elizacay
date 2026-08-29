import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getProducts, isConfigured } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import ArtPlaceholder from '../components/ArtPlaceholder'

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
        <button
          className="btn btn-dark"
          style={{ fontSize: '0.58rem', padding: '9px 20px' }}
          onClick={handleAdd}
          disabled={adding || !selectedId}
        >
          {adding ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}

/* ── Empty / coming-soon state ───────────────────────────── */
function ShopComingSoon() {
  return (
    <section className="shop-section">
      <div className="coming-soon">
        <img src="/images/botanical.png" alt="" className="coming-soon-mark" />
        <p className="coming-soon-title">The shop is being stocked.</p>
        <p className="coming-soon-body">
          New prints and apparel are on their way. Check back soon — or join the
          list below and I'll let you know the moment they land.
        </p>
        <Link to="/#newsletter" className="btn btn-dark">Join the List</Link>
      </div>
    </section>
  )
}

/* ── Page ─────────────────────────────────────────────────── */
export default function Shop() {
  const [searchParams] = useSearchParams()
  const [tab, setTab]  = useState('prints')
  const [live, setLive]  = useState({ prints: [], apparel: [] })
  const [fetching, setFetching] = useState(isConfigured)

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

  const { prints, apparel } = live
  const hasAny = prints.length + apparel.length > 0
  const current = tab === 'prints' ? prints : apparel

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="tag">Eliza Cay</span>
          <h1>Shop</h1>
          <p>
            Limited-edition prints and original designs on quality apparel —
            all shipped with care.
          </p>
        </div>
      </div>

      <div className="container">
        {fetching ? (
          <section className="shop-section">
            <div className="shop-loading">Loading the shop…</div>
          </section>
        ) : !hasAny ? (
          <ShopComingSoon />
        ) : (
          <>
            <div className="shop-tabs">
              <button className={tab === 'prints'  ? 'active' : ''} onClick={() => setTab('prints')}>
                Art Prints
              </button>
              <button className={tab === 'apparel' ? 'active' : ''} onClick={() => setTab('apparel')}>
                Apparel
              </button>
            </div>

            <section className="shop-section">
              <div className="product-grid">
                {current.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
                {current.length === 0 && (
                  <p className="shop-empty">
                    Nothing in {tab === 'prints' ? 'prints' : 'apparel'} just yet — check back soon.
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  )
}
