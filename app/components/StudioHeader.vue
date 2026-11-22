<script setup lang="ts">
import {DEFAULT_PATREON_URL} from "~/composables/useStudioData.ts";

const { lang, toggleLang, t } = useLocale();
const { data: settings } = useStudioSettings();
const user = useSupabaseUser();
const route = useRoute();
const mobileOpen = ref(false);

const patreonUrl = computed(() => settings.value?.patreon_url || DEFAULT_PATREON_URL);
const brandName = computed(() => settings.value?.brand_name || 'Artek Medical');

const navItems = computed(() => {
  const base = [
    { to: '/', label: t('Studio', 'Studio') },
    { to: '/catalog', label: t('Mod Catalog', 'Catalogo Mod') },
    { to: '/news', label: t('News', 'News') },
    { to: '/roadmap', label: t('Roadmap', 'Roadmap') }
  ];
  if (user.value) {
    base.push({ to: '/admin', label: 'Admin' });
  }
  return base;
});

watch(
    () => route.fullPath,
    () => {
      mobileOpen.value = false;
    }
);
</script>

<template>
  <header
      class="sticky top-0 z-40 border-b border-clinical-border/80 bg-clinical-canvas/85 backdrop-blur-xl"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Brand -->
      <NuxtLink to="/" class="group flex items-center gap-3">
        <div
            class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-500/35 bg-clinical-surface shadow-[0_0_20px_rgba(8,145,178,0.2)] transition group-hover:border-cyan-400/70"
        >
          <img
              v-if="settings?.avatar_url"
              :src="settings.avatar_url"
              :alt="brandName"
              class="h-full w-full object-cover"
          />
          <ArtekIcons v-else name="HeartCardiogramOutline" size="lg" color="cyan" />
        </div>
        <div class="leading-tight">
          <div class="flex items-center gap-1.5 text-base font-bold tracking-tight text-white">
            <span>{{ brandName }}</span>
            <span
                class="hidden rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300 sm:inline-block"
            >
              art3k.org
            </span>
          </div>
          <p class="text-[11px] text-slate-400">
            {{ t('inZOI Healthcare Modding Studio', 'Studio Modding Sanitario per inZOI') }}
          </p>
        </div>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-xl px-3.5 py-2 text-sm font-medium transition"
            :class="
            route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to))
              ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          "
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2.5">
        <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-clinical-border bg-clinical-surface px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-200"
            :aria-label="t('Switch language', 'Cambia lingua')"
            @click="toggleLang"
        >
          <ArtekIcons name="GlobeOutline" size="sm" color="cyan" />
          <span>{{ lang === 'en' ? 'EN' : 'IT' }}</span>
        </button>

        <a
            :href="patreonUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden items-center gap-2 rounded-xl bg-clinical-teal px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(8,145,178,0.35)] transition hover:bg-cyan-500 sm:inline-flex"
        >
          <ArtekIcons name="StethoscopeOutline" size="sm" color="white" />
          <span>{{ t('Follow Free on Patreon', 'Segui Gratis su Patreon') }}</span>
        </a>

        <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-clinical-border bg-clinical-surface text-slate-200 md:hidden"
            aria-label="Menu"
            @click="mobileOpen = !mobileOpen"
        >
          <ArtekIcons name="UiMenuOutline" size="md" color="white" />
        </button>
      </div>
    </div>

    <!-- Mobile Nav -->
    <div
        v-if="mobileOpen"
        class="border-t border-clinical-border bg-clinical-surface/95 px-4 py-3 md:hidden"
    >
      <div class="flex flex-col gap-1">
        <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300"
        >
          <ArtekIcons v-if="item.to === '/'" name="HospitalOutline" size="sm" color="cyan" />
          <ArtekIcons v-else name="MedicalRecordsOutline" size="sm" color="cyan" />
          <span>{{ item.label }}</span>
        </NuxtLink>
        <a
            :href="patreonUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-clinical-teal px-3.5 py-2.5 text-xs font-semibold text-white"
        >
          <ArtekIcons name="StethoscopeOutline" size="sm" color="white" />
          <span>{{ t('Follow Free on Patreon', 'Segui Gratis su Patreon') }}</span>
        </a>
      </div>
    </div>
  </header>
</template>