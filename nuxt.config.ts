// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from 'nuxt/schema';
// Auto import Naive UI components only
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  ssr: false,
  devtools: { enabled: true },
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/scss/main.scss',
  ],
  vue: {
    propsDestructure: true,
  },
  srcDir: 'src/',
  compatibilityDate: '2025-07-15',
  vite: {
    // register the Components plugin so only naive-ui components are auto-imported
    plugins: [
      Components({
        dts: true,
        resolvers: [NaiveUiResolver()],
      }),
    ],
    vue: {
      customElement: true,
    },
    vueJsx: {
      mergeProps: true,
    },
  },
  hooks: {
    'pages:extend'(pages) {
      // remove routes
      function removePagesMatching(pattern: RegExp, pages: NuxtPage[] = []) {
        const pagesToRemove: NuxtPage[] = [];
        for (const page of pages) {
          if (page.file && pattern.test(page.file)) {
            pagesToRemove.push(page);
          }
          else {
            removePagesMatching(pattern, page.children);
          }
        }
        for (const page of pagesToRemove) {
          pages.splice(pages.indexOf(page), 1);
        }
      }
      removePagesMatching(/\.{ts,tsx,js,jsx}$/, pages);
      removePagesMatching(/_subs/, pages);
    },
  },
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: true,
        quotes: 'single',
      },
    },
  },
});
