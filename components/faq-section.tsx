'use client';

import { useSelector, useDispatch } from 'react-redux';
import { ChevronDown } from 'lucide-react';
import { RootState } from '@/lib/store';
import { toggleFAQ } from '@/lib/slices/uiSlice';

export default function FAQSection() {
    const dispatch = useDispatch();
    const { homePageData } = useSelector((state: RootState) => state.content);
    const openFAQ = useSelector((state: RootState) => state.ui.openFAQ);

    const faqs = homePageData?.s7 || [
        {
            a: 'The duration for completing servicing may vary based on the type of cycle and the extent of required work. On average, our servicing process takes between 30 minutes to 2.5 hours. Rest assured, we prioritize thorough and efficient maintenance to ensure your cycle is in top condition. For precise timing or any other questions, feel free to contact our team for assistance.',
            q: 'How long does it take to complete the servicing?',
        },
        {
            a: "For optimal performance and longevity of your cycle, we recommend regular servicing. The frequency of servicing depends on your usage and cycling habits. \n\n- For light to moderate usage: Servicing every 6 to 12 months is generally sufficient.\n- For frequent and intensive usage: Servicing every 3 to 6 months is recommended to keep your cycle in top shape.\n\nBy adhering to a regular servicing schedule, you can ensure a smoother and safer ride. If you have any specific concerns or need personalized advice, don't hesitate to reach out to our team for guidance.",
            q: 'How often should we get our cycle serviced?',
        },
        {
            a: 'During servicing, we stock a selection of basic spare parts to address common maintenance needs. These parts include components such as brakes, brake pads, cables, chains, and gear adjustments. \n\nPlease note that we do not carry heavy volume parts like tires. In case your cycle requires such parts, we recommend contacting us in advance, and we can guide you on the best course of action.\n\nRest assured, our skilled technicians will ensure that your cycle is well taken care of with the available spare parts to keep it in optimal condition. If you have any specific queries about the parts or need further information, feel free to contact us for assistance.\n',
            q: 'What spare parts do you carry during servicing?',
        },
        {
            a: "To provide efficient and prompt service, our mechanic will travel to your location based on your current address. Utilizing a two-wheeler, our dedicated technician will carry a specialized bag with all the necessary tools and equipment required for the servicing.\n\nRest assured, our mechanic will have your contact number for easy communication and coordination. This ensures a seamless and hassle-free servicing experience right at your doorstep. If you have any specific requirements or concerns, feel free to share them with our team in advance, and we'll be more than happy to accommodate your needs.",
            q: 'How does our mechanic reach you for the servicing?',
        },
    ];

    return (
        <section className='py-16 bg-[#060608]'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-4 text-[#fbbf24]'>
                    FAQ's
                </h2>
                <p className='text-center text-gray-300 mb-12'>
                    Clear your doubts by frequently asked questions by customers
                </p>

                <div className='max-w-3xl mx-auto space-y-4'>
                    {faqs.map((faq) => (
                        <div
                            key={faq.q}
                            className='bg-[#3c3d3f] rounded-lg border border-[#4a4b4d]'
                        >
                            <button
                                className='w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#2a2b2d] transition-colors rounded-lg text-white'
                                onClick={() => dispatch(toggleFAQ(faq.q))}
                            >
                                <span className='font-medium'>{faq.q}</span>
                                <ChevronDown
                                    className={`w-5 h-5 transition-transform ${
                                        openFAQ === faq.q ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {openFAQ === faq.q && (
                                <div className='px-6 pb-4'>
                                    <p className='text-gray-300'>{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
