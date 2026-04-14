# arjun.md

Personal site built with:

- **Framework**: [Next.js](https://nextjs.org)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com) via [OpenNext](https://opennext.js.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Content**: MDX
- **Subscriptions**: [Notion](https://notion.so)

## Running Locally

```bash
pnpm install
pnpm dev
```

## Preview (Cloudflare runtime)

```bash
pnpm preview
```

## Deploy

```bash
pnpm deploy
```

## Environment Variables

Create a `.env.local` file:

```
NOTION_API_KEY=...
NOTION_DATABASE_ID=...
```

For production, set these as Worker secrets:

```bash
wrangler secret put NOTION_API_KEY
wrangler secret put NOTION_DATABASE_ID
```
