import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Footer() {
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
                                alt='BikeService Logo'
                                width={32}
                                height={32}
                                className='w-8 h-8'
                            />
                            <span className='text-xl font-bold text-white'>
                                BikeService
                            </span>
                        </div>
                        <p className='text-gray-300 text-sm'>
                            Convenient and hassle-free way for cyclists to get
                            their bikes serviced without having to leave the
                            comfort of their homes.
                        </p>
                        <div className='flex space-x-4'>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                            >
                                <Linkedin className='w-5 h-5' />
                            </Button>
                            <Button
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
                            >
                                <Facebook className='w-5 h-5' />
                            </Button>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='text-[#fbbf24] hover:bg-[#3c3d3f]'
                            >
                                <Twitter className='w-5 h-5' />
                            </Button>
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
                                    href='/services'
                                    className='hover:text-white transition-colors'
                                >
                                    Standard Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/services'
                                    className='hover:text-white transition-colors'
                                >
                                    Premium Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/services'
                                    className='hover:text-white transition-colors'
                                >
                                    Assemble- Dismantle
                                </Link>
                            </li>
                            <li>
                                <a
                                    href='#'
                                    className='hover:text-white transition-colors'
                                >
                                    Road Bike Service
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#'
                                    className='hover:text-white transition-colors'
                                >
                                    E Bike Service
                                </a>
                            </li>
                            <li>
                                <Link
                                    href='/services'
                                    className='hover:text-white transition-colors'
                                >
                                    Annual Maintenance
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Subscribe */}
                    <div>
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
                    </div>
                </div>

                <div className='border-t border-[#4a4b4d] mt-8 pt-8 text-center text-sm text-gray-300'>
                    <p>&copy; 2024 BikeService. All rights reserved.</p>
                </div>
            </div>
        </motion.footer>
    );
}
