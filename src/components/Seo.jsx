import { useEffect } from 'react'

/*
 * Lightweight per-page metadata. No runtime dependency — sets document.title
 * and upserts <meta>/<link> tags directly. react-snap captures the resulting
 * <head> at build time so crawlers that don't run JS still see correct tags
 * for the prerendered routes.
 */

const SITE_NAME = 'eliza cay'
const SITE_URL = 'https://elizacaystudio.com'
const DEFAULT_DESC =
  'Block printing and illustration by Liz, a queer visual artist in Grand Rapids, Michigan. Limited-edition prints, apparel, and commission work.'
const DEFAULT_IMAGE = `${SITE_URL}/images/logo-full.png`

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!content) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({ title, description, image, path, noindex = false }) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME
  const desc = description || DEFAULT_DESC
  const url = path ? `${SITE_URL}${path}` : SITE_URL
  const img = image || DEFAULT_IMAGE

  useEffect(() => {
    document.title = fullTitle

    upsertMeta('name', 'description', desc)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : null)
    upsertLink('canonical', url)

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', desc)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', img)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', desc)
    upsertMeta('name', 'twitter:image', img)
  }, [fullTitle, desc, url, img, noindex])

  return null
}
