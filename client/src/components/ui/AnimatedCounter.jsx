/**
 * AnimatedCounter — Counts up a number when it scrolls into view.
 * Premium experience for stat cards and benefit values.
 */
import { useRef, useEffect, useState } from 'react';
import { useInView, motion } from 'framer-motion';

const AnimatedCounter = ({
  value,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const target = parseFloat(value);
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(eased * target);

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, value, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
