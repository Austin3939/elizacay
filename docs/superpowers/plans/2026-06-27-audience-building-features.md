# Audience-Building Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add newsletter signup, all three social platform links, and a Process Journal page to turn the site from a passive storefront into an active audience-building flywheel.

**Architecture:** Shared data and UI components are built first (`social.js`, `SocialLinks`, `NewsletterSignup`), then consumed by pages. The journal uses a static data file (`journal.js`) that the artist edits directly to add posts — no CMS needed. All new CSS goes into the existing `src/index.css`.

**Tech Stack:** React 18, React Router v6, Vite 5, single `src/index.css` stylesheet. No test framework installed — verification is browser-based via `npm run dev`.

## Global Constraints

- All CSS goes in `src/index.css` — no new CSS files, no CSS modules
- Follow existing CSS variable naming: `--olive`, `--cream`, `--charcoal`, `--font-mono`, `--font-serif`, `--font-serif-sc`
- All buttons use existing `.btn` classes: `.btn-dark`, `.btn-light`, `.btn-outline-olive`
- All SVG icons use `width="18" height="18"` and `aria-hidden="true"` unless they are standalone links, in which case use `aria-label` on the `<a>` tag
- Social URLs come from env vars — never hardcode. New vars: `VITE_INSTAGRAM_URL`, `VITE_TIKTOK_URL`, `VITE_PINTEREST_URL`, `VITE_NEWSLETTER_ACTION`
- All `<a>` to external sites use `target="_blank" rel="noopener noreferrer"`
- Existing patterns: data files in `src/data/`, pages in `src/pages/`, components in `src/components/`

---

### Task 1: Social config + SocialLinks component

**Files:**
- Create: `src/data/social.js`
- Create: `src/components/SocialLinks.jsx`
- Modify: `src/index.css` (append social link styles)

**Interfaces:**
- Produces: `SOCIAL` object from `src/data/social.js` (imported by SocialLinks and Footer)
- Produces: `<SocialLinks variant="dark|light" showLabels={bool} />` component

- [ ] **Step 1: Create `src/data/social.js`**

```js
export const SOCIAL = {
  instagram: import.meta.env.VITE_INSTAGRAM_URL || '',
  tiktok:    import.meta.env.VITE_TIKTOK_URL    || '',
  pinterest: import.meta.env.VITE_PINTEREST_URL  || '',
}
```

- [ ] **Step 2: Create `src/components/SocialLinks.jsx`**

```jsx
import { SOCIAL } from '../data/social'

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.84 4.84 0 01-1.01-.07z"/>
    </svg>
  )
}

function PinterestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  )
}

const ICONS = {
  instagram: { Icon: InstagramIcon, label: 'Instagram' },
  tiktok:    { Icon: TikTokIcon,    label: 'TikTok'    },
  pinterest: { Icon: PinterestIcon, label: 'Pinterest' },
}

export default function SocialLinks({ variant = 'dark', showLabels = false }) {
  const links = Object.entries(SOCIAL)
    .filter(([, href]) => href)
    .map(([key, href]) => ({ href, ...ICONS[key] }))

  if (links.length === 0) return null

  return (
    <div className={`social-links social-links--${variant}`}>
      {links.map(({ href, Icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="social-link"
        >
          <Icon />
          {showLabels && <span className="social-link-label">{label}</span>}
        </a>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Add social link CSS to `src/index.css`**

Append to the end of `src/index.css`:

```css
/* =====================
   Social Links
   ===================== */
