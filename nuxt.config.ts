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

  site: {
    url: 'https://art3k.org',
    name: 'Artek Medical'
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      meta: [
        { name: 'theme-color', content: '#070f17' },
        { name: 'apple-mobile-web-app-title', content: 'Artek Medical' }
      ]
    }
  },

  robots: {
    disallow: ['/admin', '/admin/**', '/api/**']
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/admin', '/admin/**']
  },

  runtimeConfig: {
    supabaseStorageBucket: 'previews',
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