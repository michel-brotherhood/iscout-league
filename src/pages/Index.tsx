import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/sections/HeroSection';

const ManifestoSection = lazy(() => import('@/components/sections/ManifestoSection'));
const ProblemSection = lazy(() => import('@/components/sections/ProblemSection'));
const SolutionSection = lazy(() => import('@/components/sections/SolutionSection'));
const HowItWorksSection = lazy(() => import('@/components/sections/HowItWorksSection'));
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection'));
const AppSection = lazy(() => import('@/components/sections/AppSection'));
const ForWhoSection = lazy(() => import('@/components/sections/ForWhoSection'));
const AdvantagesSection = lazy(() => import('@/components/sections/AdvantagesSection'));
const RevenueSection = lazy(() => import('@/components/sections/RevenueSection'));
const PurposeSection = lazy(() => import('@/components/sections/PurposeSection'));
const PartnersSection = lazy(() => import('@/components/sections/PartnersSection'));
const PartnershipSection = lazy(() => import('@/components/sections/PartnershipSection'));
const FAQSection = lazy(() => import('@/components/sections/FAQSection'));
const FinalCTASection = lazy(() => import('@/components/sections/FinalCTASection'));
const Footer = lazy(() => import('@/components/Footer'));

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <ManifestoSection />
          <ProblemSection />
          <SolutionSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <AppSection />
          <ForWhoSection />
          <AdvantagesSection />
          <RevenueSection />
          <PurposeSection />
          <PartnersSection />
          <PartnershipSection />
          <FAQSection />
          <FinalCTASection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
