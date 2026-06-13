import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct, isConfigured } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import ArtPlaceholder from '../components/ArtPlaceholder'

const PRINT_VARIANTS = [
  { id: 'p-sm', title: '5 × 7 in',   price: '$28', availableForSale: true },
  { id: 'p-md', title: '8 × 10 in',  price: '$45', availableForSale: true },
  { id: 'p-lg', title: '11 × 14 in', price: '$65', availableForSale: true },
]

const TEE_VARIANTS = [
  { id: 't-s',  title: 'S',  price: '$38', availableForSale: true },
  { id: 't-m',  title: 'M',  price: '$38', availableForSale: true },
  { id: 't-l',  title: 'L',  price: '$38', availableForSale: true },
  { id: 't-xl', title: 'XL', price: '$38', availableForSale: true },
]

const STATIC_PRODUCTS = {
  'bell-flower-study-i':  { title: 'Bell Flower Study I',   type: 'Art Print', placeholderIndex: 0, variants: PRINT_VARIANTS, description: 'A delicate study of the bell flower form — rendered in fine line on archival paper. Available in three print sizes.' },
  'fern-pressed-series':  { title: 'Fern — Pressed Series', type: 'Art Print', placeholderIndex: 1, variants: PRINT_VARIANTS, description: 'Part of the Pressed Series — botanicals captured with a naturalist\'s precision. Archival giclée print.' },
  'waning-moon':          { title: 'Waning Moon',           type: 'Art Print', placeholderIndex: 3, variants: PRINT_VARIANTS, description: 'A study in negative space and soft line. The waning moon in fine ink on archival paper.' },
  'seed-pods-i':          { title: 'Seed Pods I',           type: 'Art Print', placeholderIndex: 5, variants: PRINT_VARIANTS, description: 'Seed pods in detailed line work — the first in a botanical study series. Archival giclée print.' },
  'wreath-study':         { title: 'Wreath Study',          type: 'Art Print', placeholderIndex: 4, variants: PRINT_VARIANTS, description: 'A circular botanical composition in fine ink. Archival giclée print on heavyweight paper.' },
  'bell-flower-study-ii': { title: 'Bell Flower Study II',  type: 'Art Print', placeholderIndex: 0, variants: PRINT_VARIANTS, description: 'The second in the bell flower series — a closer study of form and shadow. Archival giclée print.' },
  'wreath-tee':           { title: 'Wreath Tee',       type: 'Apparel', placeholderIndex: 4, variants: TEE_VARIANTS, description: 'The Wreath design on a quality unisex tee. Soft hand-feel, relaxed fit. Printed in-house on bone.' },
  'bell-flower-tee':      { title: 'Bell Flower Tee',  type: 'Apparel', placeholderIndex: 0, variants: TEE_VARIANTS, description: 'The Bell Flower illustration on a quality unisex tee. Soft hand-feel, relaxed fit. Printed on sage.' },
  'forest-floor-tee':     { title: 'Forest Floor Tee', type: 'Apparel', placeholderIndex: 2, variants: TEE_VARIANTS, description: 'The Forest Floor design on a quality unisex tee. Soft hand-feel, relaxed fit. Printed on off-white.' },
  'moon-tee':             { title: 'Moon Tee',         type: 'Apparel', placeholderIndex: 3, variants: TEE_VARIANTS, description: 'The Waning Moon illustration on a quality unisex tee. Soft hand-feel, relaxed fit. Printed on charcoal.' },
}

export default function Product() {
  const { handle } = useParams()
  const { addToCart } = useCart()

  const staticProduct = STATIC_PRODUCTS[handle] ?? null

  const [liveProduct, setLiveProduct] = useState(null)
  const [loading, setLoading]         = useState(isConfigured)
  const [adding, setAdding]           = useState(false)

  useEffect(() => {
    if (!isConfigured) return
    setLoading(true)
    getProduct(handle)
      .then(setLiveProduct)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [handle])

  /* Resolve data source */
  const source = (isConfigured && liveProduct) ? 'live' : 'static'
  const title   = liveProduct?.title ?? staticProduct?.title ?? ''
  const type    = liveProduct?.productType ?? staticProduct?.type ?? ''
  const desc    = liveProduct?.description ?? staticProduct?.description ?? ''
  const imageUrl = liveProduct?.images?.edges?.[0]?.node?.url ?? null
  const imageAlt = liveProduct?.images?.edges?.[0]?.node?.altText || title

  const rawVariants = source === 'live'
    ? (liveProduct?.variants?.edges?.map(e => e.node) ?? [])
    : (staticProduct?.variants ?? [])

  const [selectedVariant, setSelectedVariant] = useState(
    rawVariants.find(v => v.availableForSale) ?? rawVariants[0] ?? null
  )

  /* Re-initialise selected variant when live product loads */
  useEffect(() => {
    if (rawVariants.length > 0) {
      setSelectedVariant(rawVariants.find(v => v.availableForSale) ?? rawVariants[0])
    }
  }, [liveProduct])

  /* Displayed price — follows the selected variant */
  const displayPrice = (() => {
    if (!selectedVariant) return ''
    if (source === 'live') {
      const amt = parseFloat(selectedVariant.price.amount)
      const cur = selectedVariant.price.currencyCode
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(amt)
    }
    return selectedVariant.price
  })()

  const handleAdd = async () => {
    if (!selectedVariant || source !== 'live') return
    setAdding(true)
    await addToCart(selectedVariant.id, 1)
    setAdding(false)
  }

  /* Not found */
  if (!staticProduct && !liveProduct && !loading) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <p>Product not found.</p>
        <Link to="/shop" className="btn btn-dark" style={{ marginTop: 24 }}>← Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="product-page">
      {/* Image */}
      <div className="product-image-wrap">
        {imageUrl
          ? <img src={imageUrl} alt={imageAlt} />
          : staticProduct && <ArtPlaceholder index={staticProduct.placeholderIndex} />
        }
      </div>

      {/* Details */}
      <div className="container">
        <div className="product-body">
          <Link to="/shop" className="product-back">← Shop</Link>

          {type && <span className="tag" style={{ margin: '0 0 12px' }}>{type}</span>}
          <h1 className="product-title">{title}</h1>
          <span className="product-price">{displayPrice}</span>

          {rawVariants.length > 1 && (
            <div className="product-variants">
              <span className="product-variant-label">
                {type === 'Apparel' ? 'Size' : 'Size / Format'}
              </span>
              <div className="product-variant-pills">
                {rawVariants.map(v => (
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

          {isConfigured ? (
            <button
              className="btn btn-dark product-atc"
              onClick={handleAdd}
              disabled={adding || !selectedVariant?.availableForSale}
            >
              {adding ? 'Adding…' : 'Add to Cart'}
            </button>
          ) : (
            <Link to="/shop" className="btn btn-dark product-atc">
              View in Shop
            </Link>
          )}

          {desc && (
            <>
              <hr className="product-divider" />
              <p className="product-description">{desc}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
