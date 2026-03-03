/**
 * SectionHeading — Reusable section title with optional subtitle.
 * Centered by default, with animated underline accent.
 */
import AnimatedReveal from './AnimatedReveal';

const SectionHeading = ({
  title,
  subtitle,
  centered = true,
  light = false,
  className = '',
}) => {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''} ${className}`}>
      <AnimatedReveal>
        <h2
          className={`font-serif font-bold mb-4 ${
            light ? 'text-cream' : 'text-dark'
          }`}
        >
          {title}
        </h2>
      </AnimatedReveal>

      {/* Golden accent line */}
      <AnimatedReveal delay={0.1}>
        <div
          className={`h-1 w-16 rounded-full bg-golden mb-6 ${
            centered ? 'mx-auto' : ''
          }`}
        />
      </AnimatedReveal>

      {subtitle && (
        <AnimatedReveal delay={0.2}>
          <p
            className={`text-lg max-w-2xl leading-relaxed ${
              centered ? 'mx-auto' : ''
            } ${light ? 'text-beige' : 'text-peanut-light'}`}
          >
            {subtitle}
          </p>
        </AnimatedReveal>
      )}
    </div>
  );
};

export default SectionHeading;
