import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'For Business | Gear Grow Cycle',
    description: 'Partner with Gear Grow Cycle for corporate bicycle maintenance solutions. Explore our B2B doorstep services.',
};

export default function ForBusinessLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
