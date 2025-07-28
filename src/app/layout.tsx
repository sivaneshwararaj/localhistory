import './globals.css';
import type { Metadata } from 'next';

// Add viewport and manifest to metadata
export const metadata: Metadata = {
  title: 'My Local Diary (PWA)',
  description: 'A private, local-first diary application.',
  manifest: '/manifest.json', // Link to the manifest file
  viewport: 'width=device-width, initial-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}