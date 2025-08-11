'use client';

import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RootState } from '@/lib/store';
import { toggleMobileMenu } from '@/lib/slices/uiSlice';
import { logout } from '@/lib/slices/authSlice';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Header() {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const mobileMenuOpen = useSelector(
        (state: RootState) => state.ui.mobileMenuOpen
    );
    const { isAuthenticated, user } = useSelector(
        (state: RootState) => state.auth
    );

    const navItems = [
        { name: 'Services', href: '/services' },
        { name: 'For Business', href: '/for-business' },
        { name: 'Stories', href: '/stories' },
        { name: 'About', href: '/about' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        if (mobileMenuOpen) {
            dispatch(toggleMobileMenu());
        }
    };

    return (
        <motion.header
            className='bg-[#060608] border-b border-[#4a4b4d]'
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className='container mx-auto px-4 py-4'>
                <div className='flex items-center justify-between'>
                    {/* Logo */}
                    <Link href='/' className='flex items-center space-x-2'>
                        <Image
                            src='/images/logo.png'
                            alt='GearGrow Cycle Logo'
                            width={32}
                            height={32}
                            className='w-8 h-8'
                        />
                        <span className='text-xl font-bold text-white'>
                            GearGrow Cycle
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden md:flex items-center space-x-8'>
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`transition-colors ${
                                    pathname === item.href
                                        ? 'text-[#fbbf24]'
                                        : 'text-gray-300 hover:text-white'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <div className='flex items-center space-x-4'>
                                <div className='flex items-center space-x-2'>
                                    <User className='w-4 h-4 text-[#fbbf24]' />
                                    <span className='text-white text-sm'>
                                        {user?.name}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    variant='outline'
                                    size='sm'
                                    className='border-[#4a4b4d] text-white hover:bg-[#3c3d3f]'
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link href='/login'>
                                <Button className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black'>
                                    Account
                                </Button>
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <Button
                        variant='ghost'
                        size='icon'
                        className='md:hidden text-white hover:bg-[#3c3d3f]'
                        onClick={() => dispatch(toggleMobileMenu())}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <motion.nav
                        className='md:hidden mt-4 pb-4 border-t border-[#4a4b4d] pt-4'
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block py-2 transition-colors ${
                                    pathname === item.href
                                        ? 'text-[#fbbf24]'
                                        : 'text-gray-300 hover:text-white'
                                }`}
                                onClick={() => dispatch(toggleMobileMenu())}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <div className='pt-4 border-t border-[#4a4b4d] mt-4'>
                                <div className='flex items-center space-x-2 mb-3'>
                                    <User className='w-4 h-4 text-[#fbbf24]' />
                                    <span className='text-white'>
                                        {user?.name}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    variant='outline'
                                    size='sm'
                                    className='border-[#4a4b4d] text-white hover:bg-[#3c3d3f]'
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className='pt-4 border-t border-[#4a4b4d] mt-4'>
                                <Link href='/login' className='block'>
                                    <Button
                                        onClick={() =>
                                            dispatch(toggleMobileMenu())
                                        }
                                        className='w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black'
                                    >
                                        Account
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.nav>
                )}
            </div>
        </motion.header>
    );
}
