'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header';

// Pages where the header should NOT be shown
const HIDDEN_HEADER_ROUTES = ['/login', '/signup'];

export default function LayoutShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const showHeader = !HIDDEN_HEADER_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    return (
        <div className='relative'>
            {showHeader && <Header />}
            {children}
        </div>
    );
}
