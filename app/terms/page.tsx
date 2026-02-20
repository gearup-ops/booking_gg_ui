'use client';

import Footer from '@/components/footer';
import Image from 'next/image';

export default function TermsPage() {
    return (
        <div className='min-h-screen bg-[#060608] text-white'>
            {/* Hero Section with Logo and Title */}
            <section className='py-16 bg-[#060608] pt-24'>
                <div className='container mx-auto px-4'>
                    <div className='grid lg:grid-cols-2 gap-12 items-center'>
                        {/* Large Logo */}
                        <div className='flex justify-center lg:justify-start'>
                            <div className='relative'>
                                <div className='w-64 h-64 bg-[#3c3d3f] rounded-full flex items-center justify-center border-4 border-[#fbbf24]'>
                                    <div className='text-center'>
                                        <div className='w-32 h-32 bg-[#3c3d3f] rounded-full flex items-center justify-center mb-4 mx-auto'>
                                            <Image
                                                src='/images/logo.png'
                                                alt='Logo'
                                                width={100}
                                                height={100}
                                            />
                                        </div>
                                        <div className='text-[#fbbf24] font-bold text-xl'>
                                            GEAR GROW CYCLE
                                        </div>
                                        <div className='text-gray-300 text-sm mt-2'>
                                            FOR BETTER FUTURE
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className='text-center lg:text-left'>
                            <h1 className='text-4xl md:text-6xl font-bold text-[#fbbf24]'>
                                Terms & Conditions
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className='py-16 bg-[#3c3d3f]'>
                <div className='container mx-auto px-4'>
                    <div className='max-w-4xl mx-auto space-y-8 text-gray-300 leading-relaxed'>
                        <div className='space-y-6'>
                            <h2 className='text-2xl font-bold text-[#fbbf24] mb-4'>
                                1. Service Agreement
                            </h2>
                            <p>
                                By using our doorstep bicycle maintenance
                                services, you agree to be bound by these Terms
                                and Conditions. Our services include bicycle
                                repair, maintenance, tune-ups, and related
                                services performed at your location. We reserve
                                the right to refuse service if we determine that
                                the bicycle is unsafe to work on or if the
                                requested service is beyond our capabilities.
                                All services are performed by qualified
                                technicians using professional tools and genuine
                                or compatible parts.
                            </p>
                        </div>

                        <div className='space-y-6'>
                            <h2 className='text-2xl font-bold text-[#fbbf24] mb-4'>
                                2. Booking and Scheduling
                            </h2>
                            <p>
                                Service appointments must be booked through our
                                website, mobile application, or customer service
                                hotline. We will confirm your appointment within
                                24 hours of booking. Appointments are subject to
                                technician availability and weather conditions.
                                We reserve the right to reschedule appointments
                                due to unforeseen circumstances. Customers will
                                be notified of any changes at least 2 hours
                                before the scheduled appointment time.
                            </p>
                        </div>

                        <div className='space-y-6'>
                            <h2 className='text-2xl font-bold text-[#fbbf24] mb-4'>
                                3. Payment Terms
                            </h2>
                            <p>
                                Payment is due upon completion of services
                                unless otherwise agreed upon in writing. We
                                accept cash, credit cards, debit cards, and
                                digital payment methods. Prices are subject to
                                change without notice, but any changes will not
                                affect services already booked. Additional
                                charges may apply for services not included in
                                the original quote, but customer approval will
                                be obtained before proceeding with such
                                additional work.
                            </p>
                        </div>

                        <div className='space-y-6'>
                            <h2 className='text-2xl font-bold text-[#fbbf24] mb-4'>
                                4. Warranty and Liability
                            </h2>
                            <p>
                                We provide a 30-day warranty on all services
                                performed and parts installed. This warranty
                                covers defects in workmanship and part failures
                                under normal use conditions. The warranty does
                                not cover damage due to accidents, misuse,
                                normal wear and tear, or modifications made by
                                others. Our liability is limited to the cost of
                                the service performed. We are not responsible
                                for any consequential or incidental damages
                                arising from our services.
                            </p>
                        </div>

                        <div className='space-y-6'>
                            <h2 className='text-2xl font-bold text-[#fbbf24] mb-4'>
                                5. Customer Responsibilities
                            </h2>
                            <p>
                                Customers are responsible for providing accurate
                                information about their bicycle's condition and
                                any specific issues. You must ensure that the
                                service location is safe and accessible for our
                                technicians. Any valuable items or accessories
                                should be removed from the bicycle before
                                service. Customers must be present during the
                                service appointment or designate an authorized
                                representative who can make decisions regarding
                                the service.
                            </p>
                        </div>

                        <div className='space-y-6'>
                            <h2 className='text-2xl font-bold text-[#fbbf24] mb-4'>
                                6. Cancellation Policy
                            </h2>
                            <p>
                                Appointments may be cancelled or rescheduled up
                                to 4 hours before the scheduled time without
                                penalty. Cancellations made less than 4 hours
                                before the appointment may be subject to a
                                cancellation fee. No-shows will be charged the
                                full service fee. We reserve the right to cancel
                                appointments due to weather conditions,
                                technician illness, or other circumstances
                                beyond our control.
                            </p>
                        </div>

                        <div className='space-y-6'>
                            <h2 className='text-2xl font-bold text-[#fbbf24] mb-4'>
                                7. Privacy and Data Protection
                            </h2>
                            <p>
                                We collect and use personal information in
                                accordance with our Privacy Policy. Customer
                                information is used solely for service delivery,
                                communication, and business improvement
                                purposes. We do not share personal information
                                with third parties except as required by law or
                                with customer consent. Customers have the right
                                to access, correct, or delete their personal
                                information upon request.
                            </p>
                        </div>

                        <div className='space-y-6'>
                            <h2 className='text-2xl font-bold text-[#fbbf24] mb-4'>
                                8. Limitation of Liability
                            </h2>
                            <p>
                                Our total liability for any claim arising from
                                our services shall not exceed the amount paid
                                for the specific service in question. We are not
                                liable for any indirect, special, incidental, or
                                consequential damages. This limitation applies
                                regardless of the legal theory upon which the
                                claim is based, whether in contract, tort, or
                                otherwise.
                            </p>
                        </div>

                        <div className='space-y-6'>
                            <h2 className='text-2xl font-bold text-[#fbbf24] mb-4'>
                                9. Modifications to Terms
                            </h2>
                            <p>
                                We reserve the right to modify these Terms and
                                Conditions at any time. Changes will be
                                effective immediately upon posting on our
                                website. Continued use of our services after
                                changes are posted constitutes acceptance of the
                                modified terms. We recommend reviewing these
                                terms periodically to stay informed of any
                                updates.
                            </p>
                        </div>

                        <div className='space-y-6'>
                            <h2 className='text-2xl font-bold text-[#fbbf24] mb-4'>
                                10. Contact Information
                            </h2>
                            <p>
                                If you have any questions about these Terms and
                                Conditions or our services, please contact us
                                through our website, mobile application, or
                                customer service hotline. We are committed to
                                resolving any concerns promptly and
                                professionally. These terms are governed by
                                local laws and any disputes will be resolved
                                through appropriate legal channels.
                            </p>
                        </div>

                        <div className='mt-12 p-6 bg-[#060608] rounded-lg border border-[#4a4b4d]'>
                            <p className='text-sm text-gray-400'>
                                <strong>Last Updated:</strong> January 2024
                                <br />
                                <strong>Effective Date:</strong> January 1, 2024
                                <br />
                                <strong>Version:</strong> 2.1
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
