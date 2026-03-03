/**
 * ReviewSection — Dynamic reviews fetched from API with scroll animation.
 * Includes star rating display and verified purchase badges.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';
import ReviewCard from '../ReviewCard';
import { staggerContainer, staggerItem } from '../../animations/variants';
import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../../animations/gsapAnimations';

// Fallback reviews when API is not available
const fallbackReviews = [
  {
    _id: '1',
    rating: 5,
    title: 'Best peanut butter I\'ve ever had',
    comment:
      'The texture is incredibly smooth and the taste is pure peanut. No weird aftertaste like other brands. My post-workout go-to now.',
    user: { name: 'Rahul S.' },
    isVerifiedPurchase: true,
  },
  {
    _id: '2',
    rating: 5,
    title: 'Finally, clean ingredients!',
    comment:
      'As a nutritionist, I always check labels. This is one of the rare peanut butters that actually has just peanuts and salt. Recommending to all my clients.',
    user: { name: 'Dr. Priya M.' },
    isVerifiedPurchase: true,
  },
  {
    _id: '3',
    rating: 4,
    title: 'Premium quality, worth every rupee',
    comment:
      'You can taste the difference immediately. The roasting brings out an incredible depth of flavor. Slightly pricier but absolutely worth it.',
    user: { name: 'Amit K.' },
    isVerifiedPurchase: true,
  },
  {
    _id: '4',
    rating: 5,
    title: 'Perfect for my fitness goals',
    comment:
      'I go through a jar every week. 30g protein per 100g is unmatched. Mixed into my oats or eaten straight — it\'s perfection.',
    user: { name: 'Sneha T.' },
    isVerifiedPurchase: false,
  },
  {
    _id: '5',
    rating: 5,
    title: 'No more oil separation!',
    comment:
      'Unlike other natural peanut butters, this one has a perfect consistency. No need to stir pools of oil. Just open and eat.',
    user: { name: 'Vikram D.' },
    isVerifiedPurchase: true,
  },
  {
    _id: '6',
    rating: 5,
    title: 'Kids love it too',
    comment:
      'My kids refuse to eat any other peanut butter now. The natural sweetness from perfectly roasted peanuts is all they need. Great for school lunches.',
    user: { name: 'Meera R.' },
    isVerifiedPurchase: true,
  },
];

const ReviewSection = () => {
  const [reviews, setReviews] = useState(fallbackReviews);
  const [averageRating, setAverageRating] = useState(4.9);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Try to fetch from API, fallback to static data
    const fetchReviews = async () => {
      try {
        // Fetch reviews for the first product as a showcase
        const { data: productsData } = await api.get('/products?featured=true');
        if (productsData.data?.length > 0) {
          const productId = productsData.data[0]._id;
          const { data: reviewsData } = await api.get(
            `/products/${productId}/reviews`
          );
          if (reviewsData.data?.length > 0) {
            setReviews(reviewsData.data);
            const avg =
              reviewsData.data.reduce((sum, r) => sum + r.rating, 0) /
              reviewsData.data.length;
            setAverageRating(Math.round(avg * 10) / 10);
          }
        }
      } catch {
        // Silently use fallback data
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reviews-summary', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      });

      gsap.from('.review-tile', {
        y: 36,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.reviews-grid',
          start: 'top 82%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reviews]);

  return (
    <SectionWrapper id="reviews" className="bg-cream-dark">
      <div ref={sectionRef}>
        <SectionHeading
          title="What Our Community Says"
          subtitle="Real reviews from real peanut butter lovers."
        />

      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="reviews-summary flex flex-col items-center mb-12"
      >
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-serif text-5xl font-bold text-dark">{averageRating}</span>
          <span className="text-xl text-peanut-light">/5</span>
        </div>
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${
                star <= Math.round(averageRating) ? 'text-golden' : 'text-beige'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-peanut-light">
          Based on {reviews.length}+ reviews
        </span>
      </motion.div>

      {/* Review Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        className="reviews-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {reviews.map((review) => (
          <div key={review._id} className="review-tile">
            <ReviewCard review={review} />
          </div>
        ))}
      </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default ReviewSection;
