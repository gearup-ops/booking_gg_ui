import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Account | Gear Grow Cycle',
    description: 'Manage your Gear Grow Cycle account, view booking history, and update your profile for seamless doorstep bicycle services.',
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
