import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Shop from './pages/Shop'
import Commission from './pages/Commission'
import About from './pages/About'
import Design from './pages/Design'
import Product from './pages/Product'
import Join from './pages/Join'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const bare = pathname === '/join' // no nav/footer — nothing to tap away to from a QR scan

  return (
    <CartProvider>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Skip to content</a>
      {!bare && <Nav />}
      <CartDrawer />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/commission" element={<Commission />} />
          <Route path="/about" element={<About />} />
          <Route path="/design/:slug" element={<Design />} />
          <Route path="/product/:handle" element={<Product />} />
          <Route path="/join" element={<Join />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!bare && <Footer />}
    </CartProvider>
  )
}
