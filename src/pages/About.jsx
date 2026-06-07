import { Link } from 'react-router-dom'
import ArtPlaceholder from '../components/ArtPlaceholder'

export default function About() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-inner">
            <div>
              <span className="tag tag-light">The Artist</span>
              <h1>eliza cay</h1>
              {/* ✏️ CLIENT: Replace this with a short bio intro — who you are, your style, where you're based */}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </div>

            <div className="about-photo-frame">
              <div className="about-photo-placeholder">
                {/* ✏️ CLIENT: Replace this block with your photo:
                    <img src="/images/artist-photo.jpg" alt="Eliza Cay" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="18" r="10" stroke="rgba(244,239,227,0.5)" strokeWidth="1"/>
                  <path d="M6 44 C6 32 42 32 42 44" stroke="rgba(244,239,227,0.5)" strokeWidth="1" fill="none"/>
                </svg>
                <span>Artist photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────── */}
      <section className="about-story">
        <div className="container">
          <div className="about-story-grid">
            <div>
              <div className="ruled-heading">
                <h2>The Work</h2>
              </div>

              {/* ✏️ CLIENT: Replace each paragraph below with your own words about your work and process */}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit
                anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae.
              </p>

              <div style={{ marginTop: '36px' }}>
                <Link to="/commission" className="btn btn-dark">Commission a Piece</Link>
              </div>
            </div>

            <div className="about-botanical">
              <ArtPlaceholder index={4} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────── */}
      <section className="about-philosophy">
        <div className="container">
          <span className="tag">Philosophy</span>
          <div className="about-philosophy-grid">

            <div className="philosophy-card">
              {/* ✏️ CLIENT: Replace this heading with your first value or belief */}
              <span className="philosophy-title">Your value here</span>
              {/* ✏️ CLIENT: Describe this value in 1–2 sentences */}
              <p className="philosophy-body">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div className="philosophy-card">
              {/* ✏️ CLIENT: Replace this heading with your second value or belief */}
              <span className="philosophy-title">Your value here</span>
              {/* ✏️ CLIENT: Describe this value in 1–2 sentences */}
              <p className="philosophy-body">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat duis aute irure.
              </p>
            </div>

            <div className="philosophy-card">
              {/* ✏️ CLIENT: Replace this heading with your third value or belief */}
              <span className="philosophy-title">
                Your value here
              </span>
              {/* ✏️ CLIENT: Describe this value in 1–2 sentences */}
              <p className="philosophy-body">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
