import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Providers } from './providers';
import CityPopup from '@/components/city-popup';
import LayoutShell from '@/components/layout-shell';

export const metadata: Metadata = {
    title: 'Gear Grow Cycle | Doorstep Bicycle Service & Repair',
    description:
        'Professional doorstep bicycle maintenance and repair services at your location. We serve Pune, Bengaluru, Mumbai, Vishakhapatnam, Hyderabad, Chennai, and Navi Mumbai.',
    keywords: 'bicycle repair, doorstep bike service, cycle maintenance, Pune, Bengaluru, Mumbai, Vishakhapatnam, Hyderabad, Chennai, Navi Mumbai',
    openGraph: {
        title: 'Gear Grow Cycle | Doorstep Bicycle Service & Repair',
        description: 'Professional doorstep bicycle maintenance and repair services at your location. We serve major cities across India.',
        url: 'https://booking.geargrowcycle.com',
        siteName: 'Gear Grow Cycle',
        images: [
            {
                url: 'https://booking.geargrowcycle.com/images/logo.png',
                width: 800,
                height: 600,
            },
        ],
        locale: 'en_IN',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body>
                <Providers>
                    <CityPopup />
                    <LayoutShell>{children}</LayoutShell>
                </Providers>
            </body>
        </html>
    );
}
