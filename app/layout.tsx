import './globals.css';
import type { Metadata } from 'next';
import { Source_Serif_4 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import Subscribe from '../components/Subscribe';
import PageFooterContent from '../components/PageFooterContent';
import FooterLinks from '../components/FooterLinks';
import { Amplitude } from '@/lib/amplitude';


const sourceSerif = Source_Serif_4({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://next-mdx-blog.vercel.app'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Arjun Khoosal',
    template: '%s | Arjun Khoosal'
  },
  description: 'My portfolio, blog, and personal website.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSerif.className}`}>
      <Amplitude />
      <body className="antialiased tracking-tight">
        <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8 dark:bg-zinc-950 bg-white text-gray-900 dark:text-zinc-200">
          <Header />
          <main className="max-w-[650px] mx-auto w-full space-y-6">
            {children}
          </main>
          <Footer />
          <Analytics />
        </div>
      </body>
      <GoogleAnalytics gaId="G-RETJ8CVBN5" />
    </html>
  );
}

function Header() {
  return (
    <header className="max-w-[650px] mx-auto w-full mt-4 md:mt-0 md:mb-0 md:fixed md:top-8 md:left-8 md:max-w-none md:w-auto">
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-12 max-w-[650px] mx-auto w-full">
      <Subscribe />
      <div className="pt-4 ">
        <div className="flex justify-between items-center tracking-tight">
          <FooterLinks />
          <PageFooterContent />
        </div>
      </div>
    </footer>
  );
}
