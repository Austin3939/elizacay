import { useState } from 'react'

// Netlify Function → Shopify customer with marketing consent.
const ENDPOINT = '/.netlify/functions/subscribe'

const CONSENT =
  'By subscribing you agree to receive occasional marketing emails from eliza cay. Unsubscribe anytime.'

export default function NewsletterSignup({ variant = 'section' }) {
  const [email, setEmail]     = useState('')
  const [company, setCompany] = useState('') // honeypot — real users never see this
  const [status, setStatus]   = useState('idle') // idle | sending | done | error
  const [message, setMessage] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    setMessage('')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, company }),
      })
      if (res.ok) {
        setStatus('done')
      } else {
        const data = await res.json().catch(() => ({}))
        setMessage(data.error || 'Something went wrong — please try again.')
        setStatus('error')
      }
    } catch {
      setMessage('Something went wrong — please try again.')
      setStatus('error')
    }
  }

  if (variant === 'compact') {
    return (
      <div className="newsletter-compact">
        {status === 'done' ? (
          <p className="newsletter-success">You're on the list.</p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="newsletter-compact-form">
              <input
                type="text"
                name="company"
                className="hp-field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={company}
                onChange={e => setCompany(e.target.value)}
              />
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
            <p className="newsletter-consent">{CONSENT}</p>
          </>
        )}
        {status === 'error' && <p className="newsletter-error">{message}</p>}
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
            <>
              <form onSubmit={handleSubmit} className="newsletter-form">
                <input
                  type="text"
                  name="company"
                  className="hp-field"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                />
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
              <p className="newsletter-consent">{CONSENT}</p>
            </>
          )}
          {status === 'error' && <p className="newsletter-error">{message}</p>}
        </div>
      </div>
    </section>
  )
}
