import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'

const SITE_URL = 'https://elizacaystudio.com'

// Static routes worth prerendering to real HTML so crawlers that don't run JS
// (Pinterest, Facebook, Twitter) get correct <title>/OG tags. Dynamic
// product/design routes are left to client-side rendering.
const PRERENDER_ROUTES = ['/', '/gallery', '/shop', '/commission', '/about', '/join', '/404']

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: PRERENDER_ROUTES,
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        // Give client-side data (Shopify) a chance to resolve into the snapshot
        // once the store is populated; harmless while it's empty.
        renderAfterTime: 1500,
        // --no-sandbox is required in most CI containers (Netlify included).
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      postProcess(route) {
        // Rewrite the dev-server origin used during prerender to the real site.
        route.html = route.html
          .replace(/(https?:)?\/\/(localhost|127\.0\.0\.1):\d+/gi, SITE_URL)
      },
    }),
  ],
})
