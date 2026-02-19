'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { getContactDetailsAction } from '@/lib/actions/contentActions';
import { ContactDetails } from '@/lib/api/contentApi';
import { AppDispatch, RootState } from '@/lib/store';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
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

    useEffect(() => {
        dispatch(getContactDetailsAction());
    }, [dispatch]);

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

    const contact = data as ContactDetails;

    /* ---------------- UI ---------------- */

    return (
        <div className='min-h-screen bg-[#060608] text-white'>
            <Header />
            <div className='min-h-screen bg-black px-4 py-10 text-white flex justify-center'>
                <div className='w-full max-w-2xl bg-zinc-900 border-2 border-yellow-400 shadow-[0_0_15px_#facc15] p-6'>
                    {/* Logo */}
                    <div className='flex justify-center mb-4'>
                        <img
                            src='/images/logo.png'
                            alt='logo'
                            className='w-24'
                        />
                    </div>

                    {/* Phone */}
                    <Section title='Call us on:-'>
                        <a
                            href={`tel:${contact.phone}`}
                            className='text-yellow-400 hover:underline'
                        >
                            {contact.phone}
                        </a>
                    </Section>

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
                    </Section>

                    {/* Social */}
                    <Section title='Follow and know more about us'>
                        <div className='flex justify-evenly py-3'>
                            <Button
                                onClick={() =>
                                    window.open(
                                        'https://wa.me/918888574242',
                                        '_blank'
                                    )
                                }
                                variant='ghost'
                                size='icon'
                                className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                            >
                                <MessageCircle className='w-5 h-5' />
                            </Button>

                            <Button
                                onClick={() =>
                                    window.open(
                                        'https://www.instagram.com/geargrowcycle',
                                        '_blank'
                                    )
                                }
                                variant='ghost'
                                size='icon'
                                className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                            >
                                <Instagram className='w-5 h-5' />
                            </Button>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                                onClick={() =>
                                    window.open(
                                        'https://www.facebook.com/geargrowcycle',
                                        '_blank'
                                    )
                                }
                            >
                                <Facebook className='w-5 h-5' />
                            </Button>
                        </div>
                    </Section>

                    {/* Report */}
                    <p className='mt-4 text-sm'>
                        To report any bugs, glitches, lack of functionality,
                        delayed deliveries, billing errors please email us on
                    </p>

                    <a
                        href={`mailto:${contact.email}`}
                        className='text-yellow-400 hover:underline block mt-1'
                    >
                        {contact.email}
                    </a>
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

interface SocialBtnProps {
    href?: string;
    icon: string;
    label: string;
}

function SocialBtn({ href, icon, label }: SocialBtnProps) {
    if (!href) return null;

    return (
        <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={label}
            className='w-10 h-10 bg-yellow-400 rounded-lg p-2 flex items-center justify-center hover:scale-105 transition'
        >
            <img src={icon} alt={label} className='w-full' />
        </a>
    );
}
