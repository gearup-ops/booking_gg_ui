import { Suspense } from 'react';
import HomeClient from './home-client';

export default async function HomePage() {
    let initialHomePageData = null;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/landingPage/getHomePageData`, { next: { revalidate: 3600 } });
        const json = await res.json();
        if (json && json.data) {
            initialHomePageData = json.data;
        }
    } catch (error) {
        console.error('Failed to fetch initial home page data for SSR:', error);
    }

    return (
        <Suspense
            fallback={
                <div className='min-h-screen bg-[#060608] text-white flex justify-center items-center'>
                    Loading...
                </div>
            }
        >
            <HomeClient initialHomePageData={initialHomePageData} />
        </Suspense>
    );
}
