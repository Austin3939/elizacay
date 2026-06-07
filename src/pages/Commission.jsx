import { useState } from 'react'
import ArtPlaceholder from '../components/ArtPlaceholder'

const PROCESS = [
  {
    num: '01',
    title: 'Enquire',
    body: 'Fill in the commission form with your idea, budget, and timeline. I\'ll respond within 3–5 business days.',
  },
  {
    num: '02',
    title: 'Concept',
    body: 'We discuss your vision. I\'ll share initial sketches or mood references to align on direction before starting.',
  },
  {
    num: '03',
    title: 'Create',
    body: 'Once the concept is approved and a deposit received, I begin work and share progress updates along the way.',
  },
  {
    num: '04',
    title: 'Deliver',
    body: 'Final files or a shipped original are delivered. Prints can be arranged directly or added to the shop.',
  },
]

export default function Commission() {
  const [form, setForm] = useState({
    name: '', email: '', type: '', budget: '', timeline: '', description: '',
  })
  const [sent, setSent] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    /* Wire to Formspree, EmailJS, or your backend here */
    setSent(true)
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="commission-hero">
        <div className="container">
          <span className="tag tag-light">Commission Work</span>
          <h1>Something made<br />just for you.</h1>
          <p>
            Tag line - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
                Commission slots are limited — I take on a small number of projects
                at a time to give each piece the attention it deserves.
              </p>
              <p>
                I work primarily in digital illustration with a hand-drawn, thin-line
                aesthetic. I'm open to custom prints, apparel graphics, wedding
                illustration, gift portraits, and more.
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

            {/* Right: form */}
            <div>
              <span className="tag">Enquiry Form</span>

              {sent ? (
                <div style={{ padding: '40px 0' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                    Thank you — I'll be in touch within 3–5 days.
                  </p>
                </div>
              ) : (
                <form className="commission-form" onSubmit={submit}>
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
                        <option>Botanical illustration</option>
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

                  <button type="submit" className="btn btn-dark" style={{ alignSelf: 'flex-start' }}>
                    Submit Enquiry
                  </button>

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
