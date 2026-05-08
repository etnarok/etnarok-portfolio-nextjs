export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio/', // Yönetim panelini Google'a kapatıyoruz
    },
    sitemap: 'https://etnarok.dev/sitemap.xml',
  }
}