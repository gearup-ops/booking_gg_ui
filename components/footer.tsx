import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Linkedin,
    MessageCircle,
    Section,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { ContactDetailsData } from '@/lib/api/contentApi';

export default function Footer() {
    const {
        contactDetails: data,
        isLoading: loading,
        error,
    } = useSelector((state: RootState) => state.content);

    const { selectedCityId } = useSelector((state: RootState) => state.city);

    const contactData = data as ContactDetailsData;
    const { contactAddresses, socials } = contactData || {};

    const cityContact =
        contactAddresses?.find((c) => c.city_id === selectedCityId) ||
        contactAddresses?.[0];
    const whatsappNumber = cityContact?.whatsapp || socials?.phone;

    return (
        <motion.footer
            className='bg-[#060608] border-t border-[#4a4b4d] py-12'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        >
            <div className='container mx-auto px-4'>
                <div className='grid md:grid-cols-4 gap-8'>
                    {/* Company Info */}
                    <div className='space-y-4'>
                        <div className='flex items-center space-x-2'>
                            <Image
                                src='/images/logo.png'
                                alt='GearGrow Cycle Logo'
                                width={32}
                                height={32}
                                className='w-8 h-8'
                            />
                            <span className='text-xl font-bold text-white'>
                                Gear Grow Cycle
                            </span>
                        </div>
                        <p className='text-gray-300 text-sm'>
                            Convenient and hassle-free way for cyclists to get
                            their bikes serviced without having to leave the
                            comfort of their homes.
                        </p>
                        <div className='flex space-x-4'>
                            {/* <Button
                                variant='ghost'
                                size='icon'
                                className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                            >
                                <Linkedin className='w-5 h-5' />
                            </Button> */}
                            {/* <Button
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
                            </Button> */}
                            <div className='w-full max-w-2xl space-y-6'>
                                {socials && (
                                    <div className=''>
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
                                            {whatsappNumber && (
                                                <Button
                                                    onClick={() =>
                                                        window.open(
                                                            `https://wa.me/${whatsappNumber.replace(
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
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className='font-semibold mb-4 text-white'>Links</h3>
                        <ul className='space-y-2 text-sm text-gray-300'>
                            <li>
                                <Link
                                    href='/'
                                    className='hover:text-white transition-colors'
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/services'
                                    className='hover:text-white transition-colors'
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/for-business'
                                    className='hover:text-white transition-colors'
                                >
                                    For business
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/stories'
                                    className='hover:text-white transition-colors'
                                >
                                    Stories
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/about'
                                    className='hover:text-white transition-colors'
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/contact'
                                    className='hover:text-white transition-colors'
                                >
                                    Contact us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/terms'
                                    className='hover:text-white transition-colors'
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className='font-semibold mb-4 text-white'>
                            Services
                        </h3>
                        <ul className='space-y-2 text-sm text-gray-300'>
                            <li>
                                <Link
                                    href='/services/pune/standard-service'
                                    className='hover:text-white transition-colors'
                                >
                                    Standard Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/services/pune/premium-service'
                                    className='hover:text-white transition-colors'
                                >
                                    Premium Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/services/pune/assemble-dismantle'
                                    className='hover:text-white transition-colors'
                                >
                                    Assemble/Dismantle
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/services/pune/road-bike-service'
                                    className='hover:text-white transition-colors'
                                >
                                    Road Bike Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/services/pune/e-bike-service'
                                    className='hover:text-white transition-colors'
                                >
                                    E-Bike Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/services/pune/full-service'
                                    className='hover:text-white transition-colors'
                                >
                                    Full Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Subscribe */}
                    {/* <div>
                        <h3 className='font-semibold mb-4 text-white'>
                            Subscribe Us
                        </h3>
                        <div className='border-b-2 border-[#fbbf24] mb-4'></div>
                        <p className='text-sm text-gray-300 mb-4'>
                            It is a long established fact that a reader will be
                            distracted by the readable
                        </p>
                        <div className='space-y-3'>
                            <Input
                                type='email'
                                placeholder='Email'
                                className='bg-[#3c3d3f] border-[#4a4b4d] text-white placeholder:text-gray-500 focus:border-[#fbbf24]'
                            />
                            <Button className='w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black'>
                                Submit
                            </Button>
                        </div>
                    </div> */}
                </div>

                <div className='border-t border-[#4a4b4d] mt-8 pt-8 text-center text-sm text-gray-300'>
                    <p>
                        &copy; {new Date().getFullYear()} Gear Grow Cycle. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}
