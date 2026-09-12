import Seo from '../components/Seo'
import NewsletterSignup from '../components/NewsletterSignup'

// Bare landing page for QR-code / event signage traffic — no nav or footer,
// nothing to tap away to but the signup form itself.
export default function Join() {
  return (
    <div className="join-page">
      <Seo title="Join the List" path="/join" noindex />
      <div className="join-logo">
        <img src="/images/botanical.png" alt="" className="join-logo-icon" />
        <span className="join-logo-text">eliza cay</span>
      </div>
      <NewsletterSignup />
    </div>
  )
}
