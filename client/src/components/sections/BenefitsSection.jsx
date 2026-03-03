/**
 * BenefitsSection — static dumbbell visual.
 * Scroll-through reverse/scroll-out animation is disabled.
 */

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '../../animations/gsapAnimations';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';
import dumbbellImage from '../../assets/benefits/dumbbell.png';

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
  const dumbbellRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // One-way dumbbell reveal (no scroll-out reverse)
      gsap.fromTo(
        dumbbellRef.current,
        { y: -24, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 0.95,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );

      // Stagger cards from below (one-way only)
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
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper id="benefits" className="bg-cream/90">
      <img
        ref={dumbbellRef}
        src={dumbbellImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-0 right-20 z-0 w-48 md:w-72 lg:w-[24rem] xl:w-[80rem] translate-x-1/4 -translate-y-1/3 md:translate-x-[10%] md:-translate-y-[28%] opacity-95"
      />

      <div className="relative z-10">
        <SectionHeading
          title="Every Spoon Fuels Strength"
          subtitle="Designed for those who take nutrition seriously — without compromising taste."
        />
      </div>

      <div ref={sectionRef} className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
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
// Runtime UI polish (non-breaking): glass effect, gradient edge, smoother hover, subtle icon/title motion.
if (typeof document !== 'undefined' && !document.getElementById('benefits-ui-polish')) {
  const style = document.createElement('style');
  style.id = 'benefits-ui-polish';
  style.innerHTML = `
    #benefits .benefit-card {
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      box-shadow:
        0 10px 30px rgba(61, 45, 36, 0.07),
        0 2px 10px rgba(61, 45, 36, 0.04);
      transform-style: preserve-3d;
      will-change: transform, box-shadow;
    }

    #benefits .benefit-card::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: 1px;
      border-radius: 1.5rem;
      background: linear-gradient(
        135deg,
        rgba(255,255,255,0.85),
        rgba(226, 180, 90, 0.35),
        rgba(255,255,255,0.7)
      );
      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    #benefits .benefit-card::after {
      content: "";
      position: absolute;
      width: 180px;
      height: 180px;
      top: -70px;
      right: -70px;
      border-radius: 9999px;
      background: radial-gradient(circle, rgba(226, 180, 90, 0.18), transparent 65%);
      opacity: 0;
      transition: opacity .35s ease;
      pointer-events: none;
    }

    #benefits .benefit-card:hover {
      box-shadow:
        0 18px 38px rgba(61, 45, 36, 0.13),
        0 6px 16px rgba(61, 45, 36, 0.08);
    }

    #benefits .benefit-card:hover::after {
      opacity: 1;
    }

    #benefits .benefit-card .text-peanut\\/55 {
      transition: transform .35s ease, color .35s ease, opacity .35s ease;
      opacity: .85;
    }

    #benefits .benefit-card:hover .text-peanut\\/55 {
      transform: translateY(-2px) scale(1.05);
      color: rgba(111, 78, 55, 0.85);
      opacity: 1;
    }

    #benefits .benefit-card h3 {
      transition: letter-spacing .3s ease, transform .3s ease;
    }

    #benefits .benefit-card:hover h3 {
      letter-spacing: .2px;
      transform: translateY(-1px);
    }

    #benefits .benefit-card p {
      transition: color .3s ease;
    }

    #benefits .benefit-card:hover p {
      color: rgba(61, 45, 36, 0.75);
    }
  `;
  document.head.appendChild(style);
}
