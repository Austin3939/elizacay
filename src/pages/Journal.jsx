import ArtPlaceholder from '../components/ArtPlaceholder'
import { JOURNAL_POSTS } from '../data/journal'

function PostCard({ post }) {
  const date = new Date(post.date + 'T00:00:00').toLocaleDateString('en-AU', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <article className="journal-card">
      <div className="journal-card-image">
        {post.imageUrl
          ? <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <ArtPlaceholder index={post.placeholderIndex} />
        }
      </div>
      <div className="journal-card-body">
        <time className="journal-card-date" dateTime={post.date}>{date}</time>
        <h3 className="journal-card-title">{post.title}</h3>
        <p className="journal-card-excerpt">{post.body}</p>
      </div>
    </article>
  )
}

export default function Journal() {
  const sorted = [...JOURNAL_POSTS].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="tag">Eliza Cay</span>
          <h1>Process Journal</h1>
          <p>Sketches, works in progress, and notes from the studio.</p>
        </div>
      </div>

      <div className="container">
        <section className="journal-section">
          <div className="journal-grid">
            {sorted.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
