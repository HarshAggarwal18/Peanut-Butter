/**
 * BenefitsSection — Four key benefits with animated cards.
 * Protein, Good Fats, Energy, Clean Ingredients.
 */
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';
import { staggerContainer, staggerItem } from '../../animations/variants';

const benefits = [
  {
    title: 'High Protein',
    value: '30g',
    unit: 'per 100g',
    description:
      'Fuel your muscles with one of the highest protein-per-serving ratios in the market. Perfect post-workout or as a daily protein boost.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    gradient: 'from-golden/20 to-golden/5',
  },
  {
    title: 'Healthy Fats',
    value: '50g',
    unit: 'per 100g',
    description:
      'Rich in monounsaturated and polyunsaturated fats that support heart health, brain function, and sustained energy throughout your day.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    gradient: 'from-peanut/20 to-peanut/5',
  },
  {
    title: 'Clean Energy',
    value: '590',
    unit: 'kcal per 100g',
    description:
      'Sustained, clean energy from whole-food fats and proteins. No sugar spikes, no crashes. Just steady fuel for peak performance.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    gradient: 'from-golden-light/20 to-golden-light/5',
  },
  {
    title: 'Clean Label',
    value: '2',
    unit: 'ingredients only',
    description:
      'Just peanuts and sea salt. We believe food should be simple, honest, and transparent. Every jar. Every time.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    gradient: 'from-success/20 to-success/5',
  },
];

const BenefitsSection = () => {
  return (
    <SectionWrapper id="benefits">
      <SectionHeading
        title="Built For Performance"
        subtitle="Every spoonful is engineered for those who demand more from their food."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
      >
        {benefits.map((benefit) => (
          <motion.div
            key={benefit.title}
            variants={staggerItem}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="relative bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-500 group"
          >
            {/* Gradient background on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-premium flex items-center justify-center text-peanut mb-6 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>

              {/* Value */}
              <div className="mb-4">
                <span className="font-serif text-4xl font-bold text-dark">
                  {benefit.value}
                </span>
                <span className="text-sm text-peanut-light ml-1">
                  {benefit.unit}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-lg font-semibold text-dark mb-3">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-chocolate/60 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
};

export default BenefitsSection;
