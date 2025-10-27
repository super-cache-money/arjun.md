import './globals.css';
import type { Metadata } from 'next';
import { Source_Serif_4 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Subscribe from '../components/Subscribe';
import PageFooterContent from '../components/PageFooterContent';

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
      <body className="antialiased tracking-tight">
        <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8 dark:bg-zinc-950 bg-white text-gray-900 dark:text-zinc-200">
          <Header />
          <main className="max-w-[90ch] mx-auto w-full space-y-6">
            {children}
          </main>
          <Footer />
          <Analytics />
        </div>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="max-w-[90ch] mx-auto w-full mt-4 md:mt-0 md:mb-0 md:fixed md:top-8 md:left-8 md:max-w-none md:w-auto">
      <a
        href="/"
        className="inline-block text-sm text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
      >
        arjun.md
      </a>
    </header>
  );
}

function Footer() {
  const links = [
    { name: 'github', url: 'https://github.com/supercachemoney' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/arjunkhoosal' },
  ];

  return (
    <footer className="mt-12 max-w-[90ch] mx-auto w-full">
      <Subscribe />
      <div className="pt-4 ">
        <div className="flex justify-between items-center tracking-tight">
          <div className="flex space-x-4">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>
          <PageFooterContent />
        </div>
      </div>
    </footer>
  );
}
