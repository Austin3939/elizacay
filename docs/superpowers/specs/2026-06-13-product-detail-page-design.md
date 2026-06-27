# Product Detail Page — Design Spec

**Date:** 2026-06-13
**Status:** Approved

---

## Goal

When a user clicks a product in the shop grid they navigate to a dedicated product detail page — a standard e-commerce PDP showing the artwork, title, price, variant selector, Add to Cart, and product description.

---

## User Decisions

| Question | Choice |
|---|---|
| Page layout | Stacked — full-width image at top, content below |
| Shop card interaction | Image + title are the link; "Add to Cart" stays on the card |
| Content sections | Buy section (tag, title, price, variants, Add to Cart) + description |

---

## Routes

| Route | Component | Notes |
|---|---|---|
| `/product/:handle` | `src/pages/Product.jsx` | New |

The `:handle` param maps to the Shopify product handle (e.g. `bell-flower-study-i`). Static fallback products use the same handle convention.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/shopify.js` | Add `handle` to `PRODUCT_FIELDS`; add `getProduct(handle)` query |
| `src/pages/Product.jsx` | New page component |
| `src/pages/Shop.jsx` | Add `handle` to static product data; wrap card image + title in `<Link>` |
| `src/App.jsx` | Register `/product/:handle` route |
| `src/index.css` | Add `.product-*` CSS classes |

---

## shopify.js Changes

### PRODUCT_FIELDS

Add `handle` to the shared field fragment so all list queries (Shop, Home featured) include it:

```graphql
id
handle       # ← add this
title
description
productType
...
```

### getProduct(handle)

New query with expanded fields for the detail view:

```graphql
query GetProduct($handle: String!) {
  product(handle: $handle) {
    id
    handle
    title
    description
    productType
    priceRange { minVariantPrice { amount currencyCode } }
    images(first: 10) { edges { node { url altText } } }
    variants(first: 20) {
      edges {
        node { id title availableForSale price { amount currencyCode } }
      }
    }
  }
}
```

Returns `data.product` directly (null if not found — no throw).

---

## Shop.jsx Changes

### Static product data

Add a `handle` field to every entry in `STATIC_PRINTS` and `STATIC_APPAREL`:

```js
{ id: 's1', handle: 'bell-flower-study-i', title: 'Bell Flower Study I', ... }
```

Handles follow kebab-case derived from the title.

### normalize()

Add `handle: product.handle` to the returned object.

### ProductCard

Wrap the `.art-card-image` div and `.art-card-title` span in a single `<Link to={/product/${product.handle}}>`. Style it with `text-decoration: none; color: inherit; display: contents` so it doesn't alter the existing card layout.

The `.art-card-actions` div and "Add to Cart" button are **not** wrapped — they continue to add directly to the cart without navigating.

Static products (no Shopify) also link to `/product/:handle`; the product page handles their static fallback rendering.

---

## Product.jsx

### Static fallback data

A `STATIC_PRODUCTS` object keyed by handle provides the fallback for each product:

```js
const STATIC_PRODUCTS = {
  'bell-flower-study-i': {
    handle: 'bell-flower-study-i',
    title: 'Bell Flower Study I',
    type: 'Art Print',
    price: '$45',
    placeholderIndex: 0,
    tab: 'prints',
    description: 'Placeholder — add your product description here.',
    variants: [
      { id: 'p-sm', title: '5 × 7 in',   price: '$28', availableForSale: true },
      { id: 'p-md', title: '8 × 10 in',  price: '$45', availableForSale: true },
      { id: 'p-lg', title: '11 × 14 in', price: '$65', availableForSale: true },
    ],
  },
  // ... one entry per static product
}
```

Apparel products use tee size variants (S / M / L / XL, all $38).

### Component logic

```
const staticProduct = STATIC_PRODUCTS[handle] ?? null
const [product, setProduct] = useState(null)
const [loading, setLoading] = useState(isConfigured)  // prevents not-found flash

