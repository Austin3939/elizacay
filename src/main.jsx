import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

/*
 * Routes are prerendered to static HTML (see vite.config.js) so crawlers and
 * social scrapers get real <title>/OG tags and users get an instant first paint.
 * We render rather than hydrate: headless Chrome normalizes inline styles and
 * text nodes when it serializes each page, which would mismatch this app's many
 * `style={{}}` / `{' '}` nodes on hydration. React replaces the prerendered
 * markup with identical output, so there's no visible change.
 */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
