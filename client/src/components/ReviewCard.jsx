/**
 * ReviewCard — Animated review card with star rating.
 */
import { motion } from 'framer-motion';
import { staggerItem } from '../animations/variants';

const ReviewCard = ({ review }) => {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-500"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= review.rating ? 'text-golden' : 'text-beige'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-serif font-semibold text-dark mb-2">
          {review.title}
        </h4>
      )}

      {/* Comment */}
      <p className="text-chocolate/70 text-sm leading-relaxed mb-4">
        "{review.comment}"
      </p>

      {/* Author */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-premium flex items-center justify-center">
            <span className="text-peanut font-semibold text-sm">
              {review.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <span className="text-sm font-medium text-chocolate">
            {review.user?.name || 'Anonymous'}
          </span>
        </div>

        {review.isVerifiedPurchase && (
          <span className="text-[10px] text-success font-medium uppercase tracking-wider flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ReviewCard;