// selectedVariant drives both the price display and the Add to Cart variantId
// initialised to the first availableForSale variant, falls back to variants[0]
const variants = (isConfigured && product)
  ? product.variants.edges.map(e => e.node)
  : staticProduct?.variants ?? []
const [selectedVariant, setSelectedVariant] = useState(
  variants.find(v => v.availableForSale) ?? variants[0] ?? null
)
// re-initialise selectedVariant when product loads from Shopify
useEffect — reset selectedVariant when product changes

useEffect — if isConfigured: getProduct(handle) → setProduct → setLoading(false)
```

Not-found condition: `!staticProduct && !product && !loading` → show "Product not found" + link back to `/shop`.

### Page layout (stacked)

```
<div className="product-page">
  <div className="container">

    {/* Image */}
    <div className="product-image-wrap">
      <img> or <ArtPlaceholder>
    </div>

    {/* Buy section */}
    <div className="product-body">
      <Link to="/shop" className="product-back">← Shop</Link>
      <span className="tag">{type}</span>
      <h1 className="product-title">{title}</h1>
      <span className="product-price">{selectedVariant.price}</span>
      {/* price reflects the currently selected variant — updates on pill click */}

      {/* Variants — only if more than one */}
      {variants.length > 1 && (
        <div className="product-variants">
          <span className="product-variant-label">Size</span>
          {variants.map(v => <button className="variant-pill ...">)}
        </div>
      )}

      <button className="btn btn-dark product-atc" onClick={handleAdd}>
        {adding ? 'Adding…' : 'Add to Cart'}
      </button>

      {/* Description */}
      {description && (
        <>
          <hr className="product-divider" />
          <p className="product-description">{description}</p>
        </>
      )}
    </div>

  </div>
</div>
```

The `variant-pill` class is already defined in the existing CSS (used by the Design page) — reuse it.

### Add to Cart

For Shopify products: uses the selected variant's `id` via `addToCart(variantId, 1)` from `useCart()`. Button disabled when `adding` or selected variant is not `availableForSale`.

For static products: `isConfigured` is false so the "Add to Cart" button is not rendered — a `<Link to="/shop" className="btn btn-dark">View in Shop</Link>` appears instead (same pattern as `StaticProductOption` on the Design page).

---

## CSS — New Classes

```css
.product-page          — min-height: 60vh, padding bottom
.product-image-wrap    — width 100%, max-height 520px, overflow hidden, background var(--cream-dark)
.product-image-wrap img — width 100%, height 100%, object-fit cover, object-position center
.product-body          — padding: 48px var(--pad) 80px, max-width 680px, margin 0 auto
.product-back          — mono, 0.6rem, charcoal-soft, no underline, block, mb 28px
.product-title         — font-size 2rem, weight 400, mb 16px
.product-price         — mono, 1rem, charcoal, block, mb 28px
.product-variant-label — mono, 0.6rem, uppercase, letter-spacing, charcoal-soft, block, mb 10px
.product-variants      — flex, flex-wrap, gap 8px, mb 28px
.product-atc           — width 100%, padding 14px, font-size 0.68rem
.product-divider       — border-top var(--line-soft), margin 32px 0
.product-description   — font-size 0.95rem, charcoal-soft, line-height 1.75
```

Responsive (≤ 600px): `.product-image-wrap` max-height 260px.

---

## Error & Loading States

| State | UI |
|---|---|
| Loading (Shopify configured) | Brief — `loading` starts true, page renders nothing until `setLoading(false)` |
| Product not found | "Product not found." + `← Back to Shop` link |
| Add to Cart error | Surfaced via `CartContext.error` → shown in the existing cart drawer error banner |
| Shopify not configured | Static data shown; "View in Shop" link instead of Add to Cart |

---

## Out of Scope

- Image thumbnail gallery (not selected)
- Accordion sections for shipping/size guide (not selected)
- Related products section
- Breadcrumb beyond the single "← Shop" back link
