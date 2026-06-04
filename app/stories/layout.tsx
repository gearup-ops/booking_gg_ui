import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Customer Stories | Gear Grow Cycle',
    description: 'Read customer stories and testimonials about their experience with Gear Grow Cycle\'s premium doorstep bicycle services.',
};

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
