# Eliza Cay — Artist Portfolio & Shop

A single-page React application for showcasing artwork and selling prints and apparel through Shopify.

## Tech Stack

- **React 18** + **Vite 5** — build tooling and dev server
- **React Router v6** — client-side routing
- **Shopify Storefront API** — live products, cart, and checkout
- Vanilla CSS with CSS custom properties (no Tailwind, no CSS-in-JS)

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, featured works, shop teaser, commission teaser |
| `/gallery` | Gallery grid — links to individual design pages |
| `/design/:slug` | Design detail — artwork + buy options (print & apparel) |
| `/shop` | Full shop — Art Prints and Apparel tabs |
| `/commission` | Commission inquiry form + process overview |
| `/about` | Artist bio, story, and philosophy |

## Getting Started

```bash
npm install
npm run dev
```

The site works without Shopify credentials — placeholder artwork and static product listings are shown until you connect the store.

## Environment variables

Copy `.env.example` to `.env` and fill it in. `.env.example` is the authoritative
list; the short version:

| Variable | Required | Notes |
|---|---|---|
| `VITE_SHOPIFY_STORE_DOMAIN` | yes | `your-store.myshopify.com`, no `https://` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | yes | Public Storefront token — see below |
| `VITE_INSTAGRAM_URL` / `VITE_TIKTOK_URL` / `VITE_PINTEREST_URL` | no | Override the `@elizacaystudio` defaults in `src/data/social.js` |
| `SHOPIFY_STORE_DOMAIN` | for newsletter | Server-side only (Netlify Function). Same value as `VITE_SHOPIFY_STORE_DOMAIN` |
| `SHOPIFY_ADMIN_API_TOKEN` | for newsletter | **Secret.** Admin API token with `write_customers`. Used by `netlify/functions/subscribe.mjs` only — never bundled |

`VITE_*` values are inlined into the client bundle at **build time**. The two
non-`VITE_` Shopify vars are read at request time by the newsletter function and
must never be exposed to the client. On Netlify all of these go in **Site
settings → Environment variables**; changes take effect on the next deploy.
Never commit `.env`.

### Forms

- **Commission enquiries** — [Netlify Forms](https://docs.netlify.com/forms/setup/).
  A hidden detection form lives in `index.html`; `src/pages/Commission.jsx` submits
  to it via `fetch`. Submissions appear in the Netlify dashboard (**Forms**). Only
  works on a deployed site or under `netlify dev`, not `npm run preview`.
- **Newsletter** — `netlify/functions/subscribe.mjs` creates a Shopify customer
  with email-marketing consent; send campaigns from **Shopify Admin → Marketing →
  Shopify Email**. Requires the two `SHOPIFY_*` vars above. The function is public,
  so it also does a honeypot check, an origin allowlist, and a best-effort
  in-memory rate limit — scope `SHOPIFY_ADMIN_API_TOKEN` to the Production context
  and keep Shopify double opt-in on for real protection.

The site runs without any of these — placeholder artwork and empty "coming soon"
states show until Shopify is connected.

### Getting the Storefront token

Install the **Headless** app in Shopify, then: Admin → Sales channels → Headless
→ your storefront → Storefront API → Manage → copy the **Public access token**.
It's safe to expose in client JS; it ships in the bundle by design.

Once configured, the site fetches live products, collections, and manages a real Shopify cart with checkout.

### Shopify Setup for Gallery + Design Pages

Each artwork design corresponds to a Shopify **collection** whose handle matches the design slug (e.g., `bell-flower`). Add both the print and the tee product to that collection so they appear together on the design detail page.

### Shopify Setup for Shop Tabs

Products appear in the correct tab based on `Product type` in Shopify Admin:

- **Art Prints tab** — leave Product type blank, or use `Print` / `Art Print`
- **Apparel tab** — set Product type to `T-Shirt`, `Apparel`, `Clothing`, `Top`, or add one of those as a tag

Featured products on the home page are pulled using the `featured` tag.

## Commission Form

The form UI is complete. Wire up submission in `src/pages/Commission.jsx` inside the `submit` handler — replace the placeholder comment with your preferred service:

- **[Formspree](https://formspree.io)** — add a `<form action="https://formspree.io/f/YOUR_ID">` or use their fetch API
- **[EmailJS](https://www.emailjs.com)** — call `emailjs.send()` with the form fields
- **Custom backend** — POST `form` state as JSON to your own endpoint

Until wired up, the form shows a success message but does not send any data.

## Content to Replace

All placeholder content is marked with `✏️ CLIENT:` comments. Key items:

- `src/pages/About.jsx` — artist bio, photo, and philosophy values
- `src/pages/Commission.jsx` — hero tagline
- `src/pages/Home.jsx` — static featured card titles (replaced automatically once Shopify is connected)
- `public/images/` — `logo-full.png`, `logo-frame.png`, `botanical.png`

## Build & Deploy

```bash
npm run build   # vite build + prerender → /dist
npm run preview # preview the production build locally
```

`npm run build` also prerenders the static routes (`/`, `/gallery`, `/shop`,
`/commission`, `/about`, `/404`) to real HTML via headless Chrome, so the build
downloads Chromium on first `npm install` and takes ~1–2 min longer. Route list
lives in `vite.config.js` and must stay in sync with `src/App.jsx`.

Deploy `/dist` to any static host (Netlify, Vercel, Cloudflare Pages) configured
to serve `index.html` for unmatched routes (SPA fallback — see `public/_redirects`).

Set every environment variable from the table above in the host's dashboard
(at minimum the two `VITE_SHOPIFY_*` values) and redeploy. Do not commit `.env`.

## Known Issues

- **Commission form** — submission currently shows a confirmation but sends no data. See "Commission Form" section above.
- **`/lantern-test`** — a development test route included in the current build; should be removed before launch.
- **Cart mutation errors** — Shopify `userErrors` from `cartLinesAdd` / `cartLinesUpdate` / `cartLinesRemove` are not yet surfaced to the user.
