'use client';

import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import FeaturesSection from '@/components/features-section';
import ServicesSection from '@/components/services-section';
import WhyChooseUsSection from '@/components/why-choose-us-section';
import ServiceHighlights from '@/components/service-highlights';
// import TestimonialsSection from '@/components/testimonials-section' // Removed from homepage
import StatsSection from '@/components/stats-section';
import BrandsSection from '@/components/brands-section';
import FAQSection from '@/components/faq-section';
import Footer from '@/components/footer';

export default function HomePage() {
    return (
        <div className='min-h-screen bg-[#060608] text-white'>
            <Header />
            <HeroSection />
            <FeaturesSection />
            <ServicesSection />
            <WhyChooseUsSection />
            <ServiceHighlights />
            {/* <TestimonialsSection /> */} {/* Removed from homepage */}
            <StatsSection />
            <BrandsSection />
            <FAQSection />
            <Footer />
        </div>
    );
}
