# Sep 25 Burndown — Event Readiness

Event date: **2026-09-25** (14 days out). Goal: site is promotable and can actually sell at the event.

## From client (Liz) — prioritized

1. **Add Shopify Admin API credentials to Netlify** (hard blocker — email signup is currently broken)
   - Netlify only has `VITE_SHOPIFY_STORE_DOMAIN` / `VITE_SHOPIFY_STOREFRONT_TOKEN` (client-side, for browsing/cart).
   - The newsletter signup function (`netlify/functions/subscribe.mjs`) needs two *different*, currently-missing vars: `SHOPIFY_STORE_DOMAIN` (no `VITE_` prefix) and `SHOPIFY_ADMIN_API_TOKEN` (Admin API token, `write_customers` scope — create via Shopify Admin → Settings → Apps and sales channels → Develop apps).
   - Scope the Admin token to the **Production** deploy context only in Netlify.
   - Without this, every signup at the event fails silently to "Signup is not configured yet."
2. **Add products to Shopify** (hard blocker — nothing sells without this)
   - Photograph pieces
   - Create listings: price, inventory count
   - Set **Product Type** to `Print` or `Apparel` (controls Shop/Gallery sorting)
   - Publish to Online Store / Headless sales channel
3. **Shopify commerce settings** (hard blocker — checkout can fail without this)
   - Confirm Shopify Payments is activated and verified
   - Configure shipping rates/zones
   - Confirm tax settings
4. **Commission policy real numbers** (lower priority — doesn't block selling prints)
   - Real turnaround estimate
   - Deposit %
   - Revision count
   - (Currently vague placeholder language in `src/pages/Commission.jsx`)
5. **Netlify Forms notification email**
   - Confirm Liz knows where commission-form submissions land (Netlify dashboard → Forms → notifications)

## Dev — prioritized

1. **`/join` QR landing page** — bare page (no nav/footer) with just the email signup form, for event signage/QR code. Built, in PR.
2. **End-to-end checkout test** once real products exist — add to cart → Shopify checkout → payment, desktop + mobile
3. **Mobile pass** on Shop/Gallery/Product pages — event traffic will mostly be phones scanning a QR code
4. **Verify Shop/Gallery empty-state → populated transition** — no leftover "coming soon" copy, images load, price/inventory correct
5. **Generate + print QR code** pointing to `https://elizacaystudio.com/join` for event signage (any free QR generator — no code needed)
6. **Update commission page copy** once real policy numbers come back from Liz (can slip past the event)

## Already done (verified against current code, not the stale `ProjectOverview.md`)

- About page content (real bio/taglines) — PR #9
- Artist photo (`public/images/artist-photo.jpg`)
- Real social handles (Instagram/TikTok/Pinterest) in `src/data/social.js`
- Commission form delivery wired to Netlify Forms; newsletter wired to Shopify — PR #12
- Prerender route list (`vite.config.js`) in sync with `src/App.jsx`
- `/join` event signup landing page — this PR
