'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import Link from 'next/link';
import { RootState } from '@/lib/store';

const serviceData = {
    standard: {
        title: 'Standard service',
        description:
            'Premium is a service plan for bicycles that includes a comprehensive set of maintenance tasks.',
        price: 399,
        image: '/placeholder.svg?height=400&width=300&text=Bicycle+Maintenance',
        features: [
            {
                title: 'stem bolt',
                description:
                    'is an important part of the headset, which connects the handlebars to the frame of the bike. Adjusting it ensures that the headset is properly aligned and prevents issues such as wobbling or steering problems.',
            },
            {
                title: 'Brakes',
                description:
                    "are a critical safety feature on any bike, so it's important to check and adjust them regularly. This ensures that they're working properly and can effectively slow or stop the bike when needed.",
            },
            {
                title: 'Pedals',
                description:
                    "can become loose over time, which can cause the rider's foot to slip off while pedaling. Tightening them ensures a secure grip and prevents accidents.",
            },
            {
                title: 'Axle setting',
                description:
                    "refers to the tightness of the wheel axles. If they're too loose, the wheels can wobble or even come off while riding. If they're too tight, it can cause excess friction and damage to the bike. Adjusting them properly ensures a smooth and safe ride.",
            },
            {
                title: 'Checking and inflating the tyres',
                description:
                    'to the correct pressure is essential for optimal performance and safety. Underinflated tyres can make the bike harder to ride, while overinflated tyres can increase the risk of punctures or blowouts.',
            },
            {
                title: 'Gear tune-up',
                description:
                    'involves adjusting the derailleur, which is the mechanism that shifts gears on the bike. This ensures smooth gear changes and prevents chain slippage or other issues.',
            },
            {
                title: 'Brake levers',
                description:
                    "can become loose over time, which can affect their ability to stop the bike effectively. Checking and tightening the cables ensures that they're working properly and the rider can brake safely.",
            },
            {
                title: 'Cleaning the bike',
                description:
                    'not only helps maintain its appearance but also prevents dirt and grime from building up and causing damage to the bike over time. A clean bike also rides more smoothly and efficiently.',
            },
        ],
    },
    premium: {
        title: 'Premium service',
        description:
            'Premium service includes everything in standard plus advanced diagnostics and premium parts.',
        price: 699,
        image: '/placeholder.svg?height=400&width=300&text=Premium+Service',
        features: [
            {
                title: 'Complete overhaul',
                description:
                    'Full disassembly and reassembly of your bicycle with detailed inspection of all components.',
            },
            {
                title: 'Premium lubricants',
                description:
                    'High-quality lubricants for chain, gears, and moving parts to ensure optimal performance.',
            },
            {
                title: 'Bearing service',
                description:
                    'Complete bearing inspection, cleaning, and replacement if necessary for smooth operation.',
            },
            {
                title: 'Cable replacement',
                description:
                    'New brake and gear cables for improved responsiveness and safety.',
            },
        ],
    },
    assemble: {
        title: 'Assemble - Dismantle',
        description:
            'Professional assembly and disassembly services for your bicycle.',
        price: 299,
        image: '/placeholder.svg?height=400&width=300&text=Assembly+Service',
        features: [
            {
                title: 'Complete assembly',
                description:
                    'Professional assembly of new bicycles from the box with proper torque specifications.',
            },
            {
                title: 'Disassembly service',
                description:
                    'Careful disassembly for storage, transport, or maintenance purposes.',
            },
            {
                title: 'Safety check',
                description:
                    'Comprehensive safety inspection after assembly to ensure everything is properly fitted.',
            },
        ],
    },
    annual: {
        title: 'Annual maintenance',
        description:
            'Comprehensive yearly maintenance package to keep your bike in perfect condition.',
        price: 1299,
        image: '/placeholder.svg?height=400&width=300&text=Annual+Maintenance',
        features: [
            {
                title: 'Quarterly service',
                description:
                    'Four comprehensive service sessions throughout the year.',
            },
            {
                title: 'Priority booking',
                description:
                    'Skip the queue with priority booking for all services.',
            },
            {
                title: 'Free minor repairs',
                description:
                    'Small adjustments and minor repairs included at no extra cost.',
            },
        ],
    },
};

export default function ServicesPage() {
    const [activeService, setActiveService] = useState('standard');
    const [hasGear, setHasGear] = useState(true);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const currentService =
        serviceData[activeService as keyof typeof serviceData];

    const handleBookNow = () => {
        if (!isAuthenticated) {
            window.location.href = '/login';
        } else {
            // Proceed with booking
            alert('Booking functionality would be implemented here');
        }
    };

    return (
        <div className='min-h-screen bg-[#060608] text-white'>
            <Header />

            {/* Service Tabs */}
            <section className='py-8 bg-[#3c3d3f]'>
                <div className='container mx-auto px-4'>
                    <div className='flex flex-row overflow-x-scroll lg:overflow-auto gap-4 justify-start'>
                        {Object.entries(serviceData).map(([key, service]) => (
                            <button
                                key={key}
                                onClick={() => setActiveService(key)}
                                className={`px-6 py-3 rounded-full border-2 transition-all duration-300 whitespace-nowrap ${
                                    activeService === key
                                        ? 'bg-[#fbbf24] text-black border-[#fbbf24]'
                                        : 'bg-[#19191a] text-white border-[#fbbf24] hover:bg-[#fbbf24] hover:text-black'
                                }`}
                            >
                                {service.title}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Details */}
            <section className='py-16 bg-[#3c3d3f]'>
                <div className='container mx-auto'>
                    <div className='text-center mb-12 px-4'>
                        <h1 className='text-4xl md:text-5xl font-bold text-[#fbbf24] mb-4'>
                            {currentService.title}
                        </h1>
                        <p className='text-gray-300 text-lg max-w-3xl mx-auto'>
                            {currentService.description}
                        </p>
                    </div>

                    <div className='grid lg:grid-cols-2 gap-12 items-start px-4'>
                        {/* Service Image */}
                        <div className='relative'>
                            <div className='bg-[#3c3d3f] rounded-2xl p-8 border-4 border-[#fbbf24]'>
                                <Image
                                    src={
                                        currentService.image ||
                                        '/placeholder.svg'
                                    }
                                    alt={currentService.title}
                                    width={400}
                                    height={400}
                                    className='w-full h-auto rounded-lg'
                                />
                            </div>
                        </div>

                        {/* Service Features */}
                        <div className='space-y-6'>
                            {currentService.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className='flex items-start space-x-4'
                                >
                                    <div className='w-2 h-2 bg-[#fbbf24] rounded-full mt-3 flex-shrink-0'></div>
                                    <div>
                                        <span className='text-[#fbbf24] font-semibold'>
                                            The {feature.title}{' '}
                                        </span>
                                        <span className='text-gray-300'>
                                            {feature.description}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Gear Toggle */}
                    <div className='flex lg:ml-88 justify-center mt-12 p-0'>
                        <div className='bg-[#3c3d3f] rounded-full p-2 flex items-center space-x-4 border border-[#4a4b4d]'>
                            <span
                                className={`px-4 py-2 rounded-full transition-colors ${
                                    !hasGear ? 'text-gray-400' : 'text-white'
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
                        <div className='flex justify-start gap-6 lg:gap-20 bg-[#19191a] p-8'>
                            <div className='text-4xl font-bold text-[#fbbf24]'>
                                {currentService.price} RS
                            </div>
                            <Button
                                onClick={handleBookNow}
                                className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold py-2 text-lg'
                            >
                                {isAuthenticated ? 'Book Now' : 'Login to Book'}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
