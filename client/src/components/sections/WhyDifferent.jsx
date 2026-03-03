/**
 * WhyDifferent — Editorial-style comparison table with floating food graphics.
 */
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap, ScrollTrigger } from '../../animations/gsapAnimations';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';
import spoonImage from '../../assets/why-different/spoon.png';
import breadImage from '../../assets/why-different/bread.png';

const comparisons = [
  {
    feature: 'Vegetable Oils',
    pb: 'NO',
    others: 'YES',
  },
  {
    feature: 'Artificial Flavours',
    pb: 'NONE',
    others: 'MEDIUM/LOW',
  },
  {
    feature: 'Vegetable Oil',
    pb: 'NO',
    others: 'YES',
  },
  {
    feature: 'Protein Content',
    pb: 'HIGH',
    others: 'MEDIUM/LOW',
  },
  {
    feature: 'Ingredients',
    pb: 'PEANUTS & SEA SALT',
    others: 'SUGAR, OILS, ADDITIVES',
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
    <SectionWrapper id="why-different" className="bg-gradient-premium overflow-hidden">
      <div className="relative">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-24, -22, -24] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden md:block absolute -top-20 -left-6 lg:-left-20 z-10 transform scale-x-[-1] rotate-340"
        >
          <img
            src={spoonImage}
            alt="Peanut butter spoon"
            className="w-166 lg:w-184 h-auto object-contain"
            loading="lazy"
          />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-12, -10, -12] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="hidden md:block absolute -bottom-20 -right-8 lg:-right-89 z-10 bottom--280 rotate-12"
        >
          <img
            src={breadImage}
            alt="Bread with peanut butter"
            className="w-172 lg:w-180 h-auto object-contain   "
            loading="lazy"
          />
        </motion.div>

        <SectionHeading
          title="Why We're Different"
          subtitle="See how our peanut butter compares to what's on most shelves."
        />

        <div ref={tableRef} className="max-w-5xl mx-auto mt-14 bg-white/35 backdrop-blur-[1px] rounded-2xl border border-beige/50 overflow-hidden">
          <div className="grid grid-cols-3 px-6 py-5 text-sm md:text-[2rem] font-serif text-dark/95 border-b border-beige/70">
            <span className="tracking-wide">FEATURE</span>
            <span className="text-center tracking-wide">OUR BRAND</span>
            <span className="text-center tracking-wide">REGULAR BRANDS</span>
          </div>

          {comparisons.map((row) => (
            <motion.div
              key={row.feature}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
              transition={{ duration: 0.2 }}
              className="compare-row grid grid-cols-3 px-6 py-5 border-b border-beige/55 last:border-b-0"
            >
              <span className="text-dark/90 text-lg md:text-[2rem] font-serif leading-tight pr-4">
                {row.feature}
              </span>

              <span className="pb-highlight text-dark text-base md:text-[2rem] font-serif flex items-center justify-start md:justify-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-peanut/85 text-cream">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {row.pb}
              </span>

              <span className="text-center text-dark/45 text-base md:text-[2rem] font-serif flex items-center justify-center leading-tight">
                {row.others}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default WhyDifferent;
