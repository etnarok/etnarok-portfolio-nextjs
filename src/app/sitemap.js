import { client } from '@/lib/sanity';

export default async function sitemap() {
  const baseUrl = 'https://etnarok.dev';

  // Sanity'den tüm blog yazılarını çekiyoruz
  const posts = await client.fetch(`*[_type == "post"] { "slug": slug.current, _updatedAt }`);

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post._updatedAt,
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    ...blogUrls,
  ];
}