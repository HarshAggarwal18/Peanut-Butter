/**
 * ScrollProgress — Thin progress bar at top of viewport showing page scroll.
 * Subtle premium touch that great brand sites use.
 */
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #8B5E3C, #C4973B, #D4A94E)',
      }}
    />
  );
};

export default ScrollProgress;
