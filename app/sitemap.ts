import { promises as fs } from 'fs';
import path from 'path';

const SITE_URL = 'https://arjun.md';

async function getNoteSlugs(dir: string) {
  const entries = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true
  });
  return entries
    .filter((entry) => entry.isFile() && entry.name === 'page.mdx')
    .map((entry) => {
      const relativePath = path.relative(
        dir,
        path.join(entry.parentPath, entry.name)
      );
      return path.dirname(relativePath);
    })
    .map((slug) => slug.replace(/\\/g, '/'));
}

export default async function sitemap() {
  const pagesDirectory = path.join(process.cwd(), 'app');
  const slugs = await getNoteSlugs(pagesDirectory);

  const pages = slugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date().toISOString()
  }));

  const routes = [''].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString()
  }));

  const cleanedPages = pages.filter((page) => page.url !== `${SITE_URL}/.`);
  return [...cleanedPages, ...routes];
}
