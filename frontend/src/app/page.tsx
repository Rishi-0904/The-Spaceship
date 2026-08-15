'use client';

import dynamic from 'next/dynamic';

// Dynamic import of client-side portfolio app to avoid SSR issues with Zustand / canvas
const PortfolioApp = dynamic(() => import('@/components/PortfolioApp'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#030712', fontFamily: 'Orbitron, monospace', color: '#00d4ff', fontSize: '0.8rem',
      letterSpacing: '0.2em'
    }}>
      INITIALIZING RISHI-01…
    </div>
  ),
});

export default function HomePage() {
  return <PortfolioApp />;
}
