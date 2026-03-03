/**
 * SplitText — Splits text into individually animated characters or words.
 * Creates that premium letter-by-letter reveal effect.
 */
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const charVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const wordContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const SplitText = ({
  children,
  type = 'chars', // 'chars' | 'words'
  className = '',
  as: Tag = 'span',
  delay = 0,
}) => {
  const text = typeof children === 'string' ? children : '';

  if (type === 'words') {
    const words = text.split(' ');
    return (
      <motion.span
        className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}
        variants={wordContainerVariants}
        initial="hidden"
        animate="visible"
        style={{ perspective: 600 }}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={wordVariants}
            className="inline-block"
            style={{ transitionDelay: `${delay}s` }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  const chars = text.split('');
  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ perspective: 600 }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={charVariants}
          className="inline-block"
          style={{
            transitionDelay: `${delay}s`,
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default SplitText;
