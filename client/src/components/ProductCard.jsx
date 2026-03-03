/**
 * ProductCard — Beautifully animated product card with variant selector.
 */
import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { hoverScale } from '../animations/variants';

const badgeLabels = {
  'no-palm-oil': 'No Palm Oil',
  'no-vegetable-oil': 'No Veg Oil',
  'no-artificial-flavors': 'No Artificial Flavors',
  'high-protein': 'High Protein',
  'gluten-free': 'Gluten Free',
  'vegan': 'Vegan',
};

const ProductCard = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const { addItem } = useCart();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 140, damping: 18 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 140, damping: 18 });
  const shineX = useTransform(smoothRotateY, [-8, 8], ['35%', '65%']);

  const variant = product.variants[selectedVariant];
  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const discount = variant.compareAtPrice
    ? Math.round(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100)
    : 0;
  const productPath = `/products/${product.slug || product._id}`;

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 10);
    rotateX.set((0.5 - py) * 8);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-500"
      style={{
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...hoverScale}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-premium overflow-hidden">
        <Link to={productPath} className="block w-full h-full">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-4xl text-peanut/20">PB</span>
            </div>
          )}
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-golden text-white text-xs font-bold rounded-full">
            {discount}% OFF
          </span>
        )}

        <motion.div
          aria-hidden
          style={{ left: shineX }}
          className="pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Quick Add */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-4 right-4 p-3 bg-peanut text-cream rounded-full shadow-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => addItem(product, variant)}
        >
          <HiOutlineShoppingBag className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.badges?.slice(0, 3).map((badge) => (
            <span
              key={badge}
              className="px-2 py-0.5 bg-cream text-peanut-light text-[10px] font-medium rounded-full uppercase tracking-wider"
            >
              {badgeLabels[badge] || badge}
            </span>
          ))}
        </div>

        {/* Name & Rating */}
        <h3 className="font-serif text-lg font-semibold text-dark mb-1 leading-tight">
          <Link to={productPath} className="hover:text-golden transition-colors duration-300">
            {product.name}
          </Link>
        </h3>

        {product.ratingsAverage > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(product.ratingsAverage)
                      ? 'text-golden'
                      : 'text-beige'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-peanut-light">
              ({product.ratingsCount})
            </span>
          </div>
        )}

        {/* Variant Selector */}
        <div className="flex gap-2 mb-4">
          {product.variants.map((v, i) => (
            <button
              key={v._id}
              onClick={() => setSelectedVariant(i)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                i === selectedVariant
                  ? 'bg-peanut text-cream'
                  : 'bg-cream text-peanut hover:bg-beige'
              }`}
            >
              {v.size}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-dark">₹{variant.price}</span>
          {variant.compareAtPrice && (
            <span className="text-sm text-peanut-light line-through">
              ₹{variant.compareAtPrice}
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to={productPath}
            className="py-3 text-center bg-cream text-peanut font-medium rounded-xl hover:bg-beige transition-colors duration-300 text-sm"
          >
            View Details
          </Link>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addItem(product, variant)}
            className="py-3 bg-peanut text-cream font-medium rounded-xl hover:bg-peanut-dark transition-colors duration-300 text-sm"
          >
            Add — ₹{variant.price}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
