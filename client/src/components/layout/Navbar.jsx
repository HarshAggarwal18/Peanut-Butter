/**
 * Navbar — Premium sticky navigation with cart badge.
 * Transparent on top, blurs on scroll. Mobile hamburger menu.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/#products' },
  { label: 'Our Story', href: '/#story' },
  { label: 'Reviews', href: '/#reviews' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else navigate('/');
    } else {
      navigate(href);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-xl shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-2xl font-bold text-dark tracking-tight hover:text-peanut transition-colors"
        >
          PB<span className="text-golden">.</span>Brand
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium text-chocolate/70 hover:text-peanut transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-golden transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* User */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-peanut-light">
                {user?.name?.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="text-xs text-chocolate/50 hover:text-error transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1 text-sm text-chocolate/70 hover:text-peanut transition-colors"
            >
              <HiOutlineUser className="w-5 h-5" />
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-chocolate/70 hover:text-peanut transition-colors"
          >
            <HiOutlineShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-golden text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-chocolate"
          >
            {mobileOpen ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream/95 backdrop-blur-xl border-t border-beige/30"
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-lg font-medium text-chocolate hover:text-peanut transition-colors py-2"
                >
                  {link.label}
                </button>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="text-left text-lg text-error py-2"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-peanut py-2"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
