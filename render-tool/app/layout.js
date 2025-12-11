import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'AI Interior Render Tool',
  description: 'Transform SketchUp exports into photorealistic renders.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={{
          borderBottom: '1px solid var(--border)',
          padding: '20px 0',
          background: 'var(--surface)'
        }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>
              AI Render<span style={{ color: 'var(--primary)' }}>Tool</span>
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/" style={{ color: 'var(--text-muted)' }}>Studio</Link>
              <Link href="/materials" style={{ color: 'var(--text-muted)' }}>Materials</Link>
            </div>
          </div>
        </nav>
        <main style={{ padding: '40px 0' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
