// BURADA SAKIN 'use client' OLMAYACAK!
import Studio from './Studio';

// Metadata ve Viewport sunucu tarafında güvenle dışa aktarılabilir
export { metadata, viewport } from 'next-sanity/studio';

export const dynamic = 'force-dynamic';

export default function StudioPage() {
  return <Studio />;
}