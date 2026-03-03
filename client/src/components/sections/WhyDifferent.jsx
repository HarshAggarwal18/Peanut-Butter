/**
 * WhyDifferent — Comparison table with GSAP row-by-row scroll reveal.
 * Shows PB Brand vs. generic peanut butters side by side.
 */
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap, ScrollTrigger } from '../../animations/gsapAnimations';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';
import AnimatedReveal from '../ui/AnimatedReveal';
import { staggerContainer, staggerItem } from '../../animations/variants';

const comparisons = [
  {
    feature: 'Peanut Content',
    pb: '98% Slow-Roasted',
    others: '70–80%',
  },
  {
    feature: 'Palm Oil',
    pb: 'Absolutely None',
    others: 'Added for texture',
  },
  {
    feature: 'Vegetable Oil',
    pb: 'Zero',
    others: 'Soybean / Canola',
  },
  {
    feature: 'Protein per 100g',
    pb: '25–32g',
    others: '18–22g',
  },
  {
    feature: 'Added Sugar',
    pb: 'None',
    others: '3–8g per serving',
  },
  {
    feature: 'Artificial Flavors',
    pb: 'Never',
    others: 'Common',
  },
  {
    feature: 'Preservatives',
    pb: 'None',
    others: 'TBHQ, BHT',
  },
  {
    feature: 'Ingredients Count',
    pb: 'Just 2',
    others: '8–15',
  },
];

const WhyDifferent = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Row-by-row stagger reveal on scroll
      gsap.fromTo(
        '.compare-row',
        { opacity: 0, x: -30, filter: 'blur(4px)' },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: tableRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Highlight the PB Brand column with a golden flash
      gsap.fromTo(
        '.pb-highlight',
        { color: 'rgba(196, 151, 59, 0.5)' },
        {
          color: 'rgba(196, 151, 59, 1)',
          duration: 0.4,
          stagger: 0.08,
          delay: 0.3,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: tableRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, tableRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper id="why-different" dark>
      <SectionHeading
        title="Why We're Different"
        subtitle="Not all peanut butters are created equal. Here's a transparent look at how we compare."
        light
      />

      <div ref={tableRef} className="max-w-4xl mx-auto mt-12">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 mb-6 px-4">
          <span className="text-cream/60 text-sm font-medium uppercase tracking-wider">
            Feature
          </span>
          <span className="text-center">
            <span className="inline-block px-4 py-1.5 bg-golden/20 text-golden rounded-full text-sm font-bold">
              PB Brand
            </span>
          </span>
          <span className="text-center text-cream/40 text-sm font-medium">
            Other Brands
          </span>
        </div>

        {/* Rows */}
        {comparisons.map((row, index) => (
          <motion.div
            key={row.feature}
            whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.08)' }}
            transition={{ duration: 0.2 }}
            className={`compare-row grid grid-cols-3 gap-4 px-4 py-4 rounded-xl transition-colors ${
              index % 2 === 0 ? 'bg-white/5' : ''
            }`}
          >
            <span className="text-cream/80 text-sm font-medium flex items-center">
              {row.feature}
            </span>
            <span className="pb-highlight text-center text-golden font-semibold text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {row.pb}
            </span>
            <span className="text-center text-cream/40 text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-error/50" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {row.others}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <AnimatedReveal delay={0.3} className="text-center mt-12">
        <p className="text-cream/60 text-sm mb-2">
          The choice is clear.
        </p>
        <p className="font-serif text-xl text-golden">
          Real ingredients. Real nutrition. Real taste.
        </p>
      </AnimatedReveal>
    </SectionWrapper>
  );
};

export default WhyDifferent;
