import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCollections, isConfigured } from '../lib/shopify'
import { DESIGNS } from '../data/designs'
import ArtPlaceholder from '../components/ArtPlaceholder'

export default function Gallery() {
  const [collections, setCollections] = useState([])

  useEffect(() => {
    if (!isConfigured) return
    getCollections(20).then(setCollections).catch(console.error)
  }, [])

  const showLive = isConfigured && collections.length > 0

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="tag">Eliza Cay</span>
          <h1>Gallery</h1>
          <p>
            Click any piece to see what it's available on.
          </p>
        </div>
      </div>

      <div className="container">
        <section className="gallery-section">
          <div className="gallery-grid">
            {showLive
              ? collections.map(col => (
                  <Link key={col.id} to={`/design/${col.handle}`} className="gallery-card">
                    {col.image
                      ? <img src={col.image.url} alt={col.image.altText || col.title} />
                      : <div className="gallery-card-placeholder"><ArtPlaceholder index={0} /></div>
                    }
                  </Link>
                ))
              : DESIGNS.map(d => (
                  <Link key={d.slug} to={`/design/${d.slug}`} className="gallery-card">
                    <ArtPlaceholder index={d.placeholderIndex} />
                  </Link>
                ))
            }
          </div>
        </section>
      </div>
    </>
  )
}
