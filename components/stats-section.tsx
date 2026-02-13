import { useSelector } from 'react-redux';

export default function StatsSection() {
    const { homePageData } = useSelector((state: any) => state.content);

    const stats = homePageData?.s6?.data || [
        { no: '70000+', tl: 'Bicycles serviced in PAN India' },
        { no: '24+', tl: 'Expert Technicians on Staff' },
        { no: '84%+', tl: 'Happy customers' },
    ];

    return (
        <section className='py-16 bg-[#3c3d3f]'>
            <div className='container mx-auto px-4'>
                <div className='text-center mb-8'>
                    <p className='text-gray-300 px-24'>
                        {homePageData?.s6?.hl ||
                            'We have Provided accessible and hassle-free, Convenient and reliable Doorstep bicycle maintenance Services for 5+ years'}
                    </p>
                </div>

                <div className='grid md:grid-cols-3 gap-8'>
                    {stats.map((stat, index) => (
                        <div key={index} className='text-center'>
                            <div className='border-2 border-[#fbbf24] rounded-lg p-6 inline-block bg-[#19191a] w-56 h-full'>
                                <div className='text-4xl font-bold text-[#fbbf24] mb-2'>
                                    {stat.no}
                                </div>
                                <div className='text-gray-300 text-sm'>
                                    {stat.tl}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
