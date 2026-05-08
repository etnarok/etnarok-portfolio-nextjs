// src/app/blog/[slug]/page.js
import { client } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';

// Sanity'den tekil yazıyı getiren yardımcı fonksiyon
async function getPost(slug) {
  const query = `*[_type == "post" && slug.current == "${slug}"][0] {
    title,
    body,
    publishedAt,
    "excerpt": array::join(string::split(pt::text(body), "")[0..160], "")
  }`;
  const data = await client.fetch(query);
  return data;
}

// --- PROFESYONEL SEO MOTORU ---
// Bu fonksiyon her yazı için tarayıcı sekme adını ve Google açıklamasını otomatik oluşturur
export async function generateMetadata({ params }) {
  const resolvedParams = await params; // Next.js 15 için await şart
  const post = await getPost(resolvedParams.slug);
  
  return {
    title: post ? `${post.title} | Etnarok Blog` : 'Yazı Bulunamadı | Etnarok',
    description: post?.excerpt || "Emir Arslaner (Etnarok) Yazılım ve Teknoloji Blogu - Modern Web Çözümleri",
    // Sosyal medyada paylaşıldığında görünecek ayarlar (Opsiyonel ama iyidir)
    openGraph: {
      title: post?.title,
      description: post?.excerpt,
      type: 'article',
    },
  };
}

// --- SAYFA İÇERİĞİ ---
export default async function PostDetail({ params }) {
  const resolvedParams = await params; // Next.js 15 için await şart
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Yazı bulunamadı veya henüz yayınlanmadı.</h2>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '50px 20px' }}>
      <article style={{ maxWidth: '750px', margin: '0 auto' }}>
        
        {/* Navigasyon */}
        <Link href="/blog" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>←</span> Tüm Yazılara Dön
        </Link>

        {/* Başlık ve Tarih */}
        <header style={{ marginTop: '40px', borderBottom: '1px solid #334155', paddingBottom: '30px', marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: '1.2', margin: '0 0 20px 0', fontWeight: '800' }}>
            {post.title}
          </h1>
          <div style={{ color: '#94a3b8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#3b82f6', width: '8px', height: '8px', borderRadius: '50%' }}></span>
            {new Date(post.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} tarihinde yayınlandı
          </div>
        </header>
        
        {/* Blog İçerik Alanı */}
        <div style={{ 
          lineHeight: '1.8', 
          fontSize: '19px', 
          color: '#e2e8f0',
          letterSpacing: '0.3px'
        }}>
          <PortableText value={post.body} />
        </div>

        {/* Alt Bilgi */}
        <footer style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid #334155', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>
            Isparta ve Antalya başta olmak üzere, profesyonel web çözümleri için benimle iletişime geçebilirsiniz.
          </p>
        </footer>

      </article>
    </div>
  );
}