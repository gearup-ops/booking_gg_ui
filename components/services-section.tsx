'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { RootState, AppDispatch } from '@/lib/store';
import { getServicesAction } from '@/lib/actions/serviceActions';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getLocaleStorage } from '@/lib/utils';

interface ServicePrice {
    id: number;
    price: number;
    type: 'gear' | 'nonGear' | string;
}

interface Service {
    _id: number;
    serviceName: string;
    serviceShortDescription: string;
    isActive: boolean;
    serviceImageUrl: string;
    serviceChecks: string; // stringified array of booleans
    orderNo: number;
    createdAt: string;
    updatedAt: string;
    prices: ServicePrice[];
}

// const serviceCheckItems = [
//     'Brake adjustment and inspection',
//     'Gear shifting optimization',
//     'Chain cleaning and lubrication',
//     'Tire pressure check and adjustment',
//     'Wheel alignment and spoke tension',
//     'Handlebar and stem tightening',
//     'Seat height and angle adjustment',
//     'Pedal inspection and tightening',
//     'Cable tension adjustment',
//     'Frame cleaning and inspection',
//     'Derailleur alignment',
//     'Bottom bracket check',
//     'Headset adjustment',
//     'Quick release inspection',
//     'Reflector and light check',
//     'Bell and horn functionality',
//     'Safety inspection',
// ];

const serviceCheckItems = [
    'Stem Bolt (Alignment of Headset)',
    'Brakes (Check & Adjust)',
    'Pedals (Tightening)',
    'Axle Setting (Loose & Tightening)',
    'Tyre Pressure (Check/Inflate)',
    'Gear Tune-up',
    'Clean up with D-Greaser',
    'Bottom Bracket (Checkup)',
    'Chain (Check & Lube)',
    'Cables (Check & Lube)',
    'Checking & Tightening All Screws & Bolts',
    'Wheel Truing (Not Wheel Bend)',
    'Pre-ride Check',
    'Safety Checks',
    'Hub Checkup',
    'Clean (Wipe Clean The Bike)',
    'Brake Levers (Loose & Tightening)',
];

