import { client } from '@/lib/sanity';
import Link from 'next/link';

export const revalidate = 60;

// Veriyi çeken fonksiyon (Seçili kategoriye göre filtreleme ekledik)
async function getData(selectedCategory) {
  const query = `{
    "posts": *[_type == "post"] | order(_createdAt desc) {
      title,
      slug,
      publishedAt,
      mainImage { asset-> { url } },
      author-> { name, image { asset-> { url } } },
      categories[]-> { title }
    },
    "categories": *[_type == "category"] {
      _id,
      title
    }
  }`;
  
  const data = await client.fetch(query);

  // Eğer bir kategori seçilmişse, yazıları filtrele
  if (selectedCategory) {
    data.posts = data.posts.filter(post => 
      post.categories?.some(cat => cat.title.toLowerCase() === selectedCategory.toLowerCase())
    );
  }

  return data;
}

export default async function BlogPage({ searchParams }) {
  // Next.js 15'te searchParams bir Promise'dir, o yüzden await ediyoruz
  const sParams = await searchParams;
  const currentCategory = sParams.category;
  
  const { posts, categories } = await getData(currentCategory);

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      height: '100vh', 
      overflowY: 'auto', 
      color: 'white', 
      padding: '40px 20px' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800' }}>
            {currentCategory ? `#${currentCategory}` : 'Blog'}
          </h1>
          <p style={{ color: '#94a3b8' }}>
            {currentCategory ? `${currentCategory} kategorisindeki yazılar listeleniyor.` : 'Teknoloji ve yazılım üzerine notlarım.'}
          </p>
        </header>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
          
          {/* SOL: BLOG LİSTESİ (%75) */}
          <div style={{ flex: '3', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {posts.length > 0 ? posts.map((post) => (
              <Link key={post.slug.current} href={`/blog/${post.slug.current}`} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  backgroundColor: '#1e293b', 
                  borderRadius: '20px', 
                  overflow: 'hidden', 
                  border: '1px solid #334155',
                  transition: '0.3s ease'
                }}>
                  {post.mainImage && (
                    <img src={post.mainImage.asset.url} alt={post.title} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '25px' }}>
                    <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '15px' }}>{post.title}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {post.author?.image && (
                        <img src={post.author.image.asset.url} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                      )}
                      <span style={{ color: '#94a3b8', fontSize: '14px' }}>{post.author?.name} • {new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#1e293b', borderRadius: '20px' }}>
                Bu kategoride henüz yazı bulunmuyor.
              </div>
            )}
          </div>

          {/* SAĞ: KATEGORİLER (%25) */}
          <aside style={{ flex: '1', minWidth: '250px' }}>
            <div style={{ 
              backgroundColor: '#1e293b', 
              padding: '25px', 
              borderRadius: '20px', 
              border: '1px solid #334155',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#3b82f6' }}>Kategoriler</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* Hepsi (Filtreyi Temizle) Butonu */}
                <Link href="/blog" style={{ 
                  color: !currentCategory ? '#3b82f6' : '#e2e8f0', 
                  textDecoration: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: !currentCategory ? '#0f172a' : 'transparent',
                  fontSize: '15px'
                }}>
                  ● Tüm Yazılar
                </Link>

                {categories.map((cat) => (
                  <Link 
                    key={cat._id} 
                    href={`/blog?category=${cat.title}`}
                    style={{ 
                      color: currentCategory === cat.title ? '#3b82f6' : '#e2e8f0', 
                      textDecoration: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: currentCategory === cat.title ? '#0f172a' : 'transparent',
                      fontSize: '15px',
                      transition: '0.2s'
                    }}
                  >
                    # {cat.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}