import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct, isConfigured } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import ArtPlaceholder from '../components/ArtPlaceholder'
import Seo from '../components/Seo'

export default function Product() {
  const { handle } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(isConfigured)
  const [adding, setAdding]   = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return }
    setProduct(null)
    setLoading(true)
    getProduct(handle)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [handle])

  const variants = product?.variants?.edges?.map(e => e.node) ?? []

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants.find(v => v.availableForSale) ?? variants[0])
    }
  }, [product])

  const title    = product?.title ?? ''
  const type     = product?.productType ?? ''
  const desc     = product?.description ?? ''
  const imageUrl = product?.images?.edges?.[0]?.node?.url ?? null
  const imageAlt = product?.images?.edges?.[0]?.node?.altText || title

  const displayPrice = (() => {
    if (!selectedVariant) return ''
    const amt = parseFloat(selectedVariant.price.amount)
    const cur = selectedVariant.price.currencyCode
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(amt)
  })()

  const handleAdd = async () => {
    if (!selectedVariant) return
    setAdding(true)
    await addToCart(selectedVariant.id, 1)
    setAdding(false)
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <p>Loading…</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <p>This piece isn't available right now.</p>
        <Link to="/shop" className="btn btn-dark" style={{ marginTop: 24 }}>← Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="product-page">
      <Seo
        title={title}
        description={desc || `${title} — ${type || 'artwork'} by eliza cay.`}
        image={imageUrl || undefined}
        path={`/product/${handle}`}
      />

      <div className="container">
        <Link to="/shop" className="product-back">← Shop</Link>

        <div className="product-split">
          <div className="product-image-wrap">
            {imageUrl
              ? <img src={imageUrl} alt={imageAlt} />
              : <ArtPlaceholder />
            }
          </div>

          <div className="product-body">
            {type && <span className="tag" style={{ margin: '0 0 12px' }}>{type}</span>}
            <h1 className="product-title">{title}</h1>
            <div className="product-rule" />
            <span className="product-price">{displayPrice}</span>

            {variants.length > 1 && (
              <div className="product-variants">
                <span className="product-variant-label">
                  {type.toLowerCase().includes('apparel') ? 'Size' : 'Size / Format'}
                </span>
                <div className="product-variant-pills">
                  {variants.map(v => (
                    <button
                      key={v.id}
                      className={`variant-pill${selectedVariant?.id === v.id ? ' active' : ''}${!v.availableForSale ? ' sold-out' : ''}`}
                      onClick={() => v.availableForSale && setSelectedVariant(v)}
                      disabled={!v.availableForSale}
                    >
                      {v.title}{!v.availableForSale ? ' — Sold out' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn btn-dark product-atc"
              onClick={handleAdd}
              disabled={adding || !selectedVariant?.availableForSale}
            >
              {adding ? 'Adding…' : 'Add to Cart'}
            </button>

            {desc && (
              <>
                <hr className="product-divider" />
                <p className="product-description">{desc}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
