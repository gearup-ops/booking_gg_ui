import { Suspense } from 'react';
import ServicesClient, { Service } from '../../services-client';
import { Metadata, ResolvingMetadata } from 'next';

import { slugify } from '@/lib/utils';

type Props = {
    params: { city: string; service: string };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const cityCapitalized = params.city.charAt(0).toUpperCase() + params.city.slice(1).replace('-', ' ');
    const serviceFormatted = params.service.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
        title: `${serviceFormatted} in ${cityCapitalized} | Gear Grow Cycle`,
        description: `Book professional ${serviceFormatted} in ${cityCapitalized}. Doorstep bicycle maintenance and repair services at your location.`,
        alternates: {
            canonical: `https://booking.geargrowcycle.com/services/${params.city}/${params.service}`,
        },
    };
}

export default async function DynamicServicesPage({ params }: Props) {
    let initialServices: Service[] = [];
    let cityId: number | null = null; 
    
    try {
        const contactRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/getContactDetails`, { next: { revalidate: 3600 } });
        const contactJson = await contactRes.json();
        if (contactJson?.data?.cities) {
            const matchedCity = contactJson.data.cities.find((c: any) => slugify(c.name) === params.city);
            if (matchedCity) {
                cityId = matchedCity.id;
            } else if (contactJson.data.cities.length > 0) {
                // If url slug doesn't match, fallback to the first available city dynamically
                cityId = contactJson.data.cities[0].id;
            }
        }
    } catch (err) {
        console.error('Failed to fetch cities for dynamic mapping:', err);
    }

    if (cityId !== null) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/getServices?city=${cityId}`, { next: { revalidate: 3600 } });
            const json = await res.json();
            if (json && json.data) {
                initialServices = json.data;
            }
        } catch (error) {
            console.error('Failed to fetch initial services for SSR:', error);
        }
    }

    return (
        <Suspense
            fallback={
                <div className='min-h-screen bg-[#060608] text-white flex justify-center items-center'>
                    Loading services...
                </div>
            }
        >
            <ServicesClient 
                initialServices={initialServices} 
                citySlug={params.city} 
                serviceSlug={params.service} 
            />
        </Suspense>
    );
}
