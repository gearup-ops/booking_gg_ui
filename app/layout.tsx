'use client';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import CityPopup from '@/components/city-popup';
import LayoutShell from '@/components/layout-shell';

const metadata: Metadata = {
    title: 'Gear Grow Cycle',
    description:
        'Doorstep bicycle maintenance services. Professional bike servicing at your convenience.',
    generator: 'v0.dev',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <head>
                <title>Gear Grow Cycle</title>
                <link rel='icon' href='/images/logo.png' />
            </head>
            <body>
                <Provider store={store}>
                    <CityPopup />
                    <LayoutShell>{children}</LayoutShell>
                </Provider>
            </body>
        </html>
    );
}
