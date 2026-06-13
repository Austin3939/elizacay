import LanternFlower from '../components/LanternFlower'

export default function LanternTest() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1916',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <LanternFlower />
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.15)',
        position: 'relative',
        zIndex: 2,
      }}>
        lantern test
      </p>
    </div>
  )
}
