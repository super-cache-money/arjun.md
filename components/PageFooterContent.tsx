'use client';

import { usePathname } from 'next/navigation';
import { footerContent } from '../lib/footerContent';

export default function PageFooterContent() {
  const pathname = usePathname();
  const content = footerContent[pathname];

  if (!content) return null;

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      {content}
    </div>
  );
}
