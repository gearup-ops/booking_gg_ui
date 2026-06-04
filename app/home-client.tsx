'use client';

import HeroSection from '@/components/hero-section';
import FeaturesSection from '@/components/features-section';
import ServicesSection from '@/components/services-section';
import WhyChooseUsSection from '@/components/why-choose-us-section';
import ServiceHighlights from '@/components/service-highlights';
import TestimonialsSection from '@/components/testimonials-section';
import StatsSection from '@/components/stats-section';
import BrandsSection from '@/components/brands-section';
import FAQSection from '@/components/faq-section';
import Footer from '@/components/footer';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getHomePageDataAction } from '@/lib/actions/contentActions';

import type { AppDispatch } from '@/lib/store';
import { getUserByIdAction } from '@/lib/actions/userActions';
import { setAuthenticated } from '@/lib/slices/authSlice';
import { getLocaleStorage, removeFromLocalStorage } from '@/lib/utils';

export default function HomeClient({ initialHomePageData }: { initialHomePageData: any }) {
    // Example usage with sample data
    const sampleTestimonials = [
        {
            image: '/happy-customer-portrait.png',
            desc: 'Premium service well done.... Gear wire and axle needed attention which was identified and replaced.... My immediate next ride was smooth... the passion shown by service team is work is indeed appreciative..... well done team... I am sure for next 4500 kms atleast my gear shifts will be smooth....',
        },
        {
            image: '/happy-customer-portrait.png',
            desc: 'Excellent service and attention to detail. The team went above and beyond to ensure my bike was running perfectly. Highly recommend their professional approach and quality work!',
        },
        {
            image: '/happy-customer-portrait.png',
            desc: 'Outstanding experience! Quick turnaround time and the staff was very knowledgeable. My bike feels brand new after their service. Will definitely be coming back!',
        },
    ];

    const dispatch = useDispatch<AppDispatch>();
    const { homePageData: reduxHomePageData, isLoading } = useSelector(
        (state: any) => state.content
    );
    const { isAuthenticated } = useSelector((state: any) => state.auth);

    const homePageData = reduxHomePageData || initialHomePageData;

    const testimonials =
        homePageData?.s5?.map((item: any) => ({
            image: '/happy-customer-portrait.png',
            desc: item.dsc,
        })) || sampleTestimonials;

    useEffect(() => {
        if (!reduxHomePageData && !isLoading) {
            dispatch(getHomePageDataAction());
        }
    }, [dispatch, reduxHomePageData, isLoading]);

    useEffect(() => {
        const token = getLocaleStorage('token');
        if (token && !isAuthenticated) {
            const res = dispatch(getUserByIdAction()).unwrap();
            res
                .then((a) => {
                    if (a.data) {
                        dispatch(setAuthenticated(true));
                    }
                })
                .catch((e) => {
                    console.log(e);
                    removeFromLocalStorage('token');
                });
        }
    }, [dispatch, isAuthenticated]);

    return (
        <div className='min-h-screen bg-[#060608] text-white'>
            <HeroSection initialData={initialHomePageData} />
            <FeaturesSection />
            <ServicesSection />
            <WhyChooseUsSection initialData={initialHomePageData} />
            <ServiceHighlights />
            <TestimonialsSection testimonials={testimonials} />
            <StatsSection initialData={initialHomePageData} />
            <BrandsSection />
            <FAQSection initialData={initialHomePageData} />
            <Footer />
        </div>
    );
}
