'use client';

import Header from '@/components/header';
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
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getHomePageDataAction } from '@/lib/actions/contentActions';
import { getCitiesAction } from '@/lib/actions/cityActions';
import type { AppDispatch } from '@/lib/store';
import { getUserByIdAction } from '@/lib/actions/userActions';
import { setAuthenticated } from '@/lib/slices/authSlice';
import {
    getLocaleStorage,
    removeFromLocalStorage,
    setLocaleStorage,
} from '@/lib/utils';
import { ArrowUp } from 'lucide-react';

export default function HomePage() {
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
    const { homePageData, isLoading } = useSelector(
        (state: any) => state.content
    );
    const { user, isAuthenticated } = useSelector((state: any) => state.auth);
    const { cities, isLoading: isCityLoading } = useSelector(
        (state: any) => state.city
    );

    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const testimonials =
        homePageData?.s5?.map((item: any) => ({
            image: '/happy-customer-portrait.png',
            desc: item.dsc,
        })) || sampleTestimonials;

    useEffect(() => {
        if (!homePageData && !isLoading) {
            dispatch(getHomePageDataAction());
        }
        dispatch(getCitiesAction());
    }, [dispatch]);

    // City options
    // const cities = [
    //     { id: 3, name: 'Pune' },
    //     { id: 1, name: 'Mumbai' },
    //     { id: 4, name: 'Bengalore' },
    // ];

    // Popup state
    const [showPopup, setShowPopup] = useState(
        getLocaleStorage('cityId') ? false : true
    );
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

    useEffect(() => {
        if (cities && cities.length > 0 && selectedCityId === null) {
            setSelectedCityId(cities[0].id);
        }
    }, [cities, selectedCityId]);

    useEffect(() => {
        const token = getLocaleStorage('token');
        if (token && !isAuthenticated) {
            // Dispatch an action to fetch user details using the token
            const res = dispatch(getUserByIdAction()).unwrap();
            console.log(
                res
                    .then((a) => {
                        console.log(a);
                        if (a.data) {
                            dispatch(setAuthenticated(true));
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                        removeFromLocalStorage('token');
                    })
            );
        }
    }, [selectedCityId]);

    const handleClosePopup = () => {
        if (selectedCityId !== null) {
            setLocaleStorage('cityId', selectedCityId.toString());
            setShowPopup(false);
        }
    };

    useEffect(() => {
        if (getLocaleStorage('cityId')) {
            setShowPopup(false);
        } else {
            setShowPopup(true);
        }
    }, [getLocaleStorage('cityId')]);

    return (
        <div className='min-h-screen bg-[#060608] text-white'>
            {showPopup && (
                <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
                    <div className='bg-white text-black rounded-lg p-6 min-w-[300px] shadow-lg'>
                        <h2 className='text-lg font-semibold mb-4'>
                            Select your city
                        </h2>
                        <div className='flex flex-row gap-2 mb-4'>
                            {cities.map((city: any) => (
                                <button
                                    key={city.id}
                                    className={`w-full p-2 border rounded ${
                                        selectedCityId === city.id
                                            ? 'bg-[#fbbf24] text-white border-blue-600'
                                            : 'bg-white text-black border-gray-300'
                                    }`}
                                    onClick={() => setSelectedCityId(city.id)}
                                    type='button'
                                >
                                    {city.name}
                                </button>
                            ))}
                        </div>
                        <button
                            className='bg-[#000] text-[#fbbf24] px-4 py-2 rounded w-full'
                            onClick={handleClosePopup}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
            <Header />
            <HeroSection />
            <FeaturesSection />
            <ServicesSection />
            <WhyChooseUsSection />
            <ServiceHighlights />
            <TestimonialsSection testimonials={testimonials} />
            <StatsSection />
            <BrandsSection />
            <FAQSection />
            <Footer />
            {showTopBtn && (
                <button
                    onClick={goToTop}
                    className='fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#fbbf24] text-black shadow-lg hover:bg-[#f59e0b] transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 focus:ring-offset-[#060608]'
                    aria-label='Scroll to top'
                >
                    <ArrowUp className='h-6 w-6' />
                </button>
            )}
        </div>
    );
}
