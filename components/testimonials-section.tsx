'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
    image: string;
    desc: string;
}

interface TestimonialsProps {
    testimonials: Testimonial[];
}

export default function TestimonialsSection({
    testimonials,
}: TestimonialsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    const currentTestimonial = testimonials[currentIndex];

    return (
        <div className='bg-[#3c3d3f] py-16'>
            <div className=' p-8 rounded-lg max-w-4xl mx-auto'>
                <h2 className='text-3xl font-bold text-yellow-400 text-center mb-8'>
                    Happy riders!
                </h2>

                <div className='relative flex flex-col lg:flex-row items-center gap-6'>
                    {/* Left Arrow */}
                    <button
                        onClick={goToPrevious}
                        className='absolute -left-8 lg:-left-16 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200'
                        aria-label='Previous testimonial'
                    >
                        <ChevronLeft className='w-6 h-6 text-black' />
                    </button>

                    {/* Profile Image */}
                    {/* <div className='flex-shrink-0'>
                        <div className='w-48 h-48 bg-gray-600 rounded-lg overflow-hidden border-4 border-gray-500'>
                            <img
                                src={
                                    currentTestimonial.image ||
                                    '/placeholder.svg'
                                }
                                alt='Customer'
                                className='w-full h-full object-cover'
                            />
                        </div>
                    </div> */}

                    {/* Testimonial Content */}
                    <div className='flex-1 bg-white rounded-lg p-6 relative'>
                        {/* Speech bubble arrow */}
                        <div className='absolute left-1/2 -top-[15px] -translate-x-1/2 lg:left-0 lg:top-6 lg:translate-x-[-15px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-white lg:border-t-[10px] lg:border-t-transparent lg:border-b-[10px] lg:border-b-transparent lg:border-r-[15px] lg:border-r-white'></div>

                        <p className='text-gray-800 text-sm leading-relaxed max-h-[200px] lg:max-h-none overflow-y-auto lg:overflow-visible pr-2 lg:pr-0'>
                            {currentTestimonial.desc}
                        </p>
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={goToNext}
                        className='absolute -right-8 lg:-right-16 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200'
                        aria-label='Next testimonial'
                    >
                        <ChevronRight className='w-6 h-6 text-black' />
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className='flex justify-center mt-6 gap-2'>
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentIndex
                                    ? 'bg-yellow-400'
                                    : 'bg-gray-500'
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
