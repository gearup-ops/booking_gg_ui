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
                'Lorem ipsum dolor sit amet consectetur. Lacus eu gravida tortor nam duis.',
        },
        {
            icon: Award,
            title: 'Affordable Prices',
            description:
                'Lorem ipsum dolor sit amet consectetur. Lacus eu gravida tortor nam duis.',
        },
        {
            icon: Clock,
            title: 'On Call support',
            description:
                'Lorem ipsum dolor sit amet consectetur. Lacus eu gravida tortor nam duis.',
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
