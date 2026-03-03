/**
 * CartPage — Full cart view with quantity controls and checkout CTA.
 */
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiPlus, HiMinus, HiArrowLeft } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import api from '../lib/api';
import toast from 'react-hot-toast';

const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    shippingCost,
    tax,
    total,
    totalItems,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to checkout');
      navigate('/login');
      return;
    }

    try {
      const checkoutItems = items.map((item) => ({
        product: item.product,
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/orders/checkout', {
        items: checkoutItems,
        shipping: {
          name: 'Customer', // Will be collected in real checkout form
          email: 'customer@example.com',
          address: {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
          },
        },
      });

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Checkout failed. Please try again.'
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-6xl block mb-6">🥜</span>
          <h2 className="font-serif text-2xl text-dark mb-4">Your cart is empty</h2>
          <p className="text-peanut-light mb-8">
            Looks like you haven't added any peanut butter yet.
          </p>
          <Link to="/">
            <Button variant="golden" size="lg">
              Browse Products
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-peanut-light hover:text-peanut text-sm mb-3 transition-colors"
            >
              <HiArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="font-serif text-3xl text-dark">
              Your Cart ({totalItems})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-error hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={`${item.product}-${item.variantId}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="bg-white rounded-2xl p-5 shadow-soft flex items-center gap-5"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-gradient-premium rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-serif text-xl text-peanut/30">PB</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-dark truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-peanut-light">{item.size}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-bold text-dark">₹{item.price}</span>
                      {item.compareAtPrice && (
                        <span className="text-xs text-peanut-light line-through">
                          ₹{item.compareAtPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.product, item.variantId, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center hover:bg-beige transition-colors"
                    >
                      <HiMinus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product, item.variantId, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center hover:bg-beige transition-colors"
                    >
                      <HiPlus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line total */}
                  <span className="font-bold text-dark w-20 text-right">
                    ₹{item.price * item.quantity}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.product, item.variantId)}
                    className="p-2 text-peanut-light hover:text-error transition-colors"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-28">
              <h3 className="font-serif text-xl font-semibold text-dark mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-chocolate/60">Subtotal</span>
                  <span className="font-medium text-dark">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-chocolate/60">Shipping</span>
                  <span className="font-medium text-dark">
                    {shippingCost === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-chocolate/60">Tax (18% GST)</span>
                  <span className="font-medium text-dark">₹{tax}</span>
                </div>
                <div className="border-t border-beige/30 pt-3 flex justify-between">
                  <span className="font-semibold text-dark">Total</span>
                  <span className="font-serif text-xl font-bold text-dark">
                    ₹{total}
                  </span>
                </div>
              </div>

              {subtotal > 0 && subtotal < 499 && (
                <p className="text-xs text-golden mb-4 text-center">
                  Add ₹{499 - subtotal} more for free shipping!
                </p>
              )}

              <Button
                variant="golden"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              <p className="text-[10px] text-center text-peanut-light mt-4">
                🔒 Secured by Stripe. 256-bit SSL encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
