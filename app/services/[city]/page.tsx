import { redirect } from 'next/navigation';
import { slugify } from '@/lib/utils';

export default async function CityServicesPage({ params }: { params: { city: string } }) {
    let cityId: number | null = null;
    
    // First, resolve the citySlug to a cityId dynamically
    try {
        const contactRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/getContactDetails`, { next: { revalidate: 3600 } });
        const contactJson = await contactRes.json();
        if (contactJson?.data?.cities) {
            const matchedCity = contactJson.data.cities.find((c: any) => slugify(c.name) === params.city);
            if (matchedCity) {
                cityId = matchedCity.id;
            } else if (contactJson.data.cities.length > 0) {
                // Fallback to first available city if the slug is invalid
                cityId = contactJson.data.cities[0].id;
            }
        }
    } catch (err) {
        console.error('Failed to fetch cities for dynamic mapping:', err);
    }

    let redirectUrl: string | null = null;

    // Then fetch the services for this city
    if (cityId !== null) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/getServices?city=${cityId}`, { next: { revalidate: 3600 } });
            const json = await res.json();
            
            // Redirect to the first available service dynamically
            if (json && json.data && json.data.length > 0) {
                // Ensure they are sorted by orderNo like in the client
                const sortedServices = [...json.data].sort((a: any, b: any) => a.orderNo - b.orderNo);
                const firstServiceSlug = slugify(sortedServices[0].serviceName);
                redirectUrl = `/services/${params.city}/${firstServiceSlug}`;
            }
        } catch (error) {
            console.error('Failed to fetch initial services for redirect:', error);
        }
    }

    if (redirectUrl) {
        redirect(redirectUrl);
    }
    
    return (
        <div className='min-h-screen bg-[#060608] text-white flex justify-center items-center'>
            <p className='text-xl text-[#fbbf24]'>No services available for this city.</p>
        </div>
    );
}
