/**
 * ProductPage — Full product details with variants, nutrition, ingredients, and reviews.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi';
import api from '../lib/api';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import PageTransition from '../components/ui/PageTransition';

const badgeLabels = {
  'no-palm-oil': 'No Palm Oil',
  'no-vegetable-oil': 'No Vegetable Oil',
  'no-artificial-flavors': 'No Artificial Flavors',
  'high-protein': 'High Protein',
  'gluten-free': 'Gluten Free',
  vegan: 'Vegan',
};

const ProductPage = () => {
  const { identifier } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get(`/products/${identifier}`);
        setProduct(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [identifier]);

  const variant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return product.variants[Math.min(selectedVariant, product.variants.length - 1)];
  }, [product, selectedVariant]);

  const image = useMemo(() => {
    if (!product?.images?.length) return null;
    return product.images[Math.min(selectedImage, product.images.length - 1)];
  }, [product, selectedImage]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-cream pt-24 pb-16">
          <div className="container-custom grid lg:grid-cols-2 gap-10 animate-pulse">
            <div className="aspect-square rounded-3xl bg-beige/40 shimmer" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 rounded bg-beige/40 shimmer" />
              <div className="h-4 w-1/2 rounded bg-beige/30 shimmer" />
              <div className="h-20 rounded bg-beige/30 shimmer" />
              <div className="h-12 rounded bg-beige/40 shimmer" />
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !product) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-cream pt-24 pb-16 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="font-serif text-3xl text-dark mb-3">Product not found</h1>
            <p className="text-peanut-light mb-6">{error || 'The requested product is unavailable.'}</p>
            <Link to="/">
              <Button variant="golden">Back to Home</Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const hasDiscount = variant?.compareAtPrice && variant.compareAtPrice > variant.price;
  const discount = hasDiscount
    ? Math.round(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100)
    : 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream pt-24 pb-16">
        <div className="container-custom">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-peanut-light hover:text-peanut text-sm mb-6 transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to products
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 mb-12">
            <div>
              <div className="aspect-square rounded-3xl bg-gradient-premium overflow-hidden shadow-soft mb-4">
                {image?.url ? (
                  <img src={image.url} alt={image.alt || product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-serif text-6xl text-peanut/20">PB</span>
                  </div>
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, index) => (
                    <button
                      key={`${img.url}-${index}`}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        index === selectedImage ? 'border-golden' : 'border-transparent'
                      }`}
                    >
                      <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="font-serif text-4xl text-dark mb-2">{product.name}</h1>
              {product.tagline && <p className="text-peanut-light mb-4">{product.tagline}</p>}

              <div className="flex flex-wrap gap-2 mb-4">
                {product.badges?.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-peanut shadow-soft"
                  >
                    {badgeLabels[badge] || badge}
                  </span>
                ))}
              </div>

              <p className="text-chocolate/70 leading-relaxed mb-6">{product.description}</p>

              <div className="flex gap-2 mb-5">
                {product.variants?.map((v, idx) => (
                  <button
                    key={v._id || `${v.size}-${idx}`}
                    onClick={() => setSelectedVariant(idx)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      idx === selectedVariant
                        ? 'bg-peanut text-cream'
                        : 'bg-white text-peanut hover:bg-beige/50'
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>

              {variant && (
                <>
                  <div className="flex items-baseline gap-3 mb-5">
                    <span className="text-3xl font-bold text-dark">₹{variant.price}</span>
                    {hasDiscount && (
                      <>
                        <span className="text-lg text-peanut-light line-through">₹{variant.compareAtPrice}</span>
                        <span className="px-2 py-1 rounded-full bg-golden text-white text-xs font-bold">
                          {discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm text-peanut-light">Stock:</span>
                    <span className={`text-sm font-semibold ${variant.stock > 0 ? 'text-success' : 'text-error'}`}>
                      {variant.stock > 0 ? `${variant.stock} available` : 'Out of stock'}
                    </span>
                  </div>

                  <Button
                    variant="golden"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => addItem(product, variant)}
                    disabled={variant.stock < 1}
                  >
                    Add to Cart — ₹{variant.price}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h2 className="font-serif text-2xl text-dark mb-4">Ingredients</h2>
              <ul className="space-y-2 text-chocolate/75">
                {product.ingredients?.map((item, idx) => (
                  <li key={`${item}-${idx}`} className="flex items-start gap-2">
                    <span className="text-golden mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h2 className="font-serif text-2xl text-dark mb-4">Nutrition Facts</h2>
              <p className="text-sm text-peanut-light mb-4">Serving size: {product.nutrition?.servingSize || 'N/A'}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-cream">Calories: {product.nutrition?.calories ?? '-'}</div>
                <div className="p-3 rounded-xl bg-cream">Protein: {product.nutrition?.protein ?? '-'}g</div>
                <div className="p-3 rounded-xl bg-cream">Total Fat: {product.nutrition?.totalFat ?? '-'}g</div>
                <div className="p-3 rounded-xl bg-cream">Sat. Fat: {product.nutrition?.saturatedFat ?? '-'}g</div>
                <div className="p-3 rounded-xl bg-cream">Carbs: {product.nutrition?.carbohydrates ?? '-'}g</div>
                <div className="p-3 rounded-xl bg-cream">Fiber: {product.nutrition?.fiber ?? '-'}g</div>
                <div className="p-3 rounded-xl bg-cream">Sugar: {product.nutrition?.sugar ?? '-'}g</div>
                <div className="p-3 rounded-xl bg-cream">Sodium: {product.nutrition?.sodium ?? '-'}mg</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h2 className="font-serif text-2xl text-dark mb-4">Customer Reviews</h2>
            {product.reviews?.length ? (
              <div className="grid md:grid-cols-2 gap-4">
                {product.reviews.map((review) => (
                  <motion.div key={review._id} className="rounded-xl border border-beige/50 p-4" whileHover={{ y: -2 }}>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'text-golden' : 'text-beige'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {review.title && <h3 className="font-semibold text-dark mb-1">{review.title}</h3>}
                    <p className="text-sm text-chocolate/70">{review.comment}</p>
                    <p className="text-xs text-peanut-light mt-2">— {review.user?.name || 'Verified customer'}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-peanut-light">No reviews yet for this product.</p>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductPage;
