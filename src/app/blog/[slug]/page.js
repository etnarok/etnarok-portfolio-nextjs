import { client } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import urlBuilder from '@sanity/image-url';

export const revalidate = 60;

// Sanity Resim URL Oluşturucu
const builder = urlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

// PortableText İçin Özel Bileşenler (Resimler burada işleniyor)
const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <div style={{ margin: '40px 0', textAlign: 'center' }}>
          <img
            src={urlFor(value).fit('max').auto('format').url()}
            alt={value.alt || 'Blog Görseli'}
            style={{
              maxWidth: '100%',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          />
          {value.caption && (
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '10px' }}>
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  // İstersen buraya linkler (marks), listeler vb. için de özel tasarım ekleyebilirsin
};

async function getPost(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    body,
    publishedAt,
    mainImage { asset-> { url } },
    author-> { name, image { asset-> { url } } },
    "excerpt": array::join(string::split(pt::text(body), "")[0..160], "")
  }`;
  return await client.fetch(query, { slug });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post ? `${post.title} | Etnarok` : 'Yazı Bulunamadı',
    description: post?.excerpt,
  };
}

export default async function PostDetail({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Yazı bulunamadı.</div>;

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      height: '100vh', 
      overflowY: 'auto', 
      color: 'white', 
      padding: '60px 20px' 
    }}>
      <article style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <Link href="/blog" style={{ color: '#3b82f6', textDecoration: 'none', marginBottom: '40px', display: 'inline-block' }}>
          ← Geri Dön
        </Link>

        {post.mainImage && (
          <img src={post.mainImage.asset.url} alt={post.title} style={{ width: '100%', borderRadius: '24px', marginBottom: '40px' }} />
        )}

        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', lineHeight: '1.1', marginBottom: '30px' }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '50px', padding: '20px', backgroundColor: '#1e293b', borderRadius: '16px' }}>
          {post.author?.image && (
            <img src={post.author.image.asset.url} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
          )}
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{post.author?.name}</div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</div>
          </div>
        </div>

        {/* DETAYLI İÇERİK ALANI (Body içindeki resimler dahil) */}
        <div style={{ 
          lineHeight: '1.9', 
          fontSize: '20px', 
          color: '#cbd5e1',
        }}>
          <PortableText value={post.body} components={ptComponents} />
        </div>

        <div style={{ height: '100px' }}></div>
      </article>
    </div>
  );
}