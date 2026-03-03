/**
 * SectionWrapper — Consistent section layout with optional background.
 * Handles section padding, max-width, and optional ID for scroll targeting.
 */
import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations/variants';

const SectionWrapper = ({
  children,
  id,
  className = '',
  dark = false,
  noPadding = false,
}) => {
  return (
    <section
      id={id}
      className={`
        relative overflow-hidden
        ${dark ? 'bg-gradient-dark text-cream' : 'bg-cream'}
        ${noPadding ? '' : 'section-padding'}
        ${className}
      `}
    >
      <motion.div
        className="container-custom"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInUp}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default SectionWrapper;
