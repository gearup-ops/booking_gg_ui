import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Gear Grow Cycle',
    description: 'Read the terms and conditions for using Gear Grow Cycle\'s doorstep bicycle maintenance services.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
