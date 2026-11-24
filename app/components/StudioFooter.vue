<script setup lang="ts">
import {
  DEFAULT_CURSEFORGE_URL,
  DEFAULT_PATREON_URL,
  useStudioSettings
} from '~/composables/useStudioData';
import { buildReferralUrl, EXTERNAL_LINK_REL } from '~/utils/referral';

const { t } = useLocale();
const { data: settings } = useStudioSettings();
const user = useSupabaseUser();

const brandName = computed(() => settings.value?.brand_name || 'Artek Medical');
const patreonUrl = computed(() =>
    buildReferralUrl(
        settings.value?.patreon_url || DEFAULT_PATREON_URL,
        'footer_link',
        'patreon'
    )
);
const curseforgeUrl = computed(() =>
    buildReferralUrl(
        settings.value?.curseforge_url || DEFAULT_CURSEFORGE_URL,
        'footer_link',
        'curseforge'
    )
);
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-clinical-border/80 bg-clinical-surface/70">
    <div class="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <!-- Top Row: Studio Brand + Navigation & Platform Links -->
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div class="space-y-2">
          <div class="flex items-center gap-2.5 text-sm font-bold text-white">
            <img
                v-if="settings?.avatar_url"
                :src="settings.avatar_url"
                :alt="brandName"
                class="h-7 w-7 rounded-lg border border-cyan-500/35 bg-clinical-canvas object-cover"
            />
            <ArtekIcons v-else name="HeartCardiogramOutline" size="md" color="cyan" />
            <span>{{ brandName }}</span>
            <span class="font-mono text-xs text-slate-500">• art3k.org</span>
          </div>

          <p class="max-w-xl text-xs leading-relaxed text-slate-400">
            {{
              t(
                  'Custom medical apparel, clinical footwear, and 1:1 hospital props for inZOI — designed and playtested between hospital shifts.',
                  'Divise sanitarie, calzature ospedaliere e strumenti clinici in scala 1:1 per inZOI — progettati e testati tra un turno e l’altro.'
              )
            }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300 sm:gap-4">
          <NuxtLink to="/catalog" class="transition hover:text-cyan-300">
            {{ t('Catalog', 'Catalogo') }}
          </NuxtLink>
          <NuxtLink to="/news" class="transition hover:text-cyan-300">
            {{ t('News', 'News') }}
          </NuxtLink>
          <NuxtLink to="/roadmap" class="transition hover:text-cyan-300">
            {{ t('Roadmap', 'Roadmap') }}
          </NuxtLink>
          <NuxtLink v-if="user" to="/admin" class="text-slate-400 transition hover:text-cyan-300">
            Admin
          </NuxtLink>

          <a
              :href="curseforgeUrl"
              target="_blank"
              :rel="EXTERNAL_LINK_REL"
              class="rounded-lg border border-amber-400/35 bg-amber-500/10 px-3 py-1.5 font-semibold text-amber-200 transition hover:bg-amber-500/20"
          >
            CurseForge ↗
          </a>
          <a
              :href="patreonUrl"
              target="_blank"
              :rel="EXTERNAL_LINK_REL"
              class="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
          >
            Patreon ↗
          </a>
        </div>
      </div>

      <!-- Bottom Row: Legal / Credits + AHD.Creative Signature -->
      <div
          class="flex flex-col items-start justify-between gap-4 border-t border-clinical-border/60 pt-6 sm:flex-row sm:items-center"
      >
        <p class="text-[11px] text-slate-500">
          © {{ currentYear }} {{ brandName }} —
          {{
            t(
                'Independent inZOI modding studio. Not affiliated with KRAFTON.',
                'Studio indipendente di modding per inZOI. Non affiliato a KRAFTON.'
            )
          }}
        </p>

        <div class="flex flex-col items-start gap-1.5 sm:items-end">
          <span class="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            {{ t('Engineered by', 'Sviluppato da') }}
          </span>
          <AHDLogo />
        </div>
      </div>
    </div>
  </footer>
</template>