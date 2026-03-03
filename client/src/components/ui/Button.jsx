/**
 * Button — Premium styled button component.
 * Variants: primary (golden), secondary (outline), dark.
 */
import { motion } from 'framer-motion';
import { buttonAnimation } from '../../animations/variants';

const variants = {
  primary:
    'bg-peanut text-cream hover:bg-peanut-dark shadow-soft hover:shadow-medium',
  secondary:
    'bg-transparent border-2 border-peanut text-peanut hover:bg-peanut hover:text-cream',
  golden:
    'bg-golden text-white hover:bg-golden-light shadow-soft hover:shadow-glow',
  dark:
    'bg-dark text-cream hover:bg-chocolate shadow-medium',
  ghost:
    'bg-transparent text-peanut hover:bg-beige/50',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-sans font-medium rounded-xl
        transition-colors duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...buttonAnimation}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
