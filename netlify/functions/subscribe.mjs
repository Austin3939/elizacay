/*
 * Newsletter signup → Shopify customer with email-marketing consent.
 * The site then sends newsletters from Shopify Admin → Marketing → Shopify Email.
 *
 * Required Netlify environment variables (Site settings → Environment variables):
 *   SHOPIFY_STORE_DOMAIN     e.g. eliza-cay-studio.myshopify.com
 *   SHOPIFY_ADMIN_API_TOKEN  Admin API access token (starts shpat_...) with the
 *                            write_customers scope. This is a SECRET — never
 *                            prefix it VITE_, never log it, and scope it to the
 *                            Production deploy context so previews can't use it.
 *
 * Hardening in here is deliberately lightweight (honeypot + origin allowlist +
 * best-effort in-memory rate limit). For a hard cap, add a Netlify Rate
 * Limiting rule on /.netlify/functions/* and keep Shopify double opt-in on.
 */

const API_VERSION = '2024-10'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ALLOWED_ORIGINS = [
  'https://elizacaystudio.com',
  'https://www.elizacaystudio.com',
  'https://elizacay.netlify.app',
  'http://localhost',
]

// Best-effort: only sees requests that hit the same warm instance. Not a guarantee.
const RATE_LIMIT = 5 // requests…
const RATE_WINDOW_MS = 60_000 // …per minute per IP
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear() // crude memory bound
  return recent.length > RATE_LIMIT
}

function originAllowed(req) {
  const src = req.headers.get('origin') || req.headers.get('referer') || ''
  if (!src) return false
  // match exact, path (referer), or :port (localhost under `netlify dev`)
  return ALLOWED_ORIGINS.some(
    (o) => src === o || src.startsWith(o + '/') || src.startsWith(o + ':'),
  )
}

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export default async (req, context) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' })
  if (!originAllowed(req)) return json(403, { error: 'Forbidden' })

  const ip =
    context?.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown'
  if (rateLimited(ip)) {
    return json(429, { error: 'Too many requests. Please try again shortly.' })
  }

  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN
  if (!domain || !token) return json(500, { error: 'Signup is not configured yet.' })

  let email, trap
  try {
    const data = await req.json()
    email = String(data.email || '').trim().toLowerCase()
    trap = String(data.company || '').trim() // honeypot
  } catch {
    return json(400, { error: 'Invalid request.' })
  }

  // Honeypot filled → almost certainly a bot. Return success, do nothing.
  if (trap) return json(200, { ok: true })

  if (!EMAIL_RE.test(email)) {
    return json(400, { error: 'Please enter a valid email address.' })
  }

  const res = await fetch(
    `https://${domain}/admin/api/${API_VERSION}/customers.json`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        customer: {
          email,
          tags: 'newsletter, website-signup',
          email_marketing_consent: {
            state: 'subscribed',
            // Shopify honours the store's double opt-in setting regardless;
            // switch to 'confirmed_opt_in' to force confirmation from here.
            opt_in_level: 'single_opt_in',
            consent_updated_at: new Date().toISOString(),
          },
        },
      }),
    },
  )

  if (res.ok) return json(200, { ok: true })

  const detail = await res.text().catch(() => '')

  // Already a customer: return the SAME response as a fresh signup so the
  // endpoint can't be used to probe which addresses exist.
  if (res.status === 422 && detail.includes('has already been taken')) {
    return json(200, { ok: true })
  }

  console.error('Shopify customer create failed', res.status, detail)
  return json(502, { error: 'Could not subscribe right now. Please try again later.' })
}
