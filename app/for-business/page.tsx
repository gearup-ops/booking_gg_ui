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

const forBusinessServiceData = {
    'custom-cycles': {
        title: 'Custom cycles',
        description:
            'Our custom cycle service provides tailored solutions for businesses, ensuring your fleet is always in top condition.',
        price: 399,
        image: '/images/service1.png',
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
    'spare-parts': {
        title: 'Spare Parts',
        description:
            'We provide genuine and high-quality spare parts for all types of bicycles, ensuring durability and performance for your business fleet.',
        price: 199, // Example price
        image: '/images/service2.png',
        features: [
            {
                title: 'Wide selection',
                description:
                    'Access to a vast inventory of bicycle spare parts for various models.',
            },
            {
                title: 'Genuine parts',
                description:
                    'Only authentic and high-quality parts sourced from trusted manufacturers.',
            },
            {
                title: 'Bulk ordering',
                description:
                    'Special pricing and logistics for large volume orders for businesses.',
            },
            {
                title: 'Expert consultation',
                description:
                    'Guidance on selecting the right parts for your specific needs.',
            },
        ],
    },
    'assemble-dismantle': {
        title: 'Assemble - Dismantle',
        description:
            'Efficient assembly and disassembly services for large fleets, ideal for businesses managing multiple bicycles.',
        price: 299, // Example price
        image: '/images/service3.png',
        features: [
            {
                title: 'Fleet assembly',
                description:
                    'Professional assembly of multiple new bicycles for your business fleet.',
            },
            {
                title: 'Event setup/teardown',
                description:
                    'On-site assembly and disassembly for corporate events or rentals.',
            },
            {
                title: 'Logistics support',
                description:
                    'Assistance with transportation and handling of disassembled bikes.',
            },
            {
                title: 'Quality assurance',
                description:
                    'Each assembly is thoroughly checked for safety and performance.',
            },
        ],
    },
    'annual-maintenance': {
        title: 'Annual maintenance',
        description:
            'A comprehensive annual maintenance package designed for businesses to keep their bicycle fleet in optimal condition year-round.',
        price: 1299, // Example price
        image: '/images/service4.png',
        features: [
            {
                title: 'Scheduled inspections',
                description:
                    'Regular, pre-scheduled maintenance checks to prevent issues.',
            },
            {
                title: 'Priority service',
                description:
                    'Businesses receive priority booking and faster service turnaround.',
            },
            {
                title: 'Dedicated technician',
                description:
                    'A dedicated technician assigned to your fleet for consistent service.',
            },
            {
                title: 'Detailed reporting',
                description:
                    'Comprehensive reports on fleet health and maintenance history.',
            },
        ],
    },
};

export default function ForBusinessPage() {
    const [activeService, setActiveService] = useState('custom-cycles');
    const [hasGear, setHasGear] = useState(true);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const currentService =
        forBusinessServiceData[
            activeService as keyof typeof forBusinessServiceData
        ];

    const handleBookNow = () => {
        if (!isAuthenticated) {
            window.location.href = '/login';
        } else {
            // Proceed with booking
            alert(
                'For Business email us at gearupcycle@gmail.com'
            );
        }
    };

    return (
        <div className='min-h-screen bg-[#060608] text-white'>
            <Header />

            {/* Service Tabs */}
            <section className='py-8 bg-[#3c3d3f]'>
                <div className='container mx-auto px-4'>
                    <div className='flex flex-wrap gap-4 justify-center'>
                        {Object.entries(forBusinessServiceData).map(
                            ([key, service]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveService(key)}
                                    className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                                        activeService === key
                                            ? 'bg-[#fbbf24] text-black border-[#fbbf24]'
                                            : 'bg-[#19191a] text-white border-[#fbbf24] hover:bg-[#fbbf24] hover:text-black'
                                    }`}
                                >
                                    {service.title}
                                </button>
                            )
                        )}
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
                    </div>

                    <div className='grid lg:grid-cols-2 gap-12 items-start px-4'>
                        {/* Service Image */}
                        <div className='relative'>
                            <div className='bg-[#3c3d3f] rounded-2xl border-4 border-[#fbbf24]'>
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
                    {/* <div className='flex lg:ml-88 justify-center mt-12'>
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
                    </div> */}

                    {/* Pricing and Book Now */}
                    {/* <div className='ml-8 lg:ml-[800px] mt-6 text-center'>
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
                    </div> */}
                </div>
            </section>

            <Footer />
        </div>
    );
}
