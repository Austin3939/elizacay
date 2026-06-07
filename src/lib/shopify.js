const DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
const TOKEN  = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN

export const isConfigured =
  Boolean(DOMAIN && TOKEN &&
    !DOMAIN.includes('your-store') &&
    !TOKEN.includes('your-storefront'))

const API_URL = `https://${DOMAIN}/api/2024-10/graphql.json`

async function gql(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data
}

/* ── Shared cart shape ───────────────────────────────────── */
const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product {
              title
              images(first: 1) { edges { node { url altText } } }
            }
          }
        }
      }
    }
  }
  cost {
    totalAmount { amount currencyCode }
  }
`

/* ── Shared product fields ───────────────────────────────── */
const PRODUCT_FIELDS = `
  id
  title
  description
  productType
  tags
  priceRange {
    minVariantPrice { amount currencyCode }
  }
  images(first: 3) { edges { node { url altText } } }
  variants(first: 10) {
    edges {
      node {
        id
        title
        availableForSale
        price { amount currencyCode }
      }
    }
  }
`

/* ── Products ────────────────────────────────────────────── */
export async function getProducts(first = 50) {
  const data = await gql(`
    query Products($first: Int!) {
      products(first: $first) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }
  `, { first })
  return data.products.edges.map(e => e.node)
}

export async function getFeaturedProducts(first = 6) {
  const data = await gql(`
    query FeaturedProducts($first: Int!) {
      products(first: $first, query: "tag:featured") {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }
  `, { first })
  return data.products.edges.map(e => e.node)
}

/* ── Collections ─────────────────────────────────────────── */
export async function getCollections(first = 20) {
  const data = await gql(`
    query Collections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            image { url altText }
          }
        }
      }
    }
  `, { first })
  return data.collections.edges.map(e => e.node)
}

export async function getCollectionProducts(handle) {
  const data = await gql(`
    query CollectionProducts($handle: String!) {
      collection(handle: $handle) {
        title
        image { url altText }
        products(first: 20) {
          edges { node { ${PRODUCT_FIELDS} } }
        }
      }
    }
  `, { handle })
  return data.collection
}

/* ── Cart mutations ──────────────────────────────────────── */
export async function cartCreate(variantId, quantity = 1) {
  const data = await gql(`
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `, { input: { lines: [{ merchandiseId: variantId, quantity }] } })
  if (data.cartCreate.userErrors.length)
    throw new Error(data.cartCreate.userErrors[0].message)
  return data.cartCreate.cart
}

export async function cartLinesAdd(cartId, variantId, quantity = 1) {
  const data = await gql(`
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
      }
    }
  `, { cartId, lines: [{ merchandiseId: variantId, quantity }] })
  return data.cartLinesAdd.cart
}

export async function cartLinesUpdate(cartId, lineId, quantity) {
  const data = await gql(`
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
      }
    }
  `, { cartId, lines: [{ id: lineId, quantity }] })
  return data.cartLinesUpdate.cart
}

export async function cartLinesRemove(cartId, lineIds) {
  const data = await gql(`
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
      }
    }
  `, { cartId, lineIds })
  return data.cartLinesRemove.cart
}

export async function getCart(cartId) {
  const data = await gql(`
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FIELDS} }
    }
  `, { cartId })
  return data.cart
}