.social-links {
  display: flex;
  align-items: center;
  gap: 16px;
}
.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}
.social-link:hover { opacity: 1; }
.social-links--dark  .social-link { color: var(--charcoal); }
.social-links--light .social-link { color: var(--cream); }
.social-link-label {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
```

- [ ] **Step 4: Add placeholder env vars to `.env` (create if it doesn't exist) and `.env.example`**

Check if `.env` exists: `ls C:/Users/ablac/source/ElizaCay/.env`

If `.env` exists, append these lines. If not, create it with these lines:
```
# Social media URLs (full URLs including https://)
VITE_INSTAGRAM_URL=
VITE_TIKTOK_URL=
VITE_PINTEREST_URL=

# Newsletter form action URL (from Mailchimp, Klaviyo, etc.)
VITE_NEWSLETTER_ACTION=
```

Create `C:/Users/ablac/source/ElizaCay/.env.example` with the same content.

- [ ] **Step 5: Verify in browser**

Run `npm run dev`. Navigate to any page. No visual change yet — this task only creates shared infrastructure. Check browser console: no import errors.

- [ ] **Step 6: Commit**

```bash
git add src/data/social.js src/components/SocialLinks.jsx src/index.css .env.example
git commit -m "feat: add social config and SocialLinks component"
```

---

### Task 2: NewsletterSignup component

**Files:**
- Create: `src/components/NewsletterSignup.jsx`
- Modify: `src/index.css` (append newsletter styles)

**Interfaces:**
- Consumes: `VITE_NEWSLETTER_ACTION` env var
- Produces: `<NewsletterSignup variant="section|compact" />` component
  - `section` — full dark-background section with heading, description, and email form
  - `compact` — minimal inline form for the footer

- [ ] **Step 1: Create `src/components/NewsletterSignup.jsx`**

```jsx
import { useState } from 'react'

const ACTION = import.meta.env.VITE_NEWSLETTER_ACTION || ''

export default function NewsletterSignup({ variant = 'section' }) {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done | error

  const handleSubmit = async e => {
    e.preventDefault()
    if (!ACTION) {
      setStatus('done')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(ACTION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (variant === 'compact') {
    return (
      <div className="newsletter-compact">
        {status === 'done' ? (
          <p className="newsletter-success">You're on the list.</p>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-compact-form">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="newsletter-input"
              aria-label="Email address"
            />
            <button type="submit" className="btn btn-light" disabled={status === 'sending'}>
              {status === 'sending' ? 'Joining…' : 'Join'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="newsletter-error">Something went wrong — please try again.</p>
        )}
      </div>
    )
  }

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="container">
        <div className="newsletter-inner">
          <span className="tag tag-light">Stay in the Loop</span>
          <h2>First access. Process updates. No noise.</h2>
          <p>
            Join the list for early access to new prints and commission slots,
            plus behind-the-scenes process updates from the studio.
          </p>
          {status === 'done' ? (
            <p className="newsletter-success">You're on the list — thank you.</p>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="newsletter-input"
                aria-label="Email address"
              />
              <button type="submit" className="btn btn-light" disabled={status === 'sending'}>
                {status === 'sending' ? 'Joining…' : 'Join the List'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="newsletter-error">Something went wrong — please try again.</p>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add newsletter CSS to `src/index.css`**

Append after the social links CSS added in Task 1:

```css
/* =====================
   Newsletter
   ===================== */
.newsletter-section {
  background: var(--charcoal);
  color: var(--cream);
  padding: 100px 0;
}
.newsletter-inner {
  max-width: 560px;
}
.newsletter-inner h2 {
  font-family: var(--font-serif-sc);
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 300;
  letter-spacing: 0.02em;
  color: var(--cream);
  margin-bottom: 16px;
  line-height: 1.25;
}
.newsletter-inner p {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: rgba(244,239,227,0.75);
  margin-bottom: 32px;
  line-height: 1.8;
}
.newsletter-form {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.newsletter-input {
  flex: 1;
  min-width: 220px;
  padding: 13px 18px;
  border: 1px solid rgba(244,239,227,0.35);
  background: transparent;
  color: var(--cream);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  outline: none;
  transition: border-color 0.2s ease;
}
.newsletter-input::placeholder { color: rgba(244,239,227,0.35); }
.newsletter-input:focus { border-color: rgba(244,239,227,0.7); }
.newsletter-success {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--olive-light);
  padding: 16px 0;
}
.newsletter-error {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  color: var(--terracotta);
  margin-top: 12px;
}

/* Compact (footer) variant */
.newsletter-compact { width: 100%; }
.newsletter-compact-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.newsletter-compact .newsletter-input {
  flex: 1;
  min-width: 160px;
  padding: 10px 14px;
  border-color: rgba(244,239,227,0.25);
}
.newsletter-compact .newsletter-success {
  color: rgba(244,239,227,0.6);
  padding: 8px 0;
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. No pages use this component yet — check console for no import errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/NewsletterSignup.jsx src/index.css
git commit -m "feat: add NewsletterSignup component"
```

---

### Task 3: Footer — add social links + compact newsletter

**Files:**
- Modify: `src/components/Footer.jsx`
- Modify: `src/index.css` (update footer styles)

**Interfaces:**
- Consumes: `<SocialLinks variant="light" />` from Task 1
- Consumes: `<NewsletterSignup variant="compact" />` from Task 2

- [ ] **Step 1: Replace `src/components/Footer.jsx`**

```jsx
import { Link } from 'react-router-dom'
import SocialLinks from './SocialLinks'
import NewsletterSignup from './NewsletterSignup'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          <div className="footer-brand">
            <p className="footer-brand-name">eliza cay</p>
            <p className="footer-tagline">original art · prints · commissions</p>
            <SocialLinks variant="light" />
          </div>

          <div className="footer-links-col">
            <h4>Navigate</h4>
            <ul className="footer-links">
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/journal">Journal</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/commission">Commission Work</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>

          <div className="footer-newsletter-col">
            <h4>Stay in the Loop</h4>
            <p>First access to new prints and commission slots.</p>
            <NewsletterSignup variant="compact" />
          </div>

        </div>

        <div className="footer-bottom">
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} eliza cay. All rights reserved.
          </span>
          <span className="footer-copy">
            Original art · Made with care
          </span>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Update footer CSS in `src/index.css`**

Find the existing `.footer` section in `src/index.css` and update it. Search for `.footer {` and replace the footer CSS block with:

```css
/* =====================
   Footer
   ===================== */
.footer {
  background: var(--charcoal);
  color: var(--cream);
  padding: 72px 0 40px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 56px;
}
.footer-brand-name {
  font-family: var(--font-serif-sc);
  font-size: 1.3rem;
  font-weight: 300;
  letter-spacing: 0.08em;
  color: var(--cream);
  margin-bottom: 6px;
}
.footer-tagline {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(244,239,227,0.45);
  margin-bottom: 24px;
}
.footer-brand .social-links { margin-top: 0; }
.footer-links-col h4,
.footer-newsletter-col h4 {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(244,239,227,0.45);
  margin-bottom: 16px;
  font-weight: 400;
}
.footer-newsletter-col p {
  font-family: var(--font-serif);
  font-size: 0.85rem;
  color: rgba(244,239,227,0.6);
  line-height: 1.6;
  margin-bottom: 16px;
}
.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links a {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(244,239,227,0.65);
  transition: color 0.2s ease;
}
.footer-links a:hover { color: var(--cream); }
.footer-bottom {
  border-top: 1px solid rgba(244,239,227,0.1);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.footer-copy {
  font-family: var(--font-mono);
  font-size: 0.52rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(244,239,227,0.3);
}
@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. Check the footer:
- Three social icons appear (they will be hidden if env vars are empty — set temporary test values in `.env` to verify: `VITE_INSTAGRAM_URL=https://instagram.com`)
- Compact newsletter form appears with email input and Join button
- Journal link appears in the navigation list
- Layout is correct on desktop (three columns) and mobile (stacked)
- Submitting the compact form shows "You're on the list." (since `VITE_NEWSLETTER_ACTION` is not set)

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.jsx src/index.css
git commit -m "feat: update footer with social links, newsletter signup, and journal nav"
```

---

### Task 4: Homepage — social icons in hero + newsletter section

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/index.css` (hero social icon styles)

**Interfaces:**
- Consumes: `<SocialLinks variant="light" />` from Task 1
- Consumes: `<NewsletterSignup variant="section" />` from Task 2

- [ ] **Step 1: Update `src/pages/Home.jsx`**

Add the two imports at the top of the file (after existing imports):

```jsx
import SocialLinks from '../components/SocialLinks'
import NewsletterSignup from '../components/NewsletterSignup'
```

In the `Home` component's JSX, make two changes:

**Change 1** — add `<SocialLinks>` inside the hero section, after the `<div className="hero-cta">` block:

```jsx
{/* ── Hero ──────────────────────────────────────────── */}
<section className="hero">
  <div className="hero-inner">
    <img
      src="/images/logo-full.png"
      alt="eliza cay"
      className="hero-logo"
    />
    <div className="hero-rule" />
    <p className="hero-sub">
      original art &nbsp;·&nbsp; limited prints &nbsp;·&nbsp; commission work
    </p>
    <div className="hero-cta">
      <Link to="/shop" className="btn btn-light">Shop Prints</Link>
      <Link to="/commission" className="btn btn-light">Commission Work</Link>
    </div>
    <div className="hero-social">
      <SocialLinks variant="light" />
    </div>
  </div>
</section>
```

**Change 2** — add `<NewsletterSignup />` after the commission teaser section and before the closing `</>`:

```jsx
{/* ── Newsletter ────────────────────────────────────── */}
<NewsletterSignup variant="section" />
```

- [ ] **Step 2: Add hero social CSS to `src/index.css`**

Find the existing `.hero` CSS section and add `.hero-social` after the `.hero-cta` styles:

```css
.hero-social {
  margin-top: 32px;
  opacity: 0.7;
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. On the homepage:
- Social icons appear below the hero CTAs (subtle, light-coloured)
- Newsletter section appears after the commission teaser — dark background, heading, description, and email form
- Submitting the email form shows "You're on the list — thank you."
- The `id="newsletter"` on the section allows `/#newsletter` anchor links to work

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx src/index.css
git commit -m "feat: add social icons to hero and newsletter section to homepage"
```

---

### Task 5: About page — social block + newsletter CTA

**Files:**
- Modify: `src/pages/About.jsx`
- Modify: `src/index.css` (about social block styles)

**Interfaces:**
- Consumes: `<SocialLinks variant="dark" showLabels={true} />` from Task 1

- [ ] **Step 1: Update `src/pages/About.jsx`**

Add import at the top:

```jsx
import SocialLinks from '../components/SocialLinks'
```

Add a new section after the closing `</section>` of `.about-philosophy` (the last section), before the closing `</>`:

```jsx
{/* ── Follow ────────────────────────────────────────── */}
<section className="about-follow">
  <div className="container">
    <div className="about-follow-inner">
      <div>
        <span className="tag">Follow Along</span>
        <h2>Find the work in progress</h2>
        <p>
          Process videos and speedpaints on TikTok. The portfolio and studio
          moments on Instagram. Prints and botanical illustrations on Pinterest.
        </p>
        <SocialLinks variant="dark" showLabels={true} />
      </div>
      <div className="about-follow-cta">
        <span className="tag">The List</span>
        <p>
          Want first access to new prints and commission slots? Join the newsletter
          for studio updates and early announcements.
        </p>
        <a href="/#newsletter" className="btn btn-dark">Join the List</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add about follow CSS to `src/index.css`**

Append to `src/index.css`:

```css
/* =====================
   About — Follow Section
   ===================== */
.about-follow {
  background: var(--cream-dark);
  padding: 100px 0;
  border-top: var(--line-soft);
}
.about-follow-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}
.about-follow-inner h2 {
  font-family: var(--font-serif-sc);
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 300;
  letter-spacing: 0.02em;
  margin-bottom: 16px;
  line-height: 1.3;
}
.about-follow-inner > div > p,
.about-follow-cta p {
  font-size: 1rem;
  color: var(--charcoal-soft);
  line-height: 1.8;
  margin-bottom: 28px;
}
.about-follow-cta { padding-top: 4px; }
@media (max-width: 768px) {
  .about-follow-inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. Navigate to `/about`:
- A new "Follow Along" section appears at the bottom of the page
- Social icons show with labels (Instagram, TikTok, Pinterest) if env vars are set, or nothing if not (the component returns null when no URLs configured)
- "Join the List" button scrolls to the newsletter section on the homepage
- Layout is two columns on desktop, stacked on mobile

- [ ] **Step 4: Commit**

```bash
git add src/pages/About.jsx src/index.css
git commit -m "feat: add social block and newsletter CTA to About page"
```

---

### Task 6: Commission page — "subscribers hear first" note

**Files:**
- Modify: `src/pages/Commission.jsx`

**Interfaces:**
- No new dependencies

- [ ] **Step 1: Update `src/pages/Commission.jsx`**

In the commission form info section, find the `<p>` that reads "Commission slots are limited..." and replace the entire `<div className="commission-form-info">` block with:

```jsx
<div className="commission-form-info">
  <span className="tag">Before You Enquire</span>
  <h2>What to expect</h2>
  <p>
    Commission slots are limited — I take on a small number of projects
    at a time to give each piece the attention it deserves.
  </p>
  <p>
    I work primarily in digital illustration with a hand-drawn, thin-line
    aesthetic. I'm open to custom prints, apparel graphics, wedding
    illustration, gift portraits, and more.
  </p>
  <p className="commission-subscribers-note">
    Subscribers to the list hear when slots open 48 hours before anyone else.{' '}
    <a href="/#newsletter">Join the list →</a>
  </p>

  <dl className="commission-details" style={{ marginTop: '32px' }}>
    <dt>Typical turnaround</dt>
    <dd>3–6 weeks depending on complexity</dd>
    <dt>Deposit</dt>
    <dd>50% upfront, 50% on delivery</dd>
    <dt>File formats</dt>
    <dd>High-res PNG, PDF, or original file on request</dd>
    <dt>Revisions</dt>
    <dd>Two rounds of revisions included</dd>
  </dl>
</div>
```

- [ ] **Step 2: Add commission note CSS to `src/index.css`**

Append to `src/index.css`:

```css
/* =====================
   Commission — Subscribers Note
   ===================== */
.commission-subscribers-note {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  color: var(--charcoal-soft);
  border-left: 2px solid var(--olive);
  padding-left: 14px;
  line-height: 1.7;
}
.commission-subscribers-note a {
  color: var(--olive-dark);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.commission-subscribers-note a:hover { color: var(--charcoal); }
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. Navigate to `/commission`:
- A note appears in the form info column with a left olive border
- "Join the list →" link navigates to `/#newsletter` (the homepage newsletter section)

- [ ] **Step 4: Commit**

```bash
git add src/pages/Commission.jsx src/index.css
git commit -m "feat: add subscribers-hear-first note to Commission page"
```

---

### Task 7: Process Journal — data file + page

**Files:**
- Create: `src/data/journal.js`
- Create: `src/pages/Journal.jsx`
- Modify: `src/index.css` (journal page styles)

**Interfaces:**
- Produces: `JOURNAL_POSTS` array from `src/data/journal.js` (consumed by `Journal.jsx`)
- Produces: `/journal` page at route `/journal` (wired in Task 8)

Each post object shape:
```js
{
  slug: string,           // URL-safe unique identifier
  date: string,           // ISO date 'YYYY-MM-DD'
  title: string,
  imageUrl: string,       // empty string if no image yet
  placeholderIndex: number, // 0-5, used when imageUrl is empty
  body: string,           // the post text
}
```

- [ ] **Step 1: Create `src/data/journal.js`**

```js
export const JOURNAL_POSTS = [
  {
    slug: 'welcome-to-the-journal',
    date: '2026-06-27',
    title: 'Welcome to the journal',
    imageUrl: '',
    placeholderIndex: 0,
    body: "Every piece starts somewhere — a sketch, a reference photo, a shape I noticed on a walk. This is where I'll share what that looks like. Works in progress, decisions that didn't pan out, things I'm figuring out. The messy part before the finished thing.",
  },
]
```

- [ ] **Step 2: Create `src/pages/Journal.jsx`**

```jsx
import ArtPlaceholder from '../components/ArtPlaceholder'
import { JOURNAL_POSTS } from '../data/journal'

function PostCard({ post }) {
  const date = new Date(post.date + 'T00:00:00').toLocaleDateString('en-AU', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <article className="journal-card">
      <div className="journal-card-image">
        {post.imageUrl
          ? <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <ArtPlaceholder index={post.placeholderIndex} />
        }
      </div>
      <div className="journal-card-body">
        <time className="journal-card-date" dateTime={post.date}>{date}</time>
        <h3 className="journal-card-title">{post.title}</h3>
        <p className="journal-card-excerpt">{post.body}</p>
      </div>
    </article>
  )
}

export default function Journal() {
  const sorted = [...JOURNAL_POSTS].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="tag">Eliza Cay</span>
          <h1>Process Journal</h1>
          <p>Sketches, works in progress, and notes from the studio.</p>
        </div>
      </div>

      <div className="container">
        <section className="journal-section">
          <div className="journal-grid">
            {sorted.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Add journal CSS to `src/index.css`**

Append to `src/index.css`:

```css
/* =====================
   Journal
   ===================== */
.journal-section {
  padding: 60px 0 100px;
}
.journal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 48px;
}
.journal-card {
  display: flex;
  flex-direction: column;
  border: var(--line-soft);
}
.journal-card-image {
  aspect-ratio: 4/3;
  overflow: hidden;
  background: var(--cream-dark);
}
.journal-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.journal-card:hover .journal-card-image img { transform: scale(1.03); }
.journal-card-body {
  padding: 28px 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.journal-card-date {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--charcoal-soft);
}
.journal-card-title {
  font-family: var(--font-serif-sc);
  font-size: 1.15rem;
  font-weight: 300;
  letter-spacing: 0.03em;
  color: var(--charcoal);
  line-height: 1.35;
}
.journal-card-excerpt {
  font-size: 0.9rem;
  color: var(--charcoal-soft);
  line-height: 1.8;
}
@media (max-width: 600px) {
  .journal-grid { grid-template-columns: 1fr; gap: 32px; }
}
```

- [ ] **Step 4: Verify** (after Task 8 wires the route — defer this verification to Task 8)

- [ ] **Step 5: Commit**

```bash
git add src/data/journal.js src/pages/Journal.jsx src/index.css
git commit -m "feat: add Process Journal page with static post data"
```

---

### Task 8: Nav + App.jsx route

**Files:**
- Modify: `src/components/Nav.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `<Journal />` page from Task 7
- Produces: `/journal` route + "Journal" nav link between Gallery and Shop

- [ ] **Step 1: Update `src/App.jsx`**

Add the Journal import and route. The full updated file:

```jsx
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Shop from './pages/Shop'
import Commission from './pages/Commission'
import About from './pages/About'
import Design from './pages/Design'
import Product from './pages/Product'
import Journal from './pages/Journal'
import LanternTest from './pages/LanternTest'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Nav />
      <CartDrawer />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/commission" element={<Commission />} />
          <Route path="/about" element={<About />} />
          <Route path="/design/:slug" element={<Design />} />
          <Route path="/product/:handle" element={<Product />} />
          <Route path="/lantern-test" element={<LanternTest />} />
        </Routes>
      </main>
      <Footer />
    </CartProvider>
  )
}
```

- [ ] **Step 2: Update `src/components/Nav.jsx`**

Find the `LINKS` array at the bottom of the file and replace it:

```js
const LINKS = [
  { to: '/gallery',    label: 'Gallery'    },
  { to: '/journal',    label: 'Journal'    },
  { to: '/shop',       label: 'Shop'       },
  { to: '/commission', label: 'Commission' },
  { to: '/about',      label: 'About'      },
]
```

- [ ] **Step 3: Verify the full site in browser**

Run `npm run dev` and walk through every page:

**Nav:**
- "Journal" link appears between Gallery and Shop in desktop nav
- "Journal" link appears in mobile hamburger menu
- Active state highlights correctly when on `/journal`

**Homepage (`/`):**
- Social icons appear below hero CTAs (if `VITE_INSTAGRAM_URL` etc. are set in `.env`)
- Newsletter section is visible below the commission teaser
- Submitting the newsletter form shows success state

**Gallery (`/gallery`):** No change — verify it still works

**Journal (`/journal`):**
- Page header with "Process Journal" heading
- One sample post card with image placeholder, date, title, and excerpt
- Cards have a subtle border and correct typography

**Shop (`/shop`):** No change — verify it still works

**Commission (`/commission`):**
- "Subscribers to the list hear when slots open 48 hours before anyone else" note appears in the form info column with olive left border

**About (`/about`):**
- "Follow Along" section appears at the bottom with social icons + labels (if env vars set) and "Join the List" button
- "Join the List" button navigates to `/#newsletter`

**Footer (every page):**
- Three social icons in left column (if env vars set)
- Journal link in navigate column
- Compact newsletter form in right column

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/components/Nav.jsx
git commit -m "feat: add Journal route and nav link"
```

---

## Self-Review

### Spec Coverage

| Spec requirement | Task |
|---|---|
| Newsletter subscribe section on homepage | Task 4 |
| Newsletter compact form in footer | Task 3 |
| Instagram, TikTok, Pinterest links in footer | Task 3 |
| Social icons in hero | Task 4 |
| About page — social block with all three platforms | Task 5 |
| About page — newsletter CTA | Task 5 |
| Commission page — "subscribers hear first" note | Task 6 |
| Process Journal page | Task 7 |
| Journal nav link | Task 8 |
| Central social config (easy to update handles) | Task 1 |
| Newsletter form works without configured endpoint | Task 2 |

### No Placeholders

All steps include complete file content or exact code blocks. No TBD or TODO in task bodies.

### Type Consistency

- `SocialLinks` accepts `variant: "dark" | "light"` and `showLabels: bool` — used consistently in Tasks 3, 4, 5
- `NewsletterSignup` accepts `variant: "section" | "compact"` — used correctly in Tasks 2, 3, 4
- `JOURNAL_POSTS` post shape defined in Task 7 interfaces, consumed only in Task 7
- `SOCIAL` object keys (`instagram`, `tiktok`, `pinterest`) match `ICONS` map keys in `SocialLinks.jsx`
