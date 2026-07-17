// src/app/layout.tsx
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Tree of Knowledge — Philosophie als lebendiges Universum',
  description:
    'Entdecke die Evolution des menschlichen Denkens als interaktiven Baum des Wissens. 2500 Jahre Philosophie visualisiert.',
  keywords: ['Philosophie', 'Wissensbaum', 'Interaktiv', 'Geschichte', 'Denker'],
  openGraph: {
    title: 'Tree of Knowledge',
    description: 'Philosophie als lebendiges Universum',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#060B08] text-[#F0E6D3] antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
