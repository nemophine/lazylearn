import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Noto_Sans } from 'next/font/google';

import './globals.css';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'LazyLearn',
  description: 'Hi-Fi learning dashboard experience built with Next.js.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={notoSans.className}>{children}</body>
    </html>
  );
}
