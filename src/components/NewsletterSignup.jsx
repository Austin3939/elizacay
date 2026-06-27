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
