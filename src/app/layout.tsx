import type { Metadata } from 'next';
import './globals.css';
import Provider from './provider';

export const metadata: Metadata = { title: 'Orbit — Your next everyday essential', description: 'Discover smartphones and tablets at Orbit.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Provider>{children}</Provider></body></html>;
}
