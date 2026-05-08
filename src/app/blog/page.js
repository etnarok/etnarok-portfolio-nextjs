// src/app/blog/page.js
import Link from 'next/link';
import { client } from '@/lib/sanity';

// Sanity'den yazıları çeken fonksiyon
async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    excerpt
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '50px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', marginBottom: '30px', display: 'inline-block' }}>
          ← Portfolyoya Dön
        </Link>
        <h1 style={{ fontSize: '42px', marginBottom: '40px' }}>Blog Yazılarım</h1>
        
        <div style={{ display: 'grid', gap: '30px' }}>
          {posts.map((post) => (
            <div key={post.slug} style={{ padding: '25px', backgroundColor: '#1e293b', borderRadius: '15px', border: '1px solid #334155' }}>
              <h2 style={{ margin: '0 0 10px 0' }}>{post.title}</h2>
              <p style={{ color: '#94a3b8', fontSize: '16px' }}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none' }}>
                Devamını Oku →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}