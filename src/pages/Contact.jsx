import { useState } from 'react'
import Seo from '../components/Seo'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // Netlify Forms: same fetch POST pattern as Commission.jsx.
  const submit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(e.target)).toString(),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with Eliza Cay — questions about prints, orders, or custom work."
        path="/contact"
      />

      <section className="commission-hero">
        <div className="container">
          <span className="tag tag-light">Contact</span>
          <h1>Say hello.</h1>
          <p>Questions about a print, an order, or an idea? Send a note and I'll get back to you.</p>
        </div>
      </section>

      <section className="commission-form-section">
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="commission-form-card">
            <span className="tag">Contact Form</span>

            {status === 'sent' ? (
              <div style={{ padding: '40px 0' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                  Thank you — your message has been received and I'll be in touch.
                </p>
              </div>
            ) : (
              <form
                className="commission-form"
                name="contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={submit}
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hp-field">
                  <label>
                    Leave this field empty
                    <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" required value={form.name} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handle} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" required value={form.message} onChange={handle} />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark"
                  style={{ alignSelf: 'flex-start' }}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>

                {status === 'error' && (
                  <p className="form-error">Something went wrong sending your message. Please try again in a moment.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
