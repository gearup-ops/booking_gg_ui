import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Services | Gear Grow Cycle',
    description: 'Explore our range of doorstep bicycle maintenance services, from standard tuning to premium overhauls.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
