import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProducts, isConfigured } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import ArtPlaceholder from '../components/ArtPlaceholder'
import SocialLinks from '../components/SocialLinks'
import NewsletterSignup from '../components/NewsletterSignup'

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
      <Link to={`/product/${product.handle}`} className="art-card-image-link">
        <div className="art-card-image">
          {firstImg
            ? <img src={firstImg.url} alt={firstImg.altText || product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <ArtPlaceholder />
          }
        </div>
      </Link>
      <div className="art-card-info">
        <Link to={`/product/${product.handle}`} className="art-card-title-link">
          <span className="art-card-title">{product.title}</span>
        </Link>
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

export default function Home() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    if (!isConfigured) return
    getFeaturedProducts(3).then(setFeatured).catch(console.error)
  }, [])

  const showFeatured = isConfigured && featured.length > 0

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
            shop limited prints/apparel &nbsp;·&nbsp; original art &nbsp;·&nbsp; commissions
          </p>
          <div className="hero-cta">
            <Link to="/shop" className="btn btn-light">Shop Prints</Link>
            <Link to="/commission" className="btn btn-light">Commission Work</Link>
          </div>
          <div className="hero-social">
            <SocialLinks variant="light" />
          </div>
        </div>
      </section>

      {/* ── Featured Works (only when live products exist) ── */}
      {showFeatured && (
        <section className="featured">
          <div className="container">
            <div className="ruled-heading">
              <span className="tag" style={{ margin: 0 }}>Featured Works</span>
            </div>

            <div className="featured-grid">
              {featured.map(p => <FeaturedCard key={p.id} product={p} />)}
            </div>

            <div className="featured-footer">
              <Link to="/gallery" className="btn btn-dark">View Full Gallery</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Shop Teaser ───────────────────────────────────── */}
      <section className="shop-teaser">
        <div className="container">
          <span className="tag tag-light">The Shop</span>
          <div className="shop-teaser-grid">
            <div className="shop-teaser-card">
              <h3>Art Prints</h3>
              <p>
                Limited-edition prints of original block prints and illustration,
                printed with care to keep the detail and texture of the original.
              </p>
              <Link to="/shop?tab=prints" className="btn btn-light" style={{ alignSelf: 'flex-start' }}>
                Browse Prints
              </Link>
            </div>
            <div className="shop-teaser-card">
              <h3>Apparel</h3>
              <p>
                Wearable art — original folk patterns and modern doodles printed
                on quality tees, each design exclusive to eliza cay.
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
            <h2>Wander and wonder.<br />What can we create together?</h2>
            <p>
              Work directly with Liz to make a piece that's entirely your own —
              a story, a place, a moment given life by hand.
            </p>
            <Link to="/commission" className="btn btn-outline-olive">
              Start a Project
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────── */}
      <NewsletterSignup variant="section" />
    </>
  )
}
