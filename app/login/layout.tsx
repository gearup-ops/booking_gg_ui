import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | Gear Grow Cycle',
    description: 'Log in to your Gear Grow Cycle account to manage bookings, track your bicycle service history, and more.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
