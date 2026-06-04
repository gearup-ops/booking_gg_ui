import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/account/', '/track-booking/'],
        },
        sitemap: 'https://booking.geargrowcycle.com/sitemap.xml',
    };
}
