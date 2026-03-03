/**
 * OrderSuccessPage — Post-checkout confirmation page.
 * Fetches order details using Stripe session ID from URL.
 */
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import Button from '../components/ui/Button';
import PageTransition from '../components/ui/PageTransition';
import { useCart } from '../context/CartContext';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();

    if (sessionId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/session/${sessionId}`);
      setOrder(data.data);
    } catch {
      // Order might not be created yet (webhook delay)
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-cream pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg px-4"
        >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8"
        >
          <svg
            className="w-12 h-12 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <h1 className="font-serif text-3xl text-dark mb-4">
          Order Confirmed! 🎉
        </h1>

        <p className="text-peanut-light mb-2">
          Thank you for choosing PB Brand.
        </p>
        <p className="text-chocolate/60 text-sm mb-8">
          {order
            ? `Order #${order.orderNumber} has been placed successfully.`
            : 'Your order is being processed. You\'ll receive a confirmation email shortly.'}
        </p>

        {order && (
          <div className="bg-white rounded-2xl p-6 shadow-soft mb-8 text-left">
            <h3 className="font-serif font-semibold text-dark mb-4">
              Order Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-chocolate/60">Order Number</span>
                <span className="font-mono font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-chocolate/60">Total</span>
                <span className="font-bold">₹{order.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-chocolate/60">Status</span>
                <span className="text-success font-medium capitalize">
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="golden" size="lg">
                Continue Shopping
              </Button>
            </Link>
            {order && (
              <Link to={`/orders/${order._id}`}>
                <Button variant="secondary" size="lg">
                  View Order
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default OrderSuccessPage;
