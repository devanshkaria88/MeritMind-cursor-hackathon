import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MeritMind — Voice Mood Journal',
  description:
    'Talk about your day. We\'ll remember the good stuff. A voice-first mood journal for Own Merit residents.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d9488',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-stone-50 text-stone-800 selection:bg-teal-200 selection:text-teal-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:bg-teal-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl"
        >
          Skip to main content
        </a>
        <div className="w-full min-h-screen" id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
