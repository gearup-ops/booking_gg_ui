'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { RootState, AppDispatch } from '@/lib/store';
import { getServicesAction } from '@/lib/actions/serviceActions';
import { setSelectedCityId } from '@/lib/slices/citySlice';
import { useRouter, useSearchParams } from 'next/navigation';

interface ServicePrice {
    id: number;
    price: number;
    type: 'gear' | 'nonGear' | string;
}

export interface Service {
    _id: number;
    serviceName: string;
    serviceShortDescription: string;
    isActive: boolean;
    serviceImageUrl: string;
    serviceChecks: string;
    orderNo: number;
    createdAt: string;
    updatedAt: string;
    prices: ServicePrice[];
}

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

import { slugify } from '@/lib/utils';

export default function ServicesClient({
    initialServices,
    citySlug,
    serviceSlug
}: {
    initialServices: Service[],
    citySlug?: string,
    serviceSlug?: string
}) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
        null
    );
    const scrollRef = useRef<HTMLDivElement>(null);
    const [hasGear, setHasGear] = useState(true);

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const reduxServices = useSelector(
        (state: RootState) => state.services.services
    );
    const isLoading = useSelector(
        (state: RootState) => state.services.isLoading
    );
    const { selectedCityId, cities } = useSelector((state: RootState) => state.city);

    const activeServicesSource = reduxServices && reduxServices.length > 0 ? reduxServices : initialServices;

    const activeServices =
        activeServicesSource
            ?.filter((service: Service) => service.isActive)
            .sort((a: Service, b: Service) => a.orderNo - b.orderNo) || [];

    const lastReduxCityId = useRef(selectedCityId);
    const lastUrlCitySlug = useRef(citySlug);

    // Bidirectional sync between URL and Redux
    useEffect(() => {
        if (!citySlug || !cities || cities.length === 0) return;

        const urlCity = cities.find((c: any) => slugify(c.name) === citySlug);
        if (!urlCity) return;

        // If Redux changed (e.g., user selected a new city from CityPopup)
        if (selectedCityId !== lastReduxCityId.current && selectedCityId !== null) {
            if (urlCity.id !== selectedCityId) {
                const newCity = cities.find((c: any) => c.id === selectedCityId);
                if (newCity) {
                    router.replace(`/services/${slugify(newCity.name)}/${serviceSlug || 'standard-service'}`);
                }
            }
            lastReduxCityId.current = selectedCityId;
            lastUrlCitySlug.current = slugify(cities.find((c: any) => c.id === selectedCityId)?.name || '');
        } 
        // If URL changed (e.g., user navigated to a new URL)
        else if (citySlug !== lastUrlCitySlug.current) {
            if (urlCity.id !== selectedCityId) {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('cityId', urlCity.id.toString());
                }
                dispatch(setSelectedCityId(urlCity.id));
            }
            lastUrlCitySlug.current = citySlug;
            lastReduxCityId.current = urlCity.id;
        }
        // Handle initial load mismatch: The URL is the source of truth!
        else if (selectedCityId !== null && urlCity.id !== selectedCityId) {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('cityId', urlCity.id.toString());
            }
            dispatch(setSelectedCityId(urlCity.id));
            lastReduxCityId.current = urlCity.id;
            lastUrlCitySlug.current = citySlug;
        }
    }, [citySlug, cities, selectedCityId, serviceSlug, router, dispatch]);

    // We rely on initialServices from SSR and CityPopup for fetching new cities.
    // No need to dispatch getServicesAction on mount or route change here.

    useEffect(() => {
        if (activeServices.length > 0) {
            let matchedService = null;

            // First try matching dynamic route slug
            if (serviceSlug) {
                matchedService = activeServices.find(s => slugify(s.serviceName) === serviceSlug);
            }
            // Fallback to legacy query param
            else {
                const serviceName = searchParams.get('service');
                if (serviceName) {
                    matchedService = activeServices.find(s => s.serviceName.toLowerCase() === serviceName.toLowerCase());
                }
            }

            if (matchedService) {
                setSelectedServiceId(matchedService._id);
            } else if (selectedServiceId === null) {
                setSelectedServiceId(activeServices[0]._id);
            }
        } else if (activeServices.length === 0 && selectedServiceId !== null) {
            setSelectedServiceId(null);
        }
    }, [activeServices, selectedServiceId, serviceSlug, searchParams]);

    useEffect(() => {
        if (selectedServiceId && scrollRef.current) {
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
                        container.offsetWidth / 2 +
                        element.offsetWidth / 2;
                    container.scrollTo({
                        left: scrollLeft,
                        behavior: 'smooth',
                    });
                }
            }
        }
    }, [selectedServiceId, activeServices]);

    const currentService = activeServices.find(
        (service: Service) => service._id === selectedServiceId
    );

    const getCurrentPrice = (service: Service) => {
        const bikeType = hasGear ? 'gear' : 'nonGear';
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

    const handleBookNow = () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!currentService) return;

        const params = new URLSearchParams({
            serviceId: currentService._id.toString(),
            name: currentService.serviceName,
            type: hasGear ? 'gear' : 'nonGear',
            price: getCurrentPrice(currentService).toString(),
        });

        router.push(`/book?${params.toString()}`);
    };

    if (isLoading && activeServices.length === 0) {
        return (
            <div className='min-h-screen bg-[#060608] text-white flex justify-center items-center'>
                <p>Loading services...</p>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#060608] text-white'>
            {/* Service Tabs */}
            <section className='py-8 bg-[#3c3d3f] pt-32'>
                <div className='container mx-auto px-4'>
                    <div
                        ref={scrollRef}
                        className='flex flex-row overflow-x-scroll lg:overflow-auto gap-4 justify-start'
                    >
                        {activeServices.map((service: Service) => (
                            <button
                                key={service._id}
                                onClick={() => {
                                    const cSlug = citySlug || (cities && cities.find((c: any) => c.id === selectedCityId)
                                        ? slugify(cities?.find((c: any) => c.id === selectedCityId)?.name || 'pune')
                                        : 'pune');
                                    router.push(`/services/${cSlug}/${slugify(service.serviceName)}`);
                                }}
                                className={`px-6 py-3 rounded-full border-2 transition-all duration-300 whitespace-nowrap ${selectedServiceId === service._id
                                    ? 'bg-[#fbbf24] text-black border-[#fbbf24]'
                                    : 'bg-[#19191a] text-white border-[#fbbf24] hover:bg-[#fbbf24] hover:text-black'
                                    }`}
                            >
                                {service.serviceName}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Details */}
            {currentService && (
                <section className='py-16 bg-[#3c3d3f]'>
                    <div className='container mx-auto'>
                        <div className='text-center mb-12 px-4'>
                            <h1 className='text-4xl md:text-5xl font-bold text-[#fbbf24] mb-4'>
                                {currentService.serviceName}
                            </h1>
                        </div>

                        <div className='grid lg:grid-cols-2 gap-12 items-start px-4'>
                            {/* Service Image */}
                            <div className='relative'>
                                <div className='bg-[#3c3d3f] rounded-2xl border-4 border-[#fbbf24]'>
                                    <Image
                                        src={
                                            currentService.orderNo < 5
                                                ? `/images/service${currentService.orderNo}.png`
                                                : '/bicycle-maintenance-setup.png'
                                        }
                                        alt={currentService.serviceName}
                                        width={400}
                                        height={400}
                                        className='w-full h-auto rounded-lg'
                                    />
                                </div>
                            </div>

                            {/* Service Features */}
                            <div className='space-y-6'>
                                <p>{currentService.serviceShortDescription}</p>
                                {getServiceChecks(currentService).map(
                                    (checkItem: string, index: number) => (
                                        <div
                                            key={index}
                                            className='flex items-start space-x-4'
                                        >
                                            <div className='w-2 h-2 bg-[#fbbf24] rounded-full mt-3 flex-shrink-0'></div>
                                            <div>
                                                <span className='text-white font-semibold'>
                                                    {checkItem}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Gear Toggle */}
                        <div className='flex lg:ml-88 justify-center mt-12'>
                            <div className='bg-[#3c3d3f] rounded-full p-2 flex items-center space-x-4 border border-[#4a4b4d]'>
                                <span
                                    className={`px-4 py-2 rounded-full transition-colors ${!hasGear
                                        ? 'text-gray-400'
                                        : 'text-white'
                                        }`}
                                >
                                    Gear
                                </span>
                                <Switch
                                    checked={!hasGear}
                                    onCheckedChange={(checked) =>
                                        setHasGear(!checked)
                                    }
                                    className='data-[state=checked]:bg-[#fbbf24]'
                                />
                                <span
                                    className={`px-4 py-2 rounded-full transition-colors ${hasGear ? 'text-gray-400' : 'text-white'
                                        }`}
                                >
                                    Non-Gear
                                </span>
                            </div>
                        </div>

                        {/* Pricing and Book Now */}
                        <div className='ml-8 lg:ml-[800px] mt-6 text-center'>
                            <div className='flex justify-start gap-6 lg:gap-20 bg-white p-8'>
                                <div className='text-4xl font-bold text-black'>
                                    {getCurrentPrice(currentService)} RS
                                </div>
                                <Button
                                    onClick={handleBookNow}
                                    className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold py-2 text-lg'
                                >
                                    {isAuthenticated
                                        ? 'Book Now'
                                        : 'Login to Book'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
}
