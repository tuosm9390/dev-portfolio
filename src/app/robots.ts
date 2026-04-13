import { MetadataRoute } from 'next';
import { profile } from '@/data/profile';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      // AI crawlers — explicitly allowed for GEO (Generative Engine Optimization)
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'cohere-ai',
          'Applebot-Extended',
        ],
        allow: '/',
      },
    ],
    sitemap: `${profile.siteUrl}/sitemap.xml`,
  };
}
