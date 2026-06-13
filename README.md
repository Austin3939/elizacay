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

## Connecting Shopify

Create a `.env` file in the project root:

```
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token
```

The Storefront Access Token is found in Shopify Admin → Apps → Develop apps → your app → API credentials. Enable the Storefront API with `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, and `unauthenticated_write_checkouts` scopes.

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
npm run build   # outputs to /dist
npm run preview # preview the production build locally
```

Deploy the `/dist` folder to any static host (Netlify, Vercel, Cloudflare Pages). Ensure the host is configured to serve `index.html` for all routes (SPA fallback).

Set the `VITE_SHOPIFY_*` environment variables in your host's dashboard — do not commit `.env` to version control.

## Known Issues

- **Commission form** — submission currently shows a confirmation but sends no data. See "Commission Form" section above.
- **`/lantern-test`** — a development test route included in the current build; should be removed before launch.
- **Cart mutation errors** — Shopify `userErrors` from `cartLinesAdd` / `cartLinesUpdate` / `cartLinesRemove` are not yet surfaced to the user.
