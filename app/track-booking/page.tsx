'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrackBookingPage() {
    const router = useRouter();

    return (
        <div className='min-h-screen bg-[#060608] text-white'>
            <Header />

            <div className='container mx-auto px-4 py-16'>
                <motion.div
                    className='max-w-2xl mx-auto text-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className='text-4xl font-bold text-[#fbbf24] mb-8'>
                        Track Your Booking
                    </h1>

                    <div className='bg-[#3c3d3f] rounded-lg p-8 border border-[#4a4b4d]'>
                        <div className='flex items-center justify-center mb-6'>
                            <div className='w-16 h-16 bg-[#fbbf24] rounded-full flex items-center justify-center'>
                                <CheckCircle2 className='w-8 h-8 text-black' />
                            </div>
                        </div>

                        <h2 className='text-2xl font-bold text-white mb-4'>
                            Booking Confirmed!
                        </h2>
                        <p className='text-gray-300 mb-6'>
                            Your bicycle service has been scheduled
                            successfully.
                        </p>

                        <div className='space-y-4 text-left'>
                            <div className='flex items-center space-x-3'>
                                <Clock className='w-5 h-5 text-[#fbbf24]' />
                                <span className='text-gray-300'>
                                    Service Date: Tomorrow, 10:00 AM - 12:00 PM
                                </span>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <MapPin className='w-5 h-5 text-[#fbbf24]' />
                                <span className='text-gray-300'>
                                    Location: Your Home Address
                                </span>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <Phone className='w-5 h-5 text-[#fbbf24]' />
                                <span className='text-gray-300'>
                                    Technician will call you 30 minutes before
                                    arrival
                                </span>
                            </div>
                        </div>

                        <div className='mt-8 space-y-4'>
                            <Button
                                onClick={() => router.push('/')}
                                className='w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold py-3'
                            >
                                Back to Home
                            </Button>
                            <Button
                                variant='outline'
                                className='w-full border-[#4a4b4d] text-white hover:bg-[#3c3d3f]'
                            >
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
