// src/app/layout.js
export const metadata = {
  title: 'Emir Arslaner | 3D Portfolio',
  description: 'Emir Arslaner (Etnarok) - Full-Stack Web Developer 3D Portfolyosu. Isparta, Antalya ve tüm Türkiye için modern web site çözümleri.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      {/* suppressHydrationWarning ekleyerek eklentilerin sebep olduğu Hydration hatasını engelliyoruz */}
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#0f172a' }}>
        {children}
      </body>
    </html>
  );
}