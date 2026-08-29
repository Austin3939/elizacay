import { Link } from 'react-router-dom'
import ArtPlaceholder from '../components/ArtPlaceholder'
import SocialLinks from '../components/SocialLinks'

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
              <p>
                My name is Liz and I am a queer visual artist based in Grand
                Rapids, Michigan. As a multimedia artist, my focus is on block
                printing and illustration, but I also have a special interest in
                the textile world. I grew up with a love for myth, history, and
                all things odd. I believe history is life's greatest teacher and
                the Ego's greatest foe, and that contradiction gives birth to my
                work.
              </p>
            </div>

            <div className="about-photo-frame">
              <img
                src="/images/artist-photo.jpg"
                alt="Liz, the artist behind eliza cay"
                className="about-photo"
              />
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

              <p>
                My work is an amalgamation of childlike joy and folk stories. I am
                inspired by the unique relationship between history, nature, and
                humanity, and via handmade journeys, I can give life to wonder and
                personhood.
              </p>
              <p>
                With high contrast and soft textures, traditional folk patterns
                and modern doodles, I draw inspiration from daydreams and
                fairytales, from fleeting glances and genuine connections — and
                the end result is ridiculous, it's silly, and I love it.
              </p>

              <div style={{ marginTop: '36px' }}>
                <Link to="/commission" className="btn btn-dark">Commission a Piece</Link>
              </div>
            </div>

            <div className="about-botanical">
              <ArtPlaceholder />
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
              <span className="philosophy-title">Organic in mind and in hand</span>
              <p className="philosophy-body">
                The work stays organic — in how it is thought through and in how
                it is made by hand.
              </p>
            </div>

            <div className="philosophy-card">
              <span className="philosophy-title">Nature, with care and wonder</span>
              <p className="philosophy-body">
                Nature is to be treated with care and wonder — never taken for
                granted.
              </p>
            </div>

            <div className="philosophy-card">
              <span className="philosophy-title">History, revered and studied</span>
              <p className="philosophy-body">
                History and culture are meant to be revered and studied. History
                is life's greatest teacher.
              </p>
            </div>

          </div>

          <p className="philosophy-note">
            A teacher told me once that something should never be cool just for
            cool's sake. I vehemently disagree. Some things can just be fun, and
            there is value in celebrating that.
          </p>
        </div>
      </section>

      {/* ── Follow ────────────────────────────────────────── */}
      <section className="about-follow">
        <div className="container">
          <div className="about-follow-inner">
            <div>
              <span className="tag">Follow Along</span>
              <h2>Find the work in progress</h2>
              <p>
                Studio moments and finished pieces on Instagram, process and
                works-in-progress on TikTok, and collected inspiration on
                Pinterest — all at <strong>@elizacaystudio</strong>.
              </p>
              <SocialLinks variant="dark" showLabels={true} />
            </div>
            <div className="about-follow-cta">
              <span className="tag">The List</span>
              <p>
                Want first access to new prints and commission slots? Join the
                newsletter for studio updates and early announcements.
              </p>
              <a href="/#newsletter" className="btn btn-dark">Join the List</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
