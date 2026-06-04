import { Wrench, Shield, Clock, Award } from 'lucide-react';

export default function ServiceHighlights() {
    const highlights = [
        {
            icon: Wrench,
            title: 'Expert Mechanic',
            description:
                'We provide expert inhouse mechanic to service your bicycle',
        },
        {
            icon: Shield,
            title: 'Quality Assurance',
            description:
                'We use genuine parts and guarantee top-notch service for a smooth and safe ride.',
        },
        {
            icon: Award,
            title: 'Affordable Prices',
            description:
                'Get premium doorstep bicycle maintenance at transparent and budget-friendly rates.',
        },
        {
            icon: Clock,
            title: 'On Call support',
            description:
                'Our dedicated team is always available to answer your queries and assist you promptly.',
        },
    ];

    return (
        <section className='py-16 bg-[#3c3d3f]'>
            <div className='container mx-auto px-4'>
                <div className='grid md:grid-cols-4 gap-8'>
                    {highlights.map((highlight, index) => (
                        <div key={index} className='text-center space-y-4'>
                            <div className='w-16 h-16 bg-[#fbbf24] rounded-full flex items-center justify-center mx-auto'>
                                <highlight.icon className='w-8 h-8 text-black' />
                            </div>
                            <h3 className='text-lg font-semibold text-white'>
                                {highlight.title}
                            </h3>
                            <p className='text-gray-300 text-sm'>
                                {highlight.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
