import './globals.css';
import type { Metadata } from 'next';

// The metadata object is still great for SEO and modern browsers
export const metadata: Metadata = {
  title: 'My Local Diary (PWA)',
  description: 'A private, local-first diary application.',
  manifest: '/manifest.json', // This is the Next.js 13 way
  viewport: 'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover',
  themeColor: '#ffffff', // Explicitly set theme color here as well
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/*
          This is the "failsafe" link. 
          Adding this directly ensures the browser always finds the manifest, 
          even if metadata processing has issues.
        */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  );
}