export default function ServicesSection() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
        null
    );

    const scrollRef = useRef<HTMLDivElement>(null);
    const [isGearBike, setIsGearBike] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { services, isLoading } = useSelector(
        (state: RootState) => state.services
    );

    const activeServices =
        services
            ?.filter((service: Service) => service.isActive)
            .sort((a: Service, b: Service) => a.orderNo - b.orderNo) || [];

    const { selectedCityId } = useSelector((state: RootState) => state.city);

    useEffect(() => {
        if (selectedCityId !== null) {
            dispatch(getServicesAction({ city: selectedCityId }));
        }
    }, [dispatch, selectedCityId]);

    useEffect(() => {
        if (activeServices.length > 0) {
            if (selectedServiceId === null || !activeServices.some(s => s._id === selectedServiceId)) {
                setSelectedServiceId(activeServices[0]._id);
            }
        } else if (activeServices.length === 0 && selectedServiceId !== null) {
            setSelectedServiceId(null);
        }
    }, [activeServices, selectedServiceId]);

    useEffect(() => {
        if (selectedServiceId && scrollRef.current && isMobile) {
            const index = activeServices.findIndex(
                (service) => service._id === selectedServiceId
            );
            if (index !== -1) {
                const element = scrollRef.current.children[
                    index
                ] as HTMLElement;
                if (element) {
                    const container = scrollRef.current;
                    const scrollLeft =
                        element.offsetLeft -
                        container.clientWidth / 2 +
                        element.clientWidth / 2;

                    container.scrollTo({
                        left: scrollLeft,
                        behavior: 'smooth',
                    });
                }
            }
        }
    }, [selectedServiceId, activeServices, isMobile]);

    const currentService = activeServices.find(
        (service: Service) => service._id === selectedServiceId
    );

    const getCurrentPrice = (service: Service) => {
        const bikeType = isGearBike ? 'gear' : 'nonGear';
        const priceObj = service.prices.find((p) => p.type === bikeType);
        return priceObj?.price || 0;
    };

    const getServiceChecks = (service: Service) => {
        try {
            const checksArray = JSON.parse(service.serviceChecks) || [];
            return serviceCheckItems.filter(
                (_, index) => checksArray[index] === true
            );
        } catch {
            return [];
        }
    };

    const scrollServices = (direction: 'left' | 'right') => {
        if (!selectedServiceId || activeServices.length === 0) return;
        const currentIndex = activeServices.findIndex(
            (s: Service) => s._id === selectedServiceId
        );
        if (currentIndex !== -1) {
            let nextIndex =
                direction === 'left' ? currentIndex - 1 : currentIndex + 1;
            if (nextIndex >= 0 && nextIndex < activeServices.length) {
                setSelectedServiceId(activeServices[nextIndex]._id);
            }
        }
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!currentService) return;

        const params = new URLSearchParams({
            serviceId: currentService._id.toString(),
            name: currentService.serviceName,
            type: isGearBike ? 'gear' : 'nonGear',
            price: getCurrentPrice(currentService).toString(),
        });

        router.push(`/book?${params.toString()}`);
    };

    if (isLoading && activeServices.length === 0) {
        return (
            <section className='bg-[#3c3d3f]'>
                <div className='relative w-full h-auto flex items-center justify-center overflow-hidden py-20 px-4 lg:px-0'>
                    <div className='container mx-auto px-4 lg:px-16 py-16 bg-black/50 rounded-2xl max-w-6xl relative'>
                        <div className='text-center text-white'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#f5b41d] mx-auto mb-4'></div>
                            <p>Loading services...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='bg-[#3c3d3f]'>
            <div className='relative w-full h-auto flex items-center justify-center overflow-hidden py-10 lg:py-20 px-2 lg:px-0'>
                <div className='absolute inset-0 hidden lg:block'>
                    <Image
                        src='/images/bg-cycle.jpg'
                        alt='Background bicycle'
                        fill
                        className='object-cover object-center'
                    />
                </div>

                <div className='container mx-auto px-4 lg:px-16 py-8 lg:py-16 bg-black/50 rounded-xl lg:rounded-2xl max-w-6xl relative'>
                    <motion.div
                        className='text-center mb-8 lg:mb-12'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className='text-2xl md:text-4xl font-bold mb-2 lg:mb-4 text-white'>
                            Our services
                        </h2>
                        <p className='text-white text-sm lg:text-base max-w-2xl mx-auto'>
                            Skip the hassle: our on demand bicycle servicing
                            comes to you!
                        </p>
                    </motion.div>

                    <motion.div
                        className='flex justify-center mb-6 lg:mb-8'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className='bg-[#3c3d3f] rounded-full p-1 flex items-center space-x-1 lg:space-x-2 border border-[#4a4b4d] text-sm lg:text-base'>
                            <Button
                                onClick={() => setIsGearBike(true)}
                                className={`px-4 lg:px-6 py-1.5 lg:py-2 rounded-full transition-all duration-300 ${isGearBike
                                    ? 'bg-[#9ee2ff] text-black'
                                    : 'bg-transparent text-gray-300 hover:bg-[#2a2b2d]'
                                    }`}
                            >
                                Gear
                            </Button>
                            <Button
                                onClick={() => setIsGearBike(false)}
                                className={`px-4 lg:px-6 py-1.5 lg:py-2 rounded-full transition-all duration-300 ${!isGearBike
                                    ? 'bg-[#9ee2ff] text-black'
                                    : 'bg-transparent text-gray-300 hover:bg-[#2a2b2d]'
                                    }`}
                            >
                                Non-Gear
                            </Button>
                        </div>
                    </motion.div>

                    <div className='grid lg:grid-cols-2 gap-6 lg:gap-8 items-start w-full min-w-0'>
                        {/* Left Panel: Service List */}
                        <div className="relative w-full min-w-0 flex items-center gap-1 sm:gap-2 lg:block">
                            {(() => {
                                const currentIndex = activeServices.findIndex(s => s._id === selectedServiceId);
                                const isFirstService = currentIndex <= 0;
                                const isLastService = currentIndex === -1 || currentIndex === activeServices.length - 1;

                                return (
                                    <>
                                        {/* Mobile Left Arrow */}
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollServices('left'); }}
                                            disabled={isFirstService}
                                            className="lg:hidden shrink-0 pointer-events-auto bg-black/60 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm shadow-md hover:bg-black/80 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/60"
                                        >
                                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>

                                        <motion.div
                                            ref={scrollRef}
                                            className='flex-1 min-w-0 relative flex lg:flex-col gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: 0.3 }}
                                            viewport={{ once: true }}
                                        >
                                            {activeServices.map(
                                                (service: Service, index: number) => {
                                                    const currentPrice =
                                                        getCurrentPrice(service);
                                                    return (
                                                        <motion.button
                                                            key={service._id}
                                                            onClick={() =>
                                                                setSelectedServiceId(
                                                                    service._id
                                                                )
                                                            }
                                                            className={`w-full shrink-0 snap-center text-left p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 flex justify-between items-center ${selectedServiceId ===
                                                                service._id
                                                                ? 'bg-[#f5b41d] text-black border-[#f5b41d]'
                                                                : 'bg-white text-black border-[#4a4b4d] hover:bg-[#2a2b2d]'
                                                                }`}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            initial={{
                                                                opacity: 0,
                                                                y: isMobile ? 0 : 20,
                                                            }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            transition={{
                                                                duration: 0.4,
                                                                delay: index * 0.1,
                                                            }}
                                                            viewport={{ once: true }}
                                                        >
                                                            <div className='flex items-center space-x-2 lg:space-x-3 w-full min-w-0'>
                                                                {selectedServiceId ===
                                                                    service._id && (
                                                                        <CheckCircle2 className='w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0' />
                                                                    )}
                                                                <div className='flex-1 min-w-0'>
                                                                    <span className='font-semibold text-base lg:text-lg block truncate'>
                                                                        {service.serviceName}
                                                                    </span>
                                                                    <span className='block text-xs lg:text-sm text-gray-600 truncate'>
                                                                        {isGearBike
                                                                            ? 'Gear'
                                                                            : 'Non-Gear'}
                                                                    </span>
                                                                </div>
                                                                <span className='font-bold text-base lg:text-lg md:hidden ml-2 whitespace-nowrap flex-shrink-0'>
                                                                    {currentPrice} Rs
                                                                </span>
                                                            </div>
                                                            <span className='font-bold text-lg hidden md:block whitespace-nowrap flex-shrink-0'>
                                                                {currentPrice} Rs
                                                            </span>
                                                        </motion.button>
                                                    );
                                                }
                                            )}
                                        </motion.div>

                                        {/* Mobile Right Arrow */}
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollServices('right'); }}
                                            disabled={isLastService}
                                            className="lg:hidden shrink-0 pointer-events-auto bg-black/60 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm shadow-md hover:bg-black/80 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/60"
                                        >
                                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Right Panel: Service Details */}
                        {currentService && (
                            <motion.div
                                className='w-full min-w-0 bg-white text-black rounded-xl p-4 lg:p-6 border border-[#4a4b4d] shadow-lg overflow-hidden'
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                                key={selectedServiceId}
                            >
                                <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center mb-3 lg:mb-4 relative w-full min-w-0'>
                                    <div className='w-full lg:w-[70%] mb-2 lg:mb-0 min-w-0'>
                                        <h3 className='text-xl lg:text-2xl font-bold text-black break-words'>
                                            {currentService.serviceName}
                                        </h3>
                                    </div>
                                    <div className='lg:absolute lg:right-0 lg:-mr-6 text-lg lg:text-4xl font-bold text-white bg-[#3c9306] w-fit px-3 lg:px-4 py-1 lg:py-2 rounded-full lg:rounded-r-none lg:rounded-l-full self-start lg:self-auto flex-shrink-0'>
                                        {getCurrentPrice(currentService)} Rs
                                    </div>
                                </div>

                                <div className='mb-3 lg:mb-4'>
                                    <Image
                                        src={
                                            '/images/service1.png'
                                            // currentService.serviceImageUrl ||
                                        }
                                        alt={currentService.serviceName}
                                        width={400}
                                        height={200}
                                        className='w-full h-40 lg:h-48 object-cover rounded-lg'
                                    />
                                </div>

                                <p className='text-gray-700 text-xs lg:text-sm mb-3 lg:mb-4'>
                                    {currentService?.serviceShortDescription?.slice(
                                        0,
                                        100
                                    ) + '...'}
                                </p>

                                {getServiceChecks(currentService).length !==
                                    0 ? (
                                    <h4 className='text-base lg:text-lg font-semibold text-black mb-2 lg:mb-3'>
                                        What we provide?
                                    </h4>
                                ) : null}
                                <ul className='space-y-1.5 lg:space-y-2 text-black text-sm lg:text-base'>
                                    {getServiceChecks(currentService).map(
                                        (checkItem: string, index: number) => (
                                            <motion.li
                                                key={index}
                                                className='flex items-center space-x-2'
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: index * 0.05,
                                                }}
                                                viewport={{ once: true }}
                                            >
                                                <CheckCircle2 className='w-4 h-4 lg:w-5 lg:h-5 text-[#4CAF50] flex-shrink-0' />
                                                <span>{checkItem}</span>
                                            </motion.li>
                                        )
                                    )}
                                </ul>
                            </motion.div>
                        )}
                    </div>

                    {/* Book Now Button */}
                    <motion.div
                        className='mt-8 lg:mt-12 text-center'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <Button
                            onClick={handleBookNow}
                            disabled={isLoading || !currentService}
                            className='bg-[#f5b41d] hover:bg-[#f59e0b] text-black font-semibold px-8 lg:px-12 py-3 lg:py-4 text-lg lg:text-xl rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 w-full md:w-auto'
                        >
                            {isLoading ? 'Loading...' : 'Book Now'}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
