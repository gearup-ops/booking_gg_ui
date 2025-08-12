'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const heroImages = [
    {
        src: '/images/aboutus.png',
        alt: 'Professional bicycle maintenance',
    },
    {
        src: '/images/about2.png',
        alt: 'Expert technician servicing bicycle',
    },
    {
        src: '/images/about3.png',
        alt: 'Quality bicycle service',
    },
];

const services = [
    {
        title: 'Routine Maintenance',
        description:
            'Regular maintenance is essential to keep your bicycle running smoothly and extend its lifespan. Our routine maintenance services include tune-ups, brake adjustments, gear adjustments, and other preventative measures.',
    },
    {
        title: 'Repairs',
        description:
            'We offer a comprehensive range of repair services to fix any issues with your bicycle. Whether you have a punctured tire, broken chain, or damaged brake, our skilled technicians will diagnose the problem and provide a reliable solution.',
    },
    {
        title: 'Upgrades',
        description:
            'Upgrading your bicycle can improve its performance and enhance your riding experience. We offer a variety of upgrade services, including wheel upgrades, gear upgrades, brake upgrades, and other performance enhancements.',
    },
    {
        title: 'Bike Assembly',
        description:
            "If you've recently purchased a new bicycle or are planning to assemble one from scratch, our team can help. We provide bike assembly services to ensure that your bicycle is properly assembled and safe to ride.",
    },
    {
        title: 'Consultation',
        description:
            "We understand that maintaining and repairing bicycles can be confusing, especially if you're new to cycling. That's why we offer consultation services to help you understand your bicycle better and make informed decisions about maintenance and repairs.",
    },
];

const stats = [
    { number: '100+', label: 'Bicycles serviced in 2023' },
    { number: '70+', label: 'Expert Technicians on duty' },
    { number: '25+', label: 'Happy customers' },
];

const brands = [
    { name: 'HERO', logo: '/placeholder.svg?height=60&width=120&text=HERO' },
    { name: 'TREK', logo: '/placeholder.svg?height=60&width=120&text=TREK' },
    {
        name: 'Schnell',
        logo: '/placeholder.svg?height=60&width=120&text=Schnell',
    },
    { name: 'GIANT', logo: '/placeholder.svg?height=60&width=120&text=GIANT' },
    {
        name: 'Performance',
        logo: '/placeholder.svg?height=60&width=120&text=Performance',
    },
];

