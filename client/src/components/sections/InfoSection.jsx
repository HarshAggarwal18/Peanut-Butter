/**
 * InfoSection — Transparent jar breakdown storytelling.
 * Uses GSAP sticky scroll for step-by-step ingredient reveal.
 */
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap, ScrollTrigger } from '../../animations/gsapAnimations';
import SectionHeading from '../ui/SectionHeading';
import AnimatedReveal from '../ui/AnimatedReveal';

const ingredients = [
  {
    name: 'Slow-Roasted Peanuts',
    percentage: '98%',
    description:
      'Hand-selected peanuts, slow-roasted to perfection. Our proprietary roasting process unlocks maximum flavor while preserving all natural proteins and healthy fats.',
    icon: '🥜',
  },
  {
    name: 'Himalayan Sea Salt',
    percentage: '2%',
    description:
      'A delicate pinch of pink Himalayan salt to enhance the natural peanut sweetness. Nothing more. Nothing less. That\'s our promise.',
    icon: '🧂',
  },
];

const promises = [
  { label: 'No Palm Oil', icon: '🚫🌴' },
  { label: 'No Vegetable Oils', icon: '🚫🛢️' },
  { label: 'No Artificial Flavors', icon: '🚫🧪' },
  { label: 'No Added Sugar', icon: '🚫🍬' },
  { label: 'No Preservatives', icon: '🚫📦' },
  { label: 'No Hydrogenated Fats', icon: '🚫⚗️' },
];

const InfoSection = () => {
  const sectionRef = useRef(null);
  const progressRef = useRef(null);
  const timelineRef = useRef(null);
  const promisesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          },
        }
      );

      gsap.from('.ingredient-item', {
        y: 50,
        opacity: 0,
        rotateX: -10,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 70%',
        },
      });

      gsap.from('.promise-item', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: promisesRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="story" className="section-padding bg-cream relative">
      <div className="container-custom">
        <SectionHeading
          title="What's Inside"
          subtitle="We believe the best ingredients speak for themselves. Here's everything in our jar — and everything that's not."
        />

        {/* Ingredients Timeline */}
        <div ref={timelineRef} className="relative max-w-3xl mx-auto mt-16">
          {/* Progress line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-beige -translate-x-1/2">
            <div
              ref={progressRef}
              className="w-full h-full bg-golden origin-top"
            />
          </div>

          {ingredients.map((ingredient, index) => (
            <AnimatedReveal
              key={ingredient.name}
              direction={index % 2 === 0 ? 'left' : 'right'}
              delay={index * 0.15}
              className={`ingredient-item relative flex items-start gap-8 mb-20 ${
                index % 2 === 0
                  ? 'md:flex-row'
                  : 'md:flex-row-reverse md:text-right'
              }`}
            >
              {/* Dot */}
              <div
                className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-golden border-4 border-cream z-10`}
              />

              {/* Content */}
              <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-soft">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{ingredient.icon}</span>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-dark">
                        {ingredient.name}
                      </h3>
                      <span className="text-golden font-bold text-lg">
                        {ingredient.percentage}
                      </span>
                    </div>
                  </div>
                  <p className="text-chocolate/70 leading-relaxed text-sm">
                    {ingredient.description}
                  </p>
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>

        {/* What We DON'T Use */}
        <div className="mt-20">
          <AnimatedReveal>
            <h3 className="font-serif text-2xl font-bold text-dark text-center mb-10">
              What You'll <span className="text-gradient">Never</span> Find In Our Jar
            </h3>
          </AnimatedReveal>

          <div
            ref={promisesRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {promises.map((promise, index) => (
              <AnimatedReveal key={promise.label} delay={index * 0.08} direction="scale">
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="promise-item bg-white rounded-xl p-5 text-center shadow-soft hover:shadow-medium transition-shadow duration-300"
                >
                  <span className="text-2xl block mb-2">{promise.icon}</span>
                  <span className="text-xs font-semibold text-peanut uppercase tracking-wider">
                    {promise.label}
                  </span>
                </motion.div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
