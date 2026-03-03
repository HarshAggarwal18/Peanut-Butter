/**
 * LoginPage — Authentication page with login/register toggle.
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
        toast.success('Account created successfully!');
      } else {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      }
      navigate('/');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-premium pt-20 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl p-8 shadow-medium">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="font-serif text-3xl font-bold text-dark">
              PB<span className="text-golden">.</span>Brand
            </Link>
            <h2 className="font-serif text-xl text-dark mt-4">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-peanut-light mt-2">
              {isRegister
                ? 'Join the premium peanut butter community'
                : 'Sign in to your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required={isRegister}
                  className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl text-chocolate placeholder-peanut-light/50 focus:outline-none focus:ring-2 focus:ring-golden/30 focus:border-golden transition-all"
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-chocolate mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl text-chocolate placeholder-peanut-light/50 focus:outline-none focus:ring-2 focus:ring-golden/30 focus:border-golden transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-chocolate mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl text-chocolate placeholder-peanut-light/50 focus:outline-none focus:ring-2 focus:ring-golden/30 focus:border-golden transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="golden"
              size="lg"
              className="w-full"
              loading={loading}
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-peanut hover:text-golden transition-colors"
            >
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account? Create One"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
