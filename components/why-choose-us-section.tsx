'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';

export default function WhyChooseUsSection() {
    const { homePageData } = useSelector((state: any) => state.content);

    return (
        <section className='py-16 bg-[#3c3d3f]'>
            <div className='container px-16'>
                <div className='grid lg:grid-cols-3 gap-12 items-center'>
                    <div className='lg:col-span-2 space-y-6'>
                        <h2 className='text-3xl md:text-4xl font-bold text-[#fbbf24]'>
                            {homePageData?.s3?.hl || 'Why choose us?'}
                        </h2>
                        <p>
                            {homePageData?.s3?.tl1 ||
                                "Don't let bike maintenance be a chore - let us take care of it for you!"}
                        </p>
                        {homePageData ? (
                            <ul className='space-y-4 text-gray-300 list-disc pl-5'>
                                {homePageData?.s3?.pts?.map((point: any) => (
                                    <li key={point._id}>{point.pt}</li>
                                ))}
                            </ul>
                        ) : (
                            <ul className='space-y-4 text-gray-300'>
                                <li>
                                    We provide professional bicycle maintenance
                                    services with over 5 years of experience in
                                    the industry. Our certified technicians
                                    ensure your bike receives the best care
                                    possible.
                                </li>
                                <li>
                                    With our doorstep service, you don't have to
                                    worry about transportation or waiting in
                                    long queues. We come to you with all the
                                    necessary tools and equipment.
                                </li>
                                <li>
                                    Our transparent pricing and quality
                                    guarantee ensure you get the best value for
                                    your money. We use only genuine parts and
                                    provide warranty on all our services.
                                </li>
                            </ul>
                        )}
                        <p>
                            {homePageData?.s3?.tl2 ||
                                'Book an appointment and experience our convenient and high-quality service'}
                        </p>
                        {/* <Button
                            onClick={() => {
                                if (homePageData?.s3?.url) {
                                    window.location.href = homePageData.s3.url;
                                }
                            }}
                            className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold'
                        >
                            Learn More
                        </Button> */}
                    </div>
                    <div className='lg:col-span-1'>
                        <Image
                            src='/images/fixing-cycle.svg'
                            alt='Professional bicycle maintenance'
                            width={400}
                            height={400}
                            className='shadow-[20px_20px_0_0_#7b7b7b]'
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
