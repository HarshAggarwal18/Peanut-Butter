/**
 * Footer — Elegant brand footer with links and newsletter.
 */
import { Link } from 'react-router-dom';
import AnimatedReveal from '../ui/AnimatedReveal';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-dark text-cream/80 section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <AnimatedReveal className="md:col-span-1">
            <Link to="/" className="font-serif text-3xl font-bold text-cream mb-4 block">
              PB<span className="text-golden">.</span>Brand
            </Link>
            <p className="text-cream/60 leading-relaxed text-sm">
              Premium peanut butter crafted for athletes and professionals.
              No compromise. Just peanuts & sea salt.
            </p>
          </AnimatedReveal>

          {/* Quick Links */}
          <AnimatedReveal delay={0.1}>
            <h4 className="font-serif text-lg font-semibold text-cream mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Products', 'Our Story', 'Reviews', 'FAQ'].map((link) => (
                <li key={link}>
                  <a
                    href={`/#${link.toLowerCase().replace(' ', '-')}`}
                    className="text-cream/60 hover:text-golden transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </AnimatedReveal>

          {/* Customer Care */}
          <AnimatedReveal delay={0.2}>
            <h4 className="font-serif text-lg font-semibold text-cream mb-6">Customer Care</h4>
            <ul className="space-y-3">
              {['Shipping Policy', 'Returns', 'Privacy Policy', 'Terms of Service'].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-cream/60 hover:text-golden transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </AnimatedReveal>

          {/* Newsletter */}
          <AnimatedReveal delay={0.3}>
            <h4 className="font-serif text-lg font-semibold text-cream mb-6">Stay Connected</h4>
            <p className="text-cream/60 text-sm mb-4">
              Get exclusive offers and nutrition tips straight to your inbox.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-cream/20 rounded-xl text-cream placeholder-cream/40 text-sm focus:outline-none focus:border-golden transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-golden text-white rounded-xl text-sm font-medium hover:bg-golden-light transition-colors"
              >
                Join
              </button>
            </form>
          </AnimatedReveal>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/40 text-sm">
            &copy; {currentYear} PB Brand. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-cream/40 text-xs">Made with clean ingredients & clean code</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
