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

    let observer;
    let rafId;

    const attachIntroObserver = () => {
      const introSection = document.getElementById('intro-section');
      if (!introSection) return false;

      observer = new IntersectionObserver(
        ([entry]) => {
          // Only show navbar when intro section is completely out of view
          setShowNavbar(!entry.isIntersecting);
        },
        { 
          threshold: 0,
          rootMargin: '-1px'
        }
      );

      observer.observe(introSection);
      return true;
    };

    const waitForIntro = () => {
      if (!attachIntroObserver()) {
        rafId = window.requestAnimationFrame(waitForIntro);
      }
    };

    waitForIntro();

    return () => {
      if (observer) observer.disconnect();
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
