'use client';

import { useRef, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RootState } from '@/lib/store';
import { toggleMobileMenu, setCityPopup } from '@/lib/slices/uiSlice';
import { logout } from '@/lib/slices/authSlice';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Header() {
    const { cities, selectedCityId } = useSelector(
        (state: RootState) => state.city
    );
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
        { name: 'Contact', href: '/contact' },
    ];

    const handleLogout = () => {
        dispatch(logout());

        if (mobileMenuOpen) {
            dispatch(toggleMobileMenu());
        }
    };

    const city = cities.find((city) =>
        selectedCityId !== null ? city.id === selectedCityId : city.id === null
    );

    // Close mobile menu when clicking outside header
    const headerRef = useRef<HTMLElement>(null);
    useEffect(() => {
        if (!mobileMenuOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (
                headerRef.current &&
                !headerRef.current.contains(e.target as Node)
            ) {
                dispatch(toggleMobileMenu());
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen, dispatch]);

    return (
        <motion.header
            ref={headerRef}
            className='absolute top-0 left-0 right-0 z-40 bg-transparent'
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
                            className='w-16 h-16'
                        />
                        <span className='text-xl font-bold text-white'>
                            Gear Grow Cycle
                            {city?.name && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(setCityPopup(true));
                                    }}
                                    className='flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-[#fbbf24]/40 bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 transition-colors cursor-pointer group'
                                    title='Change city'
                                >
                                    <MapPin className='w-2.5 h-2.5 text-[#fbbf24]' />
                                    <span className='text-xs text-[#fbbf24] group-hover:underline'>
                                        {city.name}
                                    </span>
                                </button>
                            )}
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
                                <Link href='/account'>
                                    <Button className='flex items-center space-x-2'>
                                        <User className='w-4 h-4 text-[#fbbf24]' />
                                        {/* <span className='text-white text-sm'>
                                            {user?.firstName} {user?.lastName}
                                        </span> */}
                                    </Button>
                                </Link>
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
                        className='md:hidden mt-4 p-4 border-t border-[#4a4b4d] bg-[#060608]'
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
                            <div className='flex justify-between items-center pt-4 border-t border-[#4a4b4d] mt-4'>
                                <Link
                                    href='/account'
                                    onClick={() => dispatch(toggleMobileMenu())}
                                >
                                    <Button className='flex items-center space-x-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-black'>
                                        <User className='w-4 h-4' />
                                        <span>
                                            {user?.firstName} {user?.lastName}
                                        </span>
                                    </Button>
                                </Link>

                                <Button
                                    onClick={handleLogout}
                                    variant='outline'
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
