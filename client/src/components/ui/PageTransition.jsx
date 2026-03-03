/**
 * PageTransition — Wraps each page with enter/exit animations.
 * Works with AnimatePresence in App.jsx for route transitions.
 */
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 24,
    filter: 'blur(6px)',
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: 'blur(4px)',
    transition: {
      duration: 0.35,
      ease: [0.36, 0, 0.66, -0.56],
    },
  },
};

const PageTransition = ({ children, className = '' }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="enter"
    exit="exit"
    className={className}
  >
    {children}
  </motion.div>
);

export default PageTransition;
