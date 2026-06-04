import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Gear Grow Cycle',
    description: 'Learn more about Gear Grow Cycle, our mission, vision, and the expert team behind our doorstep bicycle maintenance services.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
