/**
 * ParallaxImage — Image container with parallax scroll effect.
 * Uses Framer Motion's useScroll for GPU-friendly transforms.
 */
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxImage = ({
  src,
  alt = '',
  speed = 0.15,
  scale = 1.15,
  className = '',
  imgClassName = '',
  children,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -100}%`, `${speed * 100}%`]);
  const scaleFactor = useTransform(scrollYProgress, [0, 0.5, 1], [scale, 1, scale]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale: scaleFactor }} className="w-full h-full">
        {src ? (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover ${imgClassName}`}
            loading="lazy"
          />
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
};

export default ParallaxImage;
