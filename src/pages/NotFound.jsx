import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <>
      <Seo title="404 — Page Not Found" noindex />

      <div className="page-header">
        <div className="container">
          <span className="tag">Error 404</span>
          <h1>This page wandered off.</h1>
          <p>
            The page you're looking for doesn't exist, or it may have moved.
            Let's get you back to something real.
          </p>
        </div>
      </div>

      <div className="container">
        <section className="notfound-actions">
          <Link to="/" className="btn btn-dark">Back Home</Link>
          <Link to="/shop" className="btn btn-dark">Browse the Shop</Link>
        </section>
      </div>
    </>
  )
}
