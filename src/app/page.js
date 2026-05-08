// src/app/page.js
'use client'; // Bunun bir istemci bileşeni olduğunu belirtiyoruz

import dynamic from 'next/dynamic';

// Efsane taktik: Portfolyo bileşenimizi SSR (Server-Side Rendering) kapalı olarak içeri aktarıyoruz.
// Böylece Three.js "window is not defined" hatası vermez.
const Portfolio3D = dynamic(() => import('../components/Portfolio'), { 
  ssr: false,
  // 3D yüklenene kadar ekranda siyah bir arkaplan gösterebiliriz (Preloader zaten kendi içinde var)
  loading: () => <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0f172a' }}></div>
});

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Portfolio3D />
    </main>
  );
}