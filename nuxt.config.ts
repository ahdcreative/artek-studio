// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

const isProduction = process.env.NODE_ENV === 'production';
export default defineNuxtConfig({
  compatibilityDate: 'latest',
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/image'
  ],

  vite: {
    plugins: [
      tailwindcss()
    ],
    optimizeDeps: {
      include: [
        '@criven/cricons',
        '@ahdcreative/cookie-banner',
        '@ahdcreative/gtm-vue'
      ],
    },
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '',
      callback: '',
      exclude: ['/*']
    },
    cookieOptions: {
      secure: isProduction,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax'
    }
  },
  nitro: {
    preset: 'cloudflare-pages'
  },
  devtools: {
    enabled: true
  },

  image: {
    provider:isProduction ?'cloudflare' : undefined,
    cloudflare: {
      baseURL:'https://art3k.org'
    },
    format: ['webp', 'avif'],
    domains:['ocdecyadzyawkreibjxn.supabase.co']
  }
})
