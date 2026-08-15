import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RISHI-01 | Rishi Raj Jaiswal — AI/ML Engineer & Full-Stack Developer',
  description:
    'Explore the RISHI-01 spacecraft — an interactive portfolio for Rishi Raj Jaiswal, AI/ML Engineer, Full-Stack Developer, and Computer Science student at MNNIT Allahabad specializing in Generative AI, Agentic AI, and LangGraph.',
  keywords: [
    'Rishi Raj Jaiswal', 'AI/ML Engineer', 'MNNIT Allahabad',
    'LangGraph', 'RAG', 'Generative AI', 'Full Stack Developer',
    'portfolio', 'spaceship', 'interactive',
  ],
  openGraph: {
    title: 'RISHI-01 | Rishi Raj Jaiswal',
    description: 'Welcome aboard RISHI-01 — an interactive spaceship portfolio.',
    type: 'website',
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
