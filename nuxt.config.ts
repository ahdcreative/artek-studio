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

  runtimeConfig: {
    supabaseStorageBucket: 'preview',
    patreonClientId: '',
    patreonClientSecret: '',
    patreonAccessToken: '',
    patreonRefreshToken: '',
    patreonCampaignId: '',
    adminEmail: ''
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@criven/cricons',
        '@ahdcreative/cookie-banner',
        '@ahdcreative/gtm-vue'
      ]
    }
  },

  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY,
    secretKey:
        process.env.NUXT_SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY,
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
    provider: isProduction ? 'cloudflare' : undefined,
    cloudflare: {
      baseURL: 'https://art3k.org'
    },
    format: ['webp', 'avif'],
    domains: ['ocdecyadzyawkreibjxn.supabase.co']
  }
});