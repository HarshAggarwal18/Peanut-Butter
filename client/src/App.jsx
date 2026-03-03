/**
 * App — Root component with routing, layout, smooth scroll & page transitions.
 */
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/ui/ScrollProgress';
import SmoothScroll from './components/ui/SmoothScroll';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProductPage from './pages/ProductPage';

function App() {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(location.pathname !== '/');

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowNavbar(true);
      return undefined;
    }

    setShowNavbar(false);

    let introObserver;
    let heroObserver;
    let rafId;
    let heroInView = false;
    let introInView = false;

    const updateNavbarVisibility = () => {
      // Priority: if hero is visible, show navbar; otherwise hide if intro is visible
      setShowNavbar(heroInView || !introInView);
    };

    const attachObservers = () => {
      const introSection = document.getElementById('intro-section');
      const heroSection = document.getElementById('hero-section');
      
      if (!introSection || !heroSection) return false;

      // Watch intro section
      introObserver = new IntersectionObserver(
        ([entry]) => {
          introInView = entry.isIntersecting;
          updateNavbarVisibility();
        },
        { threshold: 0.05 }
      );

      // Watch hero section - higher priority
      heroObserver = new IntersectionObserver(
        ([entry]) => {
          heroInView = entry.isIntersecting;
          updateNavbarVisibility();
        },
        { threshold: 0.01 }
      );

      introObserver.observe(introSection);
      heroObserver.observe(heroSection);
      return true;
    };

    const waitForSections = () => {
      if (!attachObservers()) {
        rafId = window.requestAnimationFrame(waitForSections);
      }
    };

    waitForSections();

    return () => {
      if (introObserver) introObserver.disconnect();
      if (heroObserver) heroObserver.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col">
        {showNavbar && <ScrollProgress />}
        {showNavbar && <Navbar />}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:identifier" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default App;
