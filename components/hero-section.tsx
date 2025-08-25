'use client';

import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { RootState } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
    const { isAuthenticated, user } = useSelector(
        (state: RootState) => state.auth
    );

    const { homePageData, isLoading } = useSelector(
        (state: RootState) => state.content
    );

    if (!homePageData && isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-[#060608]'>
                <p className='text-white'>Loading...</p>
            </div>
        );
    }

    return (
        <section className='relative min-h-screen bg-[#060608] overflow-hidden'>
            {/* Background gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-br from-[#060608] via-[#3c3d3f] to-[#060608] opacity-90'></div>

            <div className='relative z-10 container mx-auto px-4 py-20'>
                <div className='grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]'>
                    <motion.div
                        className='space-y-6'
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            className='text-4xl md:text-6xl font-bold leading-tight text-white'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {homePageData?.s1?.hl}
                            {/* Pedal with{' '}
                            <span className='text-[#fbbf24]'>Peace of</span>
                            <br />
                            mind */}
                        </motion.h1>
                        <motion.p
                            className='text-xl text-gray-300 leading-relaxed'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            {homePageData?.s1?.tl}
                            {/* Our expert technicians service your companion at
                            home. Professional bike servicing at your
                            convenience, wherever you are. */}
                        </motion.p>
                        <motion.div
                            className='flex flex-col sm:flex-row gap-4'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            {isAuthenticated ? (
                                <div className='space-y-2'>
                                    <p className='text-[#fbbf24] text-sm'>
                                        Welcome back, {user?.name}!
                                    </p>
                                    <Link href='/book'>
                                        <Button className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-8 py-3 text-lg transition-all duration-300 hover:scale-105'>
                                            Book Service Now
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <Link href='/login'>
                                    <Button className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-8 py-3 text-lg transition-all duration-300 hover:scale-105'>
                                        Book Service
                                    </Button>
                                </Link>
                            )}
                            <Button
                                variant='outline'
                                className='border-gray-600 text-white hover:bg-[#3c3d3f] px-8 py-3 text-lg transition-all duration-300'
                            >
                                Learn More
                            </Button>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className='relative'
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <Image
                            src='/images/homeone.png'
                            alt='Professional bicycle maintenance service'
                            width={600}
                            height={500}
                            className='rounded-lg shadow-2xl'
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
