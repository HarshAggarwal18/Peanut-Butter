/**
 * BenefitsSection — Clean premium benefits block with soft cards.
 */
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '../../animations/gsapAnimations';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';

const benefits = [
  {
    title: '25–32g Protein',
    subtitle: 'Protein per 100g',
    icon: (
      <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16c1.5 1.2 3.3 1.6 5.5 1.1 1.8-.4 3.2-1.4 4.3-2.8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 13.5c-.7-1.3-.9-2.6-.6-4 .4-1.8 1.8-3 3.6-3.2 1.5-.2 2.7.3 3.7 1.3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 12.2c-.9 1.8-.7 3.8.5 5.2 1.3 1.5 3.3 2 5.1 1.4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10.5c1.2-.5 2.5-.4 3.5.4" />
      </svg>
    ),
  },
  {
    title: 'Good Fats',
    subtitle: 'Naturally occurring healthy fats',
    icon: (
      <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5c3.3 0 6 2.7 6 6 0 3.7-2.4 7-6 10.5C8.4 16.5 6 13.2 6 9.5c0-3.3 2.7-6 6-6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.8c1.7 0 3.1 1.4 3.1 3.1 0 2-1.2 3.8-3.1 5.8-1.9-2-3.1-3.8-3.1-5.8 0-1.7 1.4-3.1 3.1-3.1z" />
      </svg>
    ),
  },
  {
    title: 'Energy',
    subtitle: 'Natural sustained energy',
    icon: (
      <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.8v2.6M4.8 12H2.2M21.8 12h-2.6M6.1 6.1L4.3 4.3M19.7 19.7l-1.8-1.8M17.9 6.1l1.8-1.8M6.1 17.9l-1.8 1.8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.8L9.8 12h2.4l-1.7 5.2 4.6-6h-2.6l1-4.4z" />
      </svg>
    ),
  },
  {
    title: 'Clean',
    subtitle: 'Simple ingredient formula',
    icon: (
      <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20V9.8c0-2.5 1.5-4.6 4-5.5 2.3-.8 4.7-.4 6.4.9-1.2 2.2-3.2 3.7-5.9 4.4-1.6.4-2.8 1.3-3.6 2.6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 13.5c2.6 0 4.8-1 6.6-3" />
      </svg>
    ),
  },
];

const BenefitsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger cards from below
      gsap.fromTo(
        '.benefit-card',
        { y: 60, opacity: 0, rotateX: 8 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper id="benefits" className="bg-cream/90">
      <SectionHeading
        title="Every Spoon Fuels Strength"
        subtitle="Designed for those who take nutrition seriously — without compromising taste."
      />

      <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {benefits.map((benefit) => (
          <motion.div
            key={benefit.title}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            className="benefit-card bg-white/90 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-400 border border-white"
          >
            <div className="text-peanut/55 mb-6 flex justify-center">
              {benefit.icon}
            </div>

            <h3 className="font-serif text-[2rem] leading-none text-dark text-center mb-3">
              {benefit.title}
            </h3>

            <p className="text-center text-chocolate/60 text-[1.05rem] leading-snug max-w-[16rem] mx-auto">
              {benefit.subtitle}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="pointer-events-none absolute top-12 right-0 w-64 h-64 bg-beige/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 left-0 w-56 h-56 bg-golden/10 rounded-full blur-3xl" />
    </SectionWrapper>
  );
};

export default BenefitsSection;
