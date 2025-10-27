'use client';

import { usePathname } from 'next/navigation';

export default function FooterLinks() {
  const pathname = usePathname();

  const allLinks = [
    { name: 'about me', url: '/', external: false },
    { name: 'github', url: 'https://github.com/super-cache-money', external: true },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/arjunkhoosal', external: true },
    { name: 'source', url: 'https://github.com/super-cache-money/arjun.md', external: true },
  ];

  // Filter out "about me" on the home page
  const links = allLinks.filter(link => {
    if (link.name === 'about me' && pathname === '/') {
      return false;
    }
    return true;
  });

  return (
    <div className="flex space-x-4">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
          className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors duration-200"
        >
          {link.name}
        </a>
      ))}
    </div>
  );
}
