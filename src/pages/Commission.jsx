import { useState } from 'react'
import Seo from '../components/Seo'

const PROCESS = [
  {
    num: '01',
    title: 'Enquire',
    body: "Fill in the form with your idea, budget, and timeline. I'll get back to you within a few days.",
  },
  {
    num: '02',
    title: 'Concept',
    body: "We talk through your vision. I share initial sketches or references so we're aligned on direction before I start.",
  },
  {
    num: '03',
    title: 'Create',
    body: 'Once the concept is approved and a deposit secures your slot, I begin the work and share progress along the way.',
  },
  {
    num: '04',
    title: 'Deliver',
    body: 'Final print-ready files, or a shipped original. Prints can be arranged directly or added to the shop.',
  },
]

const CONTACT_EMAIL = 'hello@elizacaystudio.com'

export default function Commission() {
  const [form, setForm] = useState({
    name: '', email: '', type: '', budget: '', timeline: '', description: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // Netlify Forms: POST the encoded fields to any path with form-name set.
  // Spam is handled server-side (bot-field honeypot + Akismet).
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
        title="Commission Work"
        description="Commission a custom block print or illustration made by hand — illustration, portraits, place and event pieces, apparel graphics."
        path="/commission"
      />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="commission-hero">
        <div className="container">
          <span className="tag tag-light">Commission Work</span>
          <h1>Wander and wonder.</h1>
          <p>
            What can we create together? Commissions are open for illustration,
            block prints, and custom work made entirely for you.
          </p>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────── */}
      <section className="process-section">
        <div className="container">
          <span className="tag">The Process</span>
          <div className="process-grid">
            {PROCESS.map(({ num, title, body }) => (
              <div key={num} className="process-step">
                <span className="process-num">{num}</span>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ──────────────────────────────────────────── */}
      <section className="commission-form-section">
        <div className="container">
          <div className="commission-form-wrap">
            {/* Left: info */}
            <div className="commission-form-info">
              <span className="tag">Before You Enquire</span>
              <h2>What to expect</h2>
              <p>
                I take on a small number of commissions at a time so each piece
                gets the attention it deserves.
              </p>
              <p>
                I work in block printing and illustration, with a hand-drawn,
                folk-influenced style — high contrast, soft texture, traditional
                patterns and modern doodles. I'm open to custom prints, apparel
                graphics, gift pieces, event illustration, and more.
              </p>
              <p className="commission-subscribers-note">
                Subscribers to the list hear when commission slots open first.{' '}
                <a href="/#newsletter">Join the list →</a>
              </p>

              <dl className="commission-details" style={{ marginTop: '32px' }}>
                <dt>Turnaround</dt>
                <dd>Agreed with you up front, based on the scope of the piece</dd>
                <dt>Deposit</dt>
                <dd>A deposit secures your slot; the balance is due on completion</dd>
                <dt>Files</dt>
                <dd>Print-ready files, or a shipped original on request</dd>
                <dt>Revisions</dt>
                <dd>Built into every project so we land it together</dd>
              </dl>
            </div>

            {/* Right: form */}
            <div>
              <span className="tag">Enquiry Form</span>

              {status === 'sent' ? (
                <div style={{ padding: '40px 0' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                    Thank you — your enquiry has been received and I'll be in touch.
                  </p>
                </div>
              ) : (
                <form
                  className="commission-form"
                  name="commission"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={submit}
                >
                  <input type="hidden" name="form-name" value="commission" />
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

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="type">Project Type</label>
                      <select id="type" name="type" required value={form.type} onChange={handle}>
                        <option value="">Select...</option>
                        <option>Illustration</option>
                        <option>Block print</option>
                        <option>Portrait</option>
                        <option>Place / Architecture</option>
                        <option>Wedding / Event</option>
                        <option>Apparel graphic</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="budget">Budget (approx.)</label>
                      <select id="budget" name="budget" required value={form.budget} onChange={handle}>
                        <option value="">Select...</option>
                        <option>Under $200</option>
                        <option>$200 – $500</option>
                        <option>$500 – $1,000</option>
                        <option>$1,000 +</option>
                        <option>Let's discuss</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="timeline">Desired Timeline</label>
                    <input
                      id="timeline"
                      name="timeline"
                      type="text"
                      placeholder="e.g. Gift needed by December, no rush"
                      value={form.timeline}
                      onChange={handle}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Tell me about your project</label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      placeholder="Describe your vision, subject, colours, mood, how you'd like to use the piece..."
                      value={form.description}
                      onChange={handle}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark"
                    style={{ alignSelf: 'flex-start' }}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Sending…' : 'Submit Enquiry'}
                  </button>

                  {status === 'error' && (
                    <p className="form-error">
                      Something went wrong sending your enquiry. Please email{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> instead.
                    </p>
                  )}

                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'var(--charcoal-soft)', lineHeight: 1.6 }}>
                    Submitting does not guarantee a commission slot. I'll confirm availability and next steps via email.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
