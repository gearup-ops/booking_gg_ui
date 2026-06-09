import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/account/', '/track-booking/'],
            },
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'OAI-SearchBot'],
                allow: '/',
            }
        ],
        sitemap: 'https://booking.geargrowcycle.com/sitemap.xml',
    };
}
