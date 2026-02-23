import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://your-portfolio-domain.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // 이후 프로젝트나 상세 페이지 추가 시 동적으로 매핑할 수 있습니다.
  ];
}
