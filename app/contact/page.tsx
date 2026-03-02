'use client';

import Footer from '@/components/footer';

import { Button } from '@/components/ui/button';
import { getContactDetailsAction } from '@/lib/actions/contentActions';
import {
    ContactAddress,
    ContactDetailsData,
    Socials,
} from '@/lib/api/contentApi';
import { AppDispatch, RootState } from '@/lib/store';
import {
    Facebook,
    Instagram,
    Linkedin,
    MessageCircle,
    Twitter,
    Youtube,
} from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ---------------- Component ---------------- */

export default function ContactPage() {
    const dispatch = useDispatch<AppDispatch>();

    const {
        contactDetails: data,
        isLoading: loading,
        error,
    } = useSelector((state: RootState) => state.content);

    const { selectedCityId } = useSelector((state: RootState) => state.city);

    useEffect(() => {
        dispatch(getContactDetailsAction(selectedCityId ?? undefined));
    }, [dispatch, selectedCityId]);

    /* ---------------- Loading ---------------- */

    if (loading) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-black'>
                <div className='h-6 w-6 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent' />
            </div>
        );
    }

    /* ---------------- Error ---------------- */

    if (error) {
        return <div className='mt-10 text-center text-red-500'>{error}</div>;
    }

    if (!data) return null;

    const contactData = data as ContactDetailsData;
    const { contactAddresses, socials } = contactData;

    /* ---------------- UI ---------------- */

    return (
        <div className='min-h-screen bg-[#060608] text-white'>
            <div className='min-h-screen bg-black px-4 py-10 text-white flex justify-center pt-32'>
                <div className='w-full max-w-2xl space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Render each contact address */}
                    {contactAddresses?.map((contact: ContactAddress) => (
                        <div
                            key={contact.id}
                            className='bg-zinc-900 border-2 border-yellow-400 shadow-[0_0_15px_#facc15] p-6'
                        >
                            {/* Logo */}
                            {/* <div className='flex justify-center mb-4'>
                                <img
                                    src='/images/logo.png'
                                    alt='logo'
                                    className='w-24'
                                />
                            </div> */}

                            {/* Label */}
                            {contact.label && (
                                <h2 className='text-xl font-bold text-yellow-400 text-center mb-4 uppercase'>
                                    {contact.label}
                                </h2>
                            )}

                            {/* Phone */}
                            <Section title='Call us on:-'>
                                <a
                                    href={`tel:${contact.phone}`}
                                    className='text-yellow-400 hover:underline'
                                >
                                    {contact.phone}
                                </a>
                            </Section>

                            {/* WhatsApp */}
                            {contact.whatsapp && (
                                <Section title='WhatsApp:-'>
                                    <a
                                        href={`https://wa.me/${contact.whatsapp.replace(
                                            /[^0-9]/g,
                                            ''
                                        )}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-yellow-400 hover:underline'
                                    >
                                        {contact.whatsapp}
                                    </a>
                                </Section>
                            )}

                            {/* Email */}
                            <Section title='Email us at:-'>
                                <a
                                    href={`mailto:${contact.email}`}
                                    className='text-yellow-400 hover:underline'
                                >
                                    {contact.email}
                                </a>
                            </Section>

                            {/* Address */}
                            <Section title='Address:-'>
                                <p className='text-sm leading-relaxed'>
                                    {contact.address}
                                </p>
                                {contact.location && (
                                    <a
                                        href={contact.location}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-yellow-400 text-sm hover:underline mt-1 inline-block'
                                    >
                                        View on Google Maps
                                    </a>
                                )}
                            </Section>
                        </div>
                    ))}

                    {/* Social Links (shared across all addresses) */}
                </div>
            </div>
            <div className='bg-black flex justify-center py-6'>
                <div className='w-full max-w-2xl space-y-6'>
                    {socials && (
                        <div className='bg-zinc-900 border-2 border-yellow-400 shadow-[0_0_15px_#facc15] p-6'>
                            <Section title='Follow and know more about us'>
                                <div className='flex justify-evenly py-3 flex-wrap gap-2'>
                                    {socials.insta_page_url && (
                                        <Button
                                            onClick={() =>
                                                window.open(
                                                    socials.insta_page_url,
                                                    '_blank'
                                                )
                                            }
                                            variant='ghost'
                                            size='icon'
                                            className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                                        >
                                            <Instagram className='w-5 h-5' />
                                        </Button>
                                    )}
                                    {socials.fb_page_url && (
                                        <Button
                                            onClick={() =>
                                                window.open(
                                                    socials.fb_page_url,
                                                    '_blank'
                                                )
                                            }
                                            variant='ghost'
                                            size='icon'
                                            className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                                        >
                                            <Facebook className='w-5 h-5' />
                                        </Button>
                                    )}
                                    {socials.twitter_page_url && (
                                        <Button
                                            onClick={() =>
                                                window.open(
                                                    socials.twitter_page_url,
                                                    '_blank'
                                                )
                                            }
                                            variant='ghost'
                                            size='icon'
                                            className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                                        >
                                            <Twitter className='w-5 h-5' />
                                        </Button>
                                    )}
                                    {socials.linked_in_page_url && (
                                        <Button
                                            onClick={() =>
                                                window.open(
                                                    socials.linked_in_page_url,
                                                    '_blank'
                                                )
                                            }
                                            variant='ghost'
                                            size='icon'
                                            className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                                        >
                                            <Linkedin className='w-5 h-5' />
                                        </Button>
                                    )}
                                    {socials.you_tube_page_url && (
                                        <Button
                                            onClick={() =>
                                                window.open(
                                                    socials.you_tube_page_url,
                                                    '_blank'
                                                )
                                            }
                                            variant='ghost'
                                            size='icon'
                                            className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                                        >
                                            <Youtube className='w-5 h-5' />
                                        </Button>
                                    )}
                                    {socials.phone && (
                                        <Button
                                            onClick={() =>
                                                window.open(
                                                    `https://wa.me/${socials.phone.replace(
                                                        /[^0-9]/g,
                                                        ''
                                                    )}`,
                                                    '_blank'
                                                )
                                            }
                                            variant='ghost'
                                            size='icon'
                                            className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                                        >
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='24'
                                                height='24'
                                                fill='currentColor'
                                                // class='bi bi-whatsapp'
                                                viewBox='0 0 16 16'
                                            >
                                                <path d='M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232' />
                                            </svg>
                                            {/* <MessageCircle className='w-5 h-5' /> */}
                                        </Button>
                                    )}
                                </div>
                            </Section>

                            {/* Report */}
                            <p className='mt-4 text-sm'>
                                To report any bugs, glitches, lack of
                                functionality, delayed deliveries, billing
                                errors please email us on
                            </p>

                            <a
                                href={`mailto:${socials.email}`}
                                className='text-yellow-400 hover:underline block mt-1'
                            >
                                {socials.email}
                            </a>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

/* ---------------- Reusable Components ---------------- */

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
    return (
        <div className='mt-4'>
            <h3 className='text-lg font-semibold mb-1'>{title}</h3>
            {children}
        </div>
    );
}
