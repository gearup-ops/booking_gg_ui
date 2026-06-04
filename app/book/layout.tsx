import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Book a Service | Gear Grow Cycle',
    description: 'Book your doorstep bicycle service with Gear Grow Cycle. Schedule a convenient time for expert bike maintenance at your home.',
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
