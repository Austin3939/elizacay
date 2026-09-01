/*
 * Newsletter signup → Shopify customer with email-marketing consent.
 * The site then sends newsletters from Shopify Admin → Marketing → Shopify Email.
 *
 * Required Netlify environment variables (Site settings → Environment variables):
 *   SHOPIFY_STORE_DOMAIN     e.g. eliza-cay-studio.myshopify.com
 *   SHOPIFY_ADMIN_API_TOKEN  Admin API access token (starts shpat_...) with the
 *                            write_customers scope. This is a SECRET — it must
 *                            never be prefixed VITE_ and never reach the client.
 */

const API_VERSION = '2024-10'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' })

  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN
  if (!domain || !token) return json(500, { error: 'Signup is not configured yet.' })

  let email
  try {
    email = String((await req.json()).email || '').trim().toLowerCase()
  } catch {
    return json(400, { error: 'Invalid request.' })
  }
  if (!EMAIL_RE.test(email)) return json(400, { error: 'Please enter a valid email address.' })

  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/customers.json`, {
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
          // Shopify honours the store's double opt-in setting regardless; switch
          // to 'confirmed_opt_in' here if you want to force confirmation.
          opt_in_level: 'single_opt_in',
          consent_updated_at: new Date().toISOString(),
        },
      },
    }),
  })

  if (res.ok) return json(200, { ok: true })

  const detail = await res.text().catch(() => '')

  // Already a customer — treat as success rather than leaking that the address
  // exists. (A future enhancement could look them up and refresh consent.)
  if (res.status === 422 && detail.includes('has already been taken')) {
    return json(200, { ok: true, existing: true })
  }

  console.error('Shopify customer create failed', res.status, detail)
  return json(502, { error: 'Could not subscribe right now. Please try again later.' })
}
