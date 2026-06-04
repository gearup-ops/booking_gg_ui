import { MetadataRoute } from 'next';
import { slugify } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://booking.geargrowcycle.com';

    const routes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/for-business`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    try {
        const contactRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/getContactDetails`, { next: { revalidate: 3600 } });
        const contactJson = await contactRes.json();
        const cities = contactJson?.data?.cities || [];

        for (const city of cities) {
            const citySlug = slugify(city.name);
            
            // Add city landing page
            routes.push({
                url: `${baseUrl}/services/${citySlug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });

            try {
                // Fetch services for this city
                const serviceRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/getServices?city=${city.id}`, { next: { revalidate: 3600 } });
                const serviceJson = await serviceRes.json();
                const services = serviceJson?.data || [];

                for (const service of services) {
                    if (service.isActive) {
                        const serviceSlug = slugify(service.serviceName);
                        routes.push({
                            url: `${baseUrl}/services/${citySlug}/${serviceSlug}`,
                            lastModified: new Date(),
                            changeFrequency: 'weekly',
                            priority: 0.9, // High priority for specific service pages
                        });
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch services for sitemap city ${city.name}:`, error);
            }
        }
    } catch (error) {
        console.error('Failed to generate dynamic sitemap routes:', error);
    }

    return routes;
}
