import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Gear Grow Cycle',
    description: 'Contact Gear Grow Cycle for inquiries, support, or feedback regarding our doorstep bicycle maintenance services.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
