import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GoTrack — Shipment Journey Control Tower',
  description: 'Enterprise logistics journey tracking and control tower',
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
