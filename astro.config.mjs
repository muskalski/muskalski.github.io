import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://muskalski.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: { build: { sourcemap: false } },
});
