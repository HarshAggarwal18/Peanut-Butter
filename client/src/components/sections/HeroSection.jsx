/**
 * HeroSection — Cinematic full-viewport hero with layered GSAP animations.
 * Features: Split-text headline, magnetic CTA, floating badges, parallax jar, scroll indicator.
 */
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap, ScrollTrigger } from '../../animations/gsapAnimations';
import Button from '../ui/Button';
import MagneticButton from '../ui/MagneticButton';
import SplitText from '../ui/SplitText';
import { staggerContainer, staggerItem } from '../../animations/variants';

const HeroSection = () => {
  const heroRef = useRef(null);
  const jarRef = useRef(null);
  const bgCircle1 = useRef(null);
  const bgCircle2 = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Framer Motion parallax for background circles
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const bgY1 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Listen for intro sequence completion
  useEffect(() => {
    const handleIntroComplete = (e) => {
      if (e.detail.complete) {
        setIsVisible(true);
      }
    };

    // Check initial visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    window.addEventListener('intro-sequence-complete', handleIntroComplete);
    return () => {
      window.removeEventListener('intro-sequence-complete', handleIntroComplete);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Jar entrance — scale + float in from below
      gsap.fromTo(
        jarRef.current,
        { y: 80, opacity: 0, scale: 0.85, rotateY: -20 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1.2,
          delay: 0.4,
          ease: 'power3.out',
        }
      );

      // 2. Infinite float after entrance
      gsap.to(jarRef.current, {
        y: -18,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.6,
      });

      // 3. Parallax jar on scroll
      gsap.to(jarRef.current, {
        y: 120,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // 4. Floating badges stagger in
      gsap.fromTo(
        '.hero-badge',
        { opacity: 0, scale: 0, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          delay: 1,
          ease: 'back.out(1.7)',
        }
      );

      // 5. USP pills cascade in
      gsap.fromTo(
        '.usp-pill',
        { opacity: 0, x: -20, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.8,
          ease: 'power2.out',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      id="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-premium -mt-[100vh]"
    >
      {/* Smooth fade-in overlay for content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-gradient-premium pointer-events-none z-20"
      />
      {/* Animated background circles with parallax */}
      <motion.div
        ref={bgCircle1}
        style={{ y: bgY1 }}
        className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-golden/8 rounded-full blur-[100px]"
      />
      <motion.div
        ref={bgCircle2}
        style={{ y: bgY2 }}
        className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] bg-peanut/8 rounded-full blur-[80px]"
      />

      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div 
        style={{ opacity: heroOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="container-custom relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen pt-24 pb-16">
          {/* Left: Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="max-w-xl"
          >
            {/* Eyebrow */}
            <motion.div variants={staggerItem} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-golden/10 rounded-full text-golden text-sm font-medium backdrop-blur-sm border border-golden/10">
                <span className="w-2 h-2 rounded-full bg-golden animate-pulse" />
                Premium Peanut Butter
              </span>
            </motion.div>

            {/* Headline — Split text character reveal */}
            <motion.h1
              variants={staggerItem}
              className="font-serif text-dark leading-[1.08] mb-6"
            >
              <SplitText type="words" delay={0.2}>
                Pure Peanuts.
              </SplitText>
              <br />
              <span className="text-gradient">
                <SplitText type="words" delay={0.5}>
                  Zero Compromise.
                </SplitText>
              </span>
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
                  className="usp-pill px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-peanut text-sm font-medium shadow-soft border border-white/40 hover:bg-white/80 hover:shadow-medium transition-all duration-300 cursor-default"
                >
                  {usp}
                </span>
              ))}
            </motion.div>

            {/* CTA — Magnetic hover effect */}
            <motion.div variants={staggerItem} className="flex items-center gap-4">
              <MagneticButton strength={0.25}>
                <Button
                  variant="golden"
                  size="lg"
                  onClick={scrollToProducts}
                  className="glow-pulse"
                >
                  Shop Now
                </Button>
              </MagneticButton>
              <MagneticButton strength={0.15}>
                <Button variant="secondary" size="lg" onClick={() =>
                  document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })
                }>
                  Our Story
                </Button>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right: Jar Visual */}
          <div
            ref={jarRef}
            className="relative flex items-center justify-center"
            style={{ opacity: 0 }}
          >
            {/* Animated glow ring */}
            <div className="absolute w-80 h-80 rounded-full border border-golden/20 animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-72 h-72 rounded-full border border-golden/10 animate-[spin_15s_linear_infinite_reverse]" />

            {/* Glow behind jar */}
            <div className="absolute w-80 h-80 bg-golden/15 rounded-full blur-[80px] animate-pulse" />

            {/* Jar placeholder — replace with actual product image */}
            <div className="relative w-72 h-96 md:w-80 md:h-[28rem] bg-gradient-to-b from-peanut/20 to-golden/20 rounded-3xl flex items-center justify-center shadow-strong backdrop-blur-sm border border-white/20">
              <div className="text-center">
                <span className="font-serif text-7xl text-peanut/25 block mb-4">PB</span>
                <span className="text-peanut/30 text-sm uppercase tracking-[0.3em]">
                  Premium
                </span>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="hero-badge absolute -top-4 -right-4 px-5 py-2.5 bg-white rounded-2xl shadow-medium"
              >
                <span className="text-xs font-bold text-peanut">30g PROTEIN</span>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="hero-badge absolute -bottom-4 -left-4 px-5 py-2.5 bg-white rounded-2xl shadow-medium"
              >
                <span className="text-xs font-bold text-golden">100% NATURAL</span>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -8, 0],
                  x: [0, 4, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="hero-badge absolute top-1/2 -right-8 px-4 py-2 bg-white rounded-2xl shadow-medium"
              >
                <span className="text-xs font-bold text-success">NO PALM OIL</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-peanut-light uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          className="w-6 h-10 border-2 border-peanut-light/30 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-3 bg-golden rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
