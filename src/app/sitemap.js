import { createClient } from 'next-sanity';

// Client'ı burada oluşturuyoruz, dışarıdan (lib/sanity vs.) çekmiyoruz 
// Çünkü o dosyaların içinde 'use client' olabilir.
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-05-08',
  useCdn: false,
});

export default async function sitemap() {
  const baseUrl = 'https://etnarok.dev';

  try {
    // Sadece gerekli alanları çekiyoruz
    const posts = await client.fetch(`*[_type == "post"] { "slug": slug.current, _updatedAt }`);

    const blogUrls = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post._updatedAt ? new Date(post._updatedAt) : new Date(),
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        priority: 0.8,
      },
      ...blogUrls,
    ];
  } catch (error) {
    // Hata olursa en azından anasayfayı döndür ki 500 vermesin
    console.error('Sitemap fetch error:', error);
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}