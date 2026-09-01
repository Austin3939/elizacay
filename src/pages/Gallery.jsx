import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCollections, isConfigured } from '../lib/shopify'
import ArtPlaceholder from '../components/ArtPlaceholder'
import Seo from '../components/Seo'

export default function Gallery() {
  const [collections, setCollections] = useState([])
  const [fetching, setFetching] = useState(isConfigured)

  useEffect(() => {
    if (!isConfigured) return
    setFetching(true)
    getCollections(20)
      .then(setCollections)
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [])

  const hasAny = collections.length > 0

  return (
    <>
      <Seo
        title="Gallery"
        description="Original block-print and illustration designs by eliza cay — available as limited-edition prints and on apparel."
        path="/gallery"
      />

      <div className="page-header">
        <div className="container">
          <span className="tag">Eliza Cay</span>
          <h1>Gallery</h1>
          <p>Original designs — available as prints and on apparel.</p>
        </div>
      </div>

      <div className="container">
        <section className="gallery-section">
          {fetching ? (
            <div className="shop-loading">Loading the gallery…</div>
          ) : !hasAny ? (
            <div className="coming-soon">
              <img src="/images/botanical.png" alt="" className="coming-soon-mark" />
              <p className="coming-soon-title">The catalogue is coming together.</p>
              <p className="coming-soon-body">
                Finished work is being photographed and written up. Come back
                soon to see the pieces — or follow along on Instagram in the
                meantime.
              </p>
              <Link to="/about" className="btn btn-dark">More About the Work</Link>
            </div>
          ) : (
            <div className="gallery-grid">
              {collections.map(col => (
                <Link key={col.id} to={`/design/${col.handle}`} className="gallery-card">
                  {col.image
                    ? <img src={col.image.url} alt={col.image.altText || col.title} />
                    : <div className="gallery-card-placeholder"><ArtPlaceholder /></div>
                  }
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
