import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProducts, isConfigured } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import ArtPlaceholder from '../components/ArtPlaceholder'

const STATIC_FEATURED = [
  { index: 0, title: 'Bell Flower Study',  medium: 'Digital illustration', price: '$45' },
  { index: 3, title: 'Moon & Branch',       medium: 'Digital illustration', price: '$52' },
  { index: 4, title: 'Leaf Circle',         medium: 'Digital illustration', price: '$48' },
]

function FeaturedCard({ product }) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const variants  = product.variants.edges.map(e => e.node)
  const firstImg  = product.images.edges[0]?.node
  const variant   = variants.find(v => v.availableForSale) ?? variants[0]
  const price     = parseFloat(product.priceRange.minVariantPrice.amount)
  const currency  = product.priceRange.minVariantPrice.currencyCode
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)

  const handleAdd = async () => {
    if (!variant) return
    setAdding(true)
    await addToCart(variant.id, 1)
    setAdding(false)
  }

  return (
    <article className="art-card">
      <div className="art-card-image">
        {firstImg
          ? <img src={firstImg.url} alt={firstImg.altText || product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <ArtPlaceholder index={0} />
        }
      </div>
      <div className="art-card-info">
        <span className="art-card-title">{product.title}</span>
        <span className="art-card-meta">{product.productType}</span>
        <span className="art-card-price">{formatted}</span>
      </div>
      <div className="art-card-actions">
        <button
          className="btn btn-dark"
          style={{ fontSize: '0.58rem', padding: '9px 20px' }}
          onClick={handleAdd}
          disabled={adding || !variant}
        >
          {adding ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}

function StaticCard({ item }) {
  return (
    <article className="art-card">
      <div className="art-card-image">
        <ArtPlaceholder index={item.index} />
      </div>
      <div className="art-card-info">
        <span className="art-card-title">{item.title}</span>
        <span className="art-card-meta">{item.medium}</span>
        <span className="art-card-price">{item.price}</span>
      </div>
      <div className="art-card-actions">
        <Link to="/shop" className="btn btn-dark" style={{ fontSize: '0.58rem', padding: '9px 20px' }}>
          View in Shop
        </Link>
      </div>
    </article>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    if (!isConfigured) return
    getFeaturedProducts(3).then(setFeatured).catch(console.error)
  }, [])

  const showLive = isConfigured && featured.length > 0

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-inner">
          <img
            src="/images/logo-full.png"
            alt="eliza cay"
            className="hero-logo"
          />
          <div className="hero-rule" />
          <p className="hero-sub">
            original art &nbsp;·&nbsp; limited prints &nbsp;·&nbsp; commission work
          </p>
          <div className="hero-cta">
            <Link to="/shop" className="btn btn-light">Shop Prints</Link>
            <Link to="/commission" className="btn btn-light">Commission Work</Link>
          </div>
        </div>
      </section>

      {/* ── Featured Works ────────────────────────────────── */}
      <section className="featured">
        <div className="container">
          <div className="ruled-heading">
            <span className="tag" style={{ margin: 0 }}>Featured Works</span>
          </div>

          <div className="featured-grid">
            {showLive
              ? featured.map(p => <FeaturedCard key={p.id} product={p} />)
              : STATIC_FEATURED.map(item => <StaticCard key={item.title} item={item} />)
            }
          </div>

          <div className="featured-footer">
            <Link to="/gallery" className="btn btn-dark">View Full Gallery</Link>
          </div>
        </div>
      </section>

      {/* ── Shop Teaser ───────────────────────────────────── */}
      <section className="shop-teaser">
        <div className="container">
          <span className="tag tag-light">The Shop</span>
          <div className="shop-teaser-grid">
            <div className="shop-teaser-card">
              <h3>Art Prints</h3>
              <p>
                Limited-edition fine art prints on archival paper. Each piece is
                printed with care to bring the original detail and colour to life
                in your home.
              </p>
              <Link to="/shop?tab=prints" className="btn btn-light" style={{ alignSelf: 'flex-start' }}>
                Browse Prints
              </Link>
            </div>
            <div className="shop-teaser-card">
              <h3>Apparel</h3>
              <p>
                Wearable art — original botanical and illustrative designs printed
                on quality tees. Each design is exclusive to eliza cay.
              </p>
              <Link to="/shop?tab=apparel" className="btn btn-light" style={{ alignSelf: 'flex-start' }}>
                Browse Apparel
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Commission Teaser ─────────────────────────────── */}
      <section className="commission-teaser">
        <div className="container">
          <div className="commission-teaser-inner">
            <span className="tag">Commission Work</span>
            <h2>Something made just for you.</h2>
            <p>
              Work directly with Eliza to create a piece that's entirely your own —
              a portrait, a place, a moment. Commission slots open quarterly.
            </p>
            <Link to="/commission" className="btn btn-outline-olive">
              Start a Project
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
