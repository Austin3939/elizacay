/* ── Static design catalog ───────────────────────────────────────────────────
   Each entry represents one artwork design.
   - slug        → URL param + Shopify collection handle (must match exactly)
   - products    → static fallback products shown before Shopify is connected

   When Shopify IS connected the Design page fetches real products from the
   collection whose handle matches the slug. The artist creates one collection
   per design in Shopify admin and adds both the print and the tee to it.
   ─────────────────────────────────────────────────────────────────────────── */

const PRINT_VARIANTS = [
  { id: 'p-sm',  label: '5 × 7 in',   price: '$28' },
  { id: 'p-md',  label: '8 × 10 in',  price: '$45' },
  { id: 'p-lg',  label: '11 × 14 in', price: '$65' },
]

const TEE_VARIANTS = [
  { id: 't-s',  label: 'S',  price: '$38' },
  { id: 't-m',  label: 'M',  price: '$38' },
  { id: 't-l',  label: 'L',  price: '$38' },
  { id: 't-xl', label: 'XL', price: '$38' },
]

function makeProducts(slug, placeholderIndex) {
  return [
    {
      id:               `${slug}-print`,
      title:            'Art Print',
      type:             'Art Print',
      placeholderIndex,
      variants:         PRINT_VARIANTS,
    },
    {
      id:               `${slug}-tee`,
      title:            'T-Shirt',
      type:             'Apparel',
      placeholderIndex,
      variants:         TEE_VARIANTS,
    },
  ]
}

export const DESIGNS = [
  { slug: 'bell-flower',    placeholderIndex: 0, title: 'Bell Flower',    products: makeProducts('bell-flower',    0) },
  { slug: 'fern-study',     placeholderIndex: 1, title: 'Fern Study',     products: makeProducts('fern-study',     1) },
  { slug: 'forest-floor',   placeholderIndex: 2, title: 'Forest Floor',   products: makeProducts('forest-floor',   2) },
  { slug: 'waning-moon',    placeholderIndex: 3, title: 'Waning Moon',    products: makeProducts('waning-moon',    3) },
  { slug: 'wreath',         placeholderIndex: 4, title: 'Wreath',         products: makeProducts('wreath',         4) },
  { slug: 'seed-pods',      placeholderIndex: 5, title: 'Seed Pods',      products: makeProducts('seed-pods',      5) },
  { slug: 'bell-flower-ii', placeholderIndex: 0, title: 'Bell Flower II', products: makeProducts('bell-flower-ii', 0) },
  { slug: 'new-moon',       placeholderIndex: 3, title: 'New Moon',       products: makeProducts('new-moon',       3) },
  { slug: 'fern-study-ii',  placeholderIndex: 1, title: 'Fern Study II',  products: makeProducts('fern-study-ii',  1) },
]

export function getDesign(slug) {
  return DESIGNS.find(d => d.slug === slug) ?? null
}
