/**
 * App — Root component with routing, layout, smooth scroll & page transitions.
 */
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/ui/ScrollProgress';
import SmoothScroll from './components/ui/SmoothScroll';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

function App() {
  const location = useLocation();

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col">
        <ScrollProgress />
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
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
