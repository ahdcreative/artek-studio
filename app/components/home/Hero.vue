<script setup lang="ts">
import {
  DEFAULT_CURSEFORGE_URL,
  DEFAULT_PATREON_URL,
  getStudioDownloadsLabel,
  useStudioProjects,
  useStudioSettings
} from '~/composables/useStudioData';
import { buildReferralUrl, EXTERNAL_LINK_REL } from '~/utils/referral';

const { lang, t } = useLocale();
const { data: settings } = useStudioSettings();
const { data: projects } = useStudioProjects();

const patreonUrl = computed(() =>
    buildReferralUrl(
        settings.value?.patreon_url || DEFAULT_PATREON_URL,
        'hero_cta',
        'patreon'
    )
);

const curseforgeUrl = computed(() =>
    buildReferralUrl(
        settings.value?.curseforge_url || DEFAULT_CURSEFORGE_URL,
        'hero_cta',
        'curseforge'
    )
);

const downloadsLabel = computed(() => getStudioDownloadsLabel(settings.value));

const stats = computed(() => {
  const list = projects.value ?? [];
  return {
    released: list.filter((p) => p.status === 3).length,
    upcoming: list.filter((p) => p.status === 2 || p.status === 1).length
  };
});
</script>

<template>
  <section class="relative overflow-hidden border-b border-clinical-border/80">
    <div class="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:space-y-7 lg:px-8 lg:py-8">
      <!-- Panoramic 4:1 Hero Banner -->
      <div
          class="overflow-hidden rounded-2xl border border-cyan-500/25 bg-clinical-canvas shadow-[0_24px_70px_rgba(8,145,178,0.18)] sm:rounded-3xl"
      >
        <div
            class="relative aspect-[21/9] w-full overflow-hidden bg-clinical-canvas sm:aspect-4/1"
        >
          <img
              v-if="settings?.hero_banner_url"
              :src="settings.hero_banner_url"
              :alt="t('Artek Medical Studio Banner', 'Banner Studio Artek Medical')"
              class="h-full w-full object-cover object-center"
          />
          <div
              v-else
              class="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-clinical-elevated to-clinical-canvas px-4 text-center"
          >
            <ArtekIcons name="HospitalOutline" size="xl" color="cyan" class="opacity-50" />
            <span class="font-mono text-xs uppercase tracking-wider text-slate-400">
              {{ settings?.brand_name ?? 'Artek Medical' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Content + Creator/KPI Column -->
      <div class="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        <!-- Left: Value Prop & Primary CTAs -->
        <div class="space-y-4 lg:col-span-7">
          <div
              class="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300"
          >
            <ArtekIcons name="HeartCardiogramFilled" size="sm" color="cyan" />
            <span>{{
                t(
                    'inZOI Healthcare & Clinical Modding Studio',
                    'Studio di Modding Sanitario e Clinico per inZOI'
                )
              }}</span>
          </div>

          <div class="space-y-2.5">
            <h1
                class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
            >
              {{ settings?.brand_name ?? 'Artek Medical' }}
            </h1>
            <p class="text-base font-medium text-cyan-200/90 sm:text-lg">
              {{
                lang === 'it'
                    ? settings?.tagline_it ||
                    'Abbigliamento Sanitario Autentico e Cliniche Giocabili per inZOI'
                    : settings?.tagline_en ||
                    'Authentic Medical Gear & Playable Clinics for inZOI — Built by a Practicing Hospital Doctor'
              }}
            </p>
            <p class="max-w-2xl text-sm leading-relaxed text-slate-300">
              {{
                lang === 'it'
                    ? settings?.bio_it ||
                    'Calzature Calzuro e Scholl, scrub, camici e strumenti clinici calibrati in scala 1:1 tra un turno in reparto e l’altro — sempre gratuiti su CurseForge.'
                    : settings?.bio_en ||
                    'Anatomical Calzuro & Scholl clogs, scrubs, lab coats, and playable clinical instruments calibrated 1:1 between hospital ward shifts — always free on CurseForge.'
              }}
            </p>
          </div>

          <!-- Primary Actions (Mobile-First stack) -->
          <div class="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
            <NuxtLink
                to="/catalog"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-clinical-teal px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_28px_rgba(8,145,178,0.4)] transition hover:bg-cyan-500"
            >
              <ArtekIcons name="StethoscopeOutline" size="sm" color="white" />
              <span>{{ t('Explore Free Mods', 'Esplora le Mod Gratis') }}</span>
            </NuxtLink>

            <a
                :href="patreonUrl"
                target="_blank"
                :rel="EXTERNAL_LINK_REL"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/15 px-5 py-2.5 text-sm font-bold text-rose-100 transition hover:bg-rose-500/25"
            >
              <span>{{ t('Follow FREE on Patreon ↗', 'Segui GRATIS su Patreon ↗') }}</span>
            </a>

            <a
                :href="curseforgeUrl"
                target="_blank"
                :rel="EXTERNAL_LINK_REL"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/35 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20"
            >
              <span>{{ t('CurseForge Catalog ↗', 'Catalogo CurseForge ↗') }}</span>
            </a>
          </div>
        </div>

        <!-- Right: Creator Card + 2x2 Social Proof KPIs -->
        <div class="space-y-3.5 lg:col-span-5">
          <div
              class="flex items-center gap-4 rounded-2xl border border-clinical-border bg-clinical-surface/90 p-4"
          >
            <img
                v-if="settings?.avatar_url"
                :src="settings.avatar_url"
                alt="Artek Medical Logo"
                class="h-14 w-14 shrink-0 rounded-2xl border border-cyan-500/40 bg-clinical-canvas object-cover"
            />
            <div
                v-else
                class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300"
            >
              <ArtekIcons name="DoctorOutline" size="lg" color="cyan" />
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="truncate text-sm font-bold text-white">Luca (Artek)</span>
                <span
                    class="rounded-md bg-cyan-500/15 px-2 py-0.5 text-[11px] font-semibold text-cyan-300"
                >
                  MD • 3D Modder
                </span>
              </div>
              <p class="mt-0.5 text-xs leading-relaxed text-slate-400">
                {{
                  t(
                      'Practicing hospital doctor crafting 1:1 clinical gear, zero-clipping outfits, and playable clinics for inZOI.',
                      'Medico ospedaliero in corsia: attrezzature cliniche in scala 1:1, divise senza clipping e cliniche giocabili per inZOI.'
                  )
                }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3">
              <div class="font-mono text-2xl font-extrabold text-amber-200">
                {{ downloadsLabel }}
              </div>
              <div class="text-xs text-amber-100/80">
                {{ t('CurseForge Downloads', 'Download CurseForge') }}
              </div>
            </div>
            <div class="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3">
              <div class="font-mono text-2xl font-extrabold text-emerald-300">
                {{ stats.released }}
              </div>
              <div class="text-xs text-emerald-200/80">
                {{ t('Free Mods Live', 'Mod Gratis Online') }}
              </div>
            </div>
            <div class="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-3">
              <div class="font-mono text-2xl font-extrabold text-cyan-300">
                {{ stats.upcoming }}
              </div>
              <div class="text-xs text-cyan-200/80">
                {{ t('Upcoming Gear & Clinic', 'In Sviluppo') }}
              </div>
            </div>
            <div class="rounded-2xl border border-clinical-border bg-clinical-surface/80 p-3">
              <div class="font-mono text-2xl font-extrabold text-white">100%</div>
              <div class="text-xs text-slate-400">
                {{ t('Zero Permanent Paywalls', 'Zero Paywall Permanenti') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>