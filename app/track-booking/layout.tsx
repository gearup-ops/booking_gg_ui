import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Track Booking | Gear Grow Cycle',
    description: 'Track the status of your Gear Grow Cycle bicycle maintenance booking in real-time.',
};

export default function TrackBookingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
