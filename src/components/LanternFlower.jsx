import { useRef, useCallback, useEffect } from 'react'

// Fraction of the rendered image where the flower head sits.
// Tweak these two numbers if the glow drifts off-target.
const HEAD_X = 0.34   // left → right
const HEAD_Y = 0.40   // top  → bottom

export default function LanternFlower() {
  const imgRef  = useRef(null)
  const glowRef = useRef(null)

  const reposition = useCallback(() => {
    const img  = imgRef.current
    const glow = glowRef.current
    if (!img || !glow || !img.naturalWidth) return

    const { naturalWidth: nw, naturalHeight: nh, offsetWidth: w, offsetHeight: h } = img
    const scale = Math.min(w / nw, h / nh)
    const rw = nw * scale
    const rh = nh * scale

    // object-position: center bottom
    const ox = (w - rw) / 2
    const oy = h - rh

    glow.style.left   = `${ox + rw * HEAD_X}px`
    glow.style.top    = `${oy + rh * HEAD_Y}px`
    glow.style.width  = `${rw * 0.04}px`
    glow.style.height = `${rh * 0.20}px`
  }, [])

  useEffect(() => {
    window.addEventListener('resize', reposition)
    return () => window.removeEventListener('resize', reposition)
  }, [reposition])

  return (
    <div className="lantern-root" aria-hidden="true">
      <div ref={glowRef} className="lantern-glow" />
      <img
        ref={imgRef}
        src="/images/botanical.png"
        className="lantern-img"
        alt=""
        draggable={false}
        onContextMenu={e => e.preventDefault()}
        onLoad={reposition}
      />
    </div>
  )
}
