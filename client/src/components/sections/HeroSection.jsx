/**
 * HeroSection — Full-viewport animated hero with GSAP scroll storytelling.
 * Features: Animated headlines, floating badge, scroll CTA.
 */
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap, ScrollTrigger } from '../../animations/gsapAnimations';
import Button from '../ui/Button';
import { textReveal, staggerContainer, staggerItem } from '../../animations/variants';

const HeroSection = () => {
  const heroRef = useRef(null);
  const jarRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Jar float animation
      gsap.to(jarRef.current, {
        y: -20,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Parallax on scroll
      gsap.to(jarRef.current, {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-premium"
    >
      {/* Decorative background circles */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-golden/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-peanut/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen pt-24 pb-16">
          {/* Left: Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            {/* Eyebrow */}
            <motion.div variants={staggerItem} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-golden/10 rounded-full text-golden text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-golden animate-pulse" />
                Premium Peanut Butter
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={textReveal}
              className="font-serif text-dark leading-[1.1] mb-6"
            >
              Pure Peanuts.
              <br />
              <span className="text-gradient">Zero Compromise.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={staggerItem}
              className="text-lg text-chocolate/70 leading-relaxed mb-8 max-w-md"
            >
              Crafted for athletes & professionals. No palm oil. No vegetable oils.
              No artificial flavors. Just 30g protein per 100g of real peanut power.
            </motion.p>

            {/* USP Pills */}
            <motion.div variants={staggerItem} className="flex flex-wrap gap-3 mb-10">
              {[
                '30g Protein/100g',
                'No Palm Oil',
                'No Artificial Flavors',
                'Just Peanuts + Salt',
              ].map((usp) => (
                <span
                  key={usp}
                  className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-peanut text-sm font-medium shadow-soft"
                >
                  {usp}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={staggerItem} className="flex items-center gap-4">
              <Button variant="golden" size="lg" onClick={scrollToProducts}>
                Shop Now
              </Button>
              <Button variant="secondary" size="lg" onClick={() =>
                document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })
              }>
                Our Story
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Jar Visual */}
          <motion.div
            ref={jarRef}
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Glow behind jar */}
            <div className="absolute w-80 h-80 bg-golden/20 rounded-full blur-[80px]" />

            {/* Jar placeholder — replace with actual product image */}
            <div className="relative w-72 h-96 md:w-80 md:h-[28rem] bg-gradient-to-b from-peanut/20 to-golden/20 rounded-3xl flex items-center justify-center shadow-strong">
              <div className="text-center">
                <span className="font-serif text-6xl text-peanut/30 block mb-4">PB</span>
                <span className="text-peanut/40 text-sm uppercase tracking-widest">
                  Premium
                </span>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 px-4 py-2 bg-white rounded-2xl shadow-medium"
              >
                <span className="text-xs font-bold text-peanut">30g PROTEIN</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -left-4 px-4 py-2 bg-white rounded-2xl shadow-medium"
              >
                <span className="text-xs font-bold text-golden">100% NATURAL</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-peanut-light uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 border-2 border-peanut-light/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-golden rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
