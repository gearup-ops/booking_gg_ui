'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { RootState, AppDispatch } from '@/lib/store';
import { getServicesAction } from '@/lib/actions/serviceActions';
import { useRouter } from 'next/navigation';

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

const serviceCheckItems = [
    'Brake adjustment and inspection',
    'Gear shifting optimization',
    'Chain cleaning and lubrication',
    'Tire pressure check and adjustment',
    'Wheel alignment and spoke tension',
    'Handlebar and stem tightening',
    'Seat height and angle adjustment',
    'Pedal inspection and tightening',
    'Cable tension adjustment',
    'Frame cleaning and inspection',
    'Derailleur alignment',
    'Bottom bracket check',
    'Headset adjustment',
    'Quick release inspection',
    'Reflector and light check',
    'Bell and horn functionality',
    'Safety inspection',
];

export default function ServicesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
        null
    );
    const scrollRef = useRef<HTMLDivElement>(null);
    const [hasGear, setHasGear] = useState(true);

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { services, isLoading } = useSelector(
        (state: RootState) => state.services
    );

    const activeServices =
        services
            ?.filter((service: Service) => service.isActive)
            .sort((a: Service, b: Service) => a.orderNo - b.orderNo) || [];

    useEffect(() => {
        dispatch(getServicesAction({ city: 3 }));
    }, [dispatch]);

    useEffect(() => {
        if (activeServices.length > 0 && selectedServiceId === null) {
            setSelectedServiceId(activeServices[0]._id);
        }
    }, [activeServices, selectedServiceId]);

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
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center',
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
            <Header />

            {/* Service Tabs */}
            <section className='py-8 bg-[#3c3d3f]'>
                <div className='container mx-auto px-4'>
                    <div
                        ref={scrollRef}
                        className='flex flex-row overflow-x-scroll lg:overflow-auto gap-4 justify-start'
                    >
                        {activeServices.map((service: Service) => (
                            <button
                                key={service._id}
                                onClick={() =>
                                    setSelectedServiceId(service._id)
                                }
                                className={`px-6 py-3 rounded-full border-2 transition-all duration-300 whitespace-nowrap ${
                                    selectedServiceId === service._id
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
                                            // currentService.serviceImageUrl
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
                                    className={`px-4 py-2 rounded-full transition-colors ${
                                        !hasGear
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
                                    className={`px-4 py-2 rounded-full transition-colors ${
                                        hasGear ? 'text-gray-400' : 'text-white'
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
