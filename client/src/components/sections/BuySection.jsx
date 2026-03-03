/**
 * BuySection — Product grid with cart integration.
 * Fetches products from API and renders ProductCards.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';
import ProductCard from '../ProductCard';
import { staggerContainer, staggerItem } from '../../animations/variants';

const categories = [
  { label: 'All', value: '' },
  { label: 'Creamy', value: 'creamy' },
  { label: 'Crunchy', value: 'crunchy' },
  { label: 'Chocolate', value: 'chocolate' },
  { label: 'Honey', value: 'honey' },
];

const BuySection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = activeCategory ? { category: activeCategory } : {};
      const { data } = await api.get('/products', { params });
      setProducts(data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Use fallback data if API is not running
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionWrapper id="products">
      <SectionHeading
        title="Shop Our Collection"
        subtitle="Choose your fuel. Each jar is crafted with the same unwavering commitment to quality."
      />

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <motion.button
            key={cat.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeCategory === cat.value
                ? 'bg-peanut text-cream shadow-medium'
                : 'bg-white text-peanut hover:bg-beige/50 shadow-soft'
            }`}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse"
            >
              <div className="aspect-square bg-beige/30" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-beige/30 rounded w-3/4" />
                <div className="h-3 bg-beige/20 rounded w-1/2" />
                <div className="h-8 bg-beige/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div key={product._id} variants={staggerItem}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Static fallback when API isn't connected */
        <div className="text-center py-16">
          <p className="text-peanut-light text-lg mb-4">Products loading from our API...</p>
          <p className="text-chocolate/50 text-sm">
            Start the backend server with <code className="bg-beige/50 px-2 py-1 rounded">npm run dev</code> in the server folder.
          </p>
        </div>
      )}

      {/* Free Shipping Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 bg-gradient-to-r from-peanut to-peanut-dark rounded-2xl p-6 text-center text-cream"
      >
        <p className="text-sm font-medium">
          🚚 Free shipping on all orders above ₹499 • 🔄 Easy 7-day returns • 🛡️ 100% Secure payments
        </p>
      </motion.div>
    </SectionWrapper>
  );
};

export default BuySection;