export default function AboutPage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + heroImages.length) % heroImages.length
        );
    };

    return (
        <div className='min-h-screen bg-[#060608] text-white'>
            <Header />

            {/* Hero Image Carousel */}
            <section className='py-8 bg-[#060608]'>
                <div className='container mx-auto px-4'>
                    <motion.div
                        className='relative max-w-4xl mx-auto'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className='relative h-96 rounded-lg overflow-hidden'>
                            <Image
                                src={
                                    heroImages[currentImageIndex].src ||
                                    '/placeholder.svg'
                                }
                                alt={heroImages[currentImageIndex].alt}
                                fill
                                className='object-cover transition-opacity duration-500'
                            />

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors'
                            >
                                <ChevronLeft className='w-6 h-6' />
                            </button>
                            <button
                                onClick={nextImage}
                                className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors'
                            >
                                <ChevronRight className='w-6 h-6' />
                            </button>
                        </div>

                        {/* Dots Indicator */}
                        <div className='flex justify-center mt-4 space-x-2'>
                            {heroImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentImageIndex
                                            ? 'bg-[#fbbf24]'
                                            : 'bg-gray-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Who We Are Section */}
            <section className='py-16 bg-[#060608]'>
                <div className='container mx-auto px-4'>
                    <motion.h2
                        className='text-4xl md:text-5xl font-bold text-[#fbbf24] mb-8'
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Who We Are?
                    </motion.h2>
                    <motion.div
                        className='max-w-4xl space-y-6 text-gray-300 text-lg leading-relaxed'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <p>
                            We are passionate about cycling and dedicated to
                            making it accessible and hassle-free for everyone.
                            We are a team of experienced and skilled technicians
                            who are committed to providing exceptional bicycle
                            maintenance and repair services.
                        </p>
                        <p>
                            Our company was founded with a vision to provide
                            convenient and reliable door-step bicycle
                            maintenance services to individuals and families in
                            our community. We understand that maintaining and
                            repairing bicycles can be time-consuming and
                            challenging, especially for those who lack the tools
                            or technical expertise to tackle repair shops.
                            That's why we decided to bring our services directly
                            to our customers' door-step, making it easier and
                            more convenient for them to keep their bicycles in
                            top condition.
                        </p>
                        <p>
                            At Doorstep Bicycle Maintenance Service, we take
                            great pride in our workmanship and customer service.
                            We believe in providing the highest quality of
                            maintenance and repairs to ensure that our customers
                            enjoy a safe and enjoyable cycling experience. We
                            are also committed to promoting sustainable
                            transportation and encouraging more people to choose
                            cycling as a mode of transportation.
                        </p>
                        <p>
                            Our team is dedicated to staying ahead of the
                            competition by embracing innovation and continuously
                            seeking new ways to improve our services. We are
                            constantly investing in new technologies and
                            training to ensure that we provide the most
                            up-to-date and effective bicycle maintenance and
                            repair services. We are proud of the relationships
                            we have built with our customers and are committed
                            to exceeding their expectations. We value their
                            feedback and strive to provide exceptional customer
                            service that sets us apart from our competitors.
                        </p>
                        <p>
                            Thank you for choosing Doorstep Bicycle Maintenance
                            Service. We look forward to serving you and helping
                            you keep your bicycle in top condition.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className='py-16 bg-[#3c3d3f]'>
                <div className='container mx-auto px-4'>
                    <motion.h2
                        className='text-4xl md:text-5xl font-bold text-[#fbbf24] mb-8'
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        What We Do?
                    </motion.h2>
                    <motion.p
                        className='text-gray-300 text-lg mb-12 max-w-4xl'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        We provide a wide range of bicycle maintenance and
                        repair services to ensure that your bicycle is in top
                        condition and ready for your next ride. Here's a
                        breakdown of what we do:
                    </motion.p>

                    <div className='space-y-8 max-w-4xl'>
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                className='flex items-start space-x-4'
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                            >
                                <div className='bg-[#fbbf24] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0 mt-1'>
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className='text-[#fbbf24] font-semibold text-xl mb-2'>
                                        {service.title}:
                                    </h3>
                                    <p className='text-gray-300 leading-relaxed'>
                                        {service.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className='mt-12 p-6 bg-[#060608] rounded-lg border border-[#4a4b4d]'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <p className='text-gray-300 text-lg leading-relaxed'>
                            At Doorstep Bicycle Maintenance Service, we pride
                            ourselves on providing exceptional service and
                            customer satisfaction. Our team of skilled
                            technicians is committed to ensuring that your
                            bicycle is in top condition and ready for your next
                            adventure. Contact us today to schedule an
                            appointment and experience the convenience of our
                            doorstep bicycle maintenance services.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className='py-16 bg-[#060608]'>
                <div className='container mx-auto px-4'>
                    <motion.div
                        className='text-center mb-8'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <p className='text-gray-300 text-lg'>
                            We have Provided accessible and hassle-free,
                            convenient and reliable doorstep bicycle maintenance
                            services. Number says that all !!
                        </p>
                    </motion.div>

                    <div className='grid md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className='text-center'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                            >
                                <div className='border-2 border-[#fbbf24] rounded-lg p-8 bg-[#3c3d3f] inline-block'>
                                    <div className='text-4xl font-bold text-[#fbbf24] mb-2'>
                                        {stat.number}
                                    </div>
                                    <div className='text-gray-300 text-sm'>
                                        {stat.label}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            <section className='py-16 bg-[#3c3d3f]'>
                <div className='container mx-auto px-4'>
                    <motion.h2
                        className='text-3xl font-bold text-center mb-12 text-[#fbbf24]'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Brands we served for
                    </motion.h2>
                    <motion.div
                        className='flex flex-wrap justify-center items-center gap-12 opacity-70'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 0.7, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {brands.map((brand, index) => (
                            <motion.div
                                key={index}
                                className='text-xl font-bold text-gray-300'
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                            >
                                {brand.name}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className='py-16 bg-[#060608]'>
                <div className='container mx-auto px-4'>
                    <motion.div
                        className='relative max-w-4xl mx-auto rounded-lg overflow-hidden'
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Image
                            src='/images/home5.png'
                            alt='Cyclists enjoying their ride'
                            width={800}
                            height={300}
                            className='w-full h-64 object-cover'
                        />
                        <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                            <div className='text-center space-y-4'>
                                <h3 className='text-2xl md:text-3xl font-bold text-white'>
                                    Don't let{' '}
                                    <span className='text-[#fbbf24]'>
                                        Bicycle maintenance
                                    </span>{' '}
                                    be a chore - let us take care of it for you!
                                </h3>
                                <Button className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-8 py-3'>
                                    Contact Now
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
