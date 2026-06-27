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
