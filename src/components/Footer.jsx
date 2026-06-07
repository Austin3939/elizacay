import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-brand-name">eliza cay</p>
            <p className="footer-tagline">original art · prints · commissions</p>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://etsy.com" target="_blank" rel="noopener noreferrer">Etsy</a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Navigate</h4>
            <ul className="footer-links">
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/commission">Commission Work</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} eliza cay. All rights reserved.
          </span>
          <span className="footer-copy">
            Original art · Hand-lettered · Made with care
          </span>
        </div>
      </div>
    </footer>
  )
}
