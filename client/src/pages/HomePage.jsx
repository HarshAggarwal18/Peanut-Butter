/**
 * HomePage — Assembles all sections in order.
 * Each section handles its own data fetching and animations.
 */
import HeroSection from '../components/sections/HeroSection';
import InfoSection from '../components/sections/InfoSection';
import WhyDifferent from '../components/sections/WhyDifferent';
import BenefitsSection from '../components/sections/BenefitsSection';
import BuySection from '../components/sections/BuySection';
import ReviewSection from '../components/sections/ReviewSection';

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <InfoSection />
      <WhyDifferent />
      <BenefitsSection />
      <BuySection />
      <ReviewSection />
    </main>
  );
};

export default HomePage;
