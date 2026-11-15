<script setup lang="ts">
const { lang, t } = useLocale();
const { data: settings } = useStudioSettings();
const { data: projects } = useStudioProjects();

const stats = computed(() => {
  const list = projects.value ?? [];
  return {
    total: list.length,
    released: list.filter((p) => p.status === 3).length,
    ready: list.filter((p) => p.status === 2).length,
    free: list.filter((p) => p.is_free).length
  };
});
</script>

<template>
  <section class="relative overflow-hidden border-b border-clinical-border/80">
    <div
      class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8 lg:py-20"
    >
      <div class="space-y-6 lg:col-span-7">
        <div
          class="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300"
        >
          <ArtekIcons name="HeartCardiogramFilled" size="sm" color="cyan" />
          <span>{{
            t(
              'inZOI Healthcare & Clinical Modding Studio',
              'Studio di Modding Sanitario e Clinico per inZOI'
            )
          }}</span>
        </div>

        <div class="space-y-3">
          <h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {{ settings?.brand_name ?? 'ArtekMedical Studio' }}
          </h1>
          <p class="text-lg font-medium text-cyan-200/90 sm:text-xl">
            {{
              lang === 'it'
                ? settings?.tagline_it || 'Realismo Medico e Clinico Autentico per inZOI'
                : settings?.tagline_en || 'Authentic Medical & Clinical Realism for inZOI'
            }}
          </p>
          <p class="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {{ lang === 'it' ? settings?.bio_it : settings?.bio_en }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 pt-1">
          <NuxtLink
            to="/catalog"
            class="inline-flex items-center gap-2 rounded-xl bg-clinical-teal px-5 py-3 text-sm font-bold text-white shadow-[0_0_28px_rgba(8,145,178,0.4)] transition hover:bg-cyan-500"
          >
            <ArtekIcons name="StethoscopeOutline" size="sm" color="white" />
            <span>{{ t('Explore Mod Catalog', 'Esplora Catalogo Mod') }}</span>
          </NuxtLink>

          <NuxtLink
            to="/news"
            class="inline-flex items-center gap-2 rounded-xl border border-clinical-border bg-clinical-surface px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-500/50 hover:text-cyan-200"
          >
            <ArtekIcons name="MedicalRecordsOutline" size="sm" color="cyan" />
            <span>{{ t('Studio News & Previews', 'News & Anteprime') }}</span>
          </NuxtLink>

          <a
            :href="settings?.patreon_url ?? 'https://www.patreon.com/darkart3k'"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-xl border border-rose-500/35 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
          >
            <span>{{ t('Support on Patreon', 'Supporta su Patreon') }}</span>
          </a>
        </div>

        <!-- KPI strip -->
        <div class="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
          <div class="rounded-2xl border border-clinical-border bg-clinical-surface/80 p-3.5">
            <div class="font-mono text-2xl font-extrabold text-white">{{ stats.total }}</div>
            <div class="text-xs text-slate-400">{{ t('Studio Projects', 'Progetti Totali') }}</div>
          </div>
          <div class="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3.5">
            <div class="font-mono text-2xl font-extrabold text-emerald-300">
              {{ stats.released }}
            </div>
            <div class="text-xs text-emerald-200/80">{{ t('Released Mods', 'Mod Rilasciate') }}</div>
          </div>
          <div class="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-3.5">
            <div class="font-mono text-2xl font-extrabold text-cyan-300">{{ stats.ready }}</div>
            <div class="text-xs text-cyan-200/80">{{ t('ModKit Ready', 'Pronte nel ModKit') }}</div>
          </div>
          <div class="rounded-2xl border border-clinical-border bg-clinical-surface/80 p-3.5">
            <div class="font-mono text-2xl font-extrabold text-white">{{ stats.free }}</div>
            <div class="text-xs text-slate-400">{{ t('Free Community', 'Mod Gratuite') }}</div>
          </div>
        </div>
      </div>

      <!-- Visual Banner Card -->
      <div class="lg:col-span-5">
        <div
          class="overflow-hidden rounded-3xl border border-cyan-500/25 bg-clinical-surface/90 shadow-[0_24px_70px_rgba(8,145,178,0.18)]"
        >
          <div class="relative aspect-16/10 w-full overflow-hidden bg-clinical-elevated">
            <img
              v-if="settings?.hero_banner_url"
              :src="settings.hero_banner_url"
              alt="ArtekMedical Clinic Props Banner"
              class="h-full w-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-clinical-surface via-transparent to-transparent"
            />
          </div>

          <div class="flex items-center gap-4 p-5">
            <img
              v-if="settings?.avatar_url"
              :src="settings.avatar_url"
              alt="Dr. Artek Avatar"
              class="h-14 w-14 rounded-2xl border border-cyan-500/40 object-cover"
            />
            <div
              v-else
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300"
            >
              <ArtekIcons name="DoctorOutline" size="lg" color="cyan" />
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="truncate text-sm font-bold text-white">Dr. Artek (Luca Forzutti)</span>
                <span
                  class="rounded-md bg-cyan-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300"
                >
                  MD • 3D
                </span>
              </div>
              <p class="mt-0.5 text-xs text-slate-400">
                {{
                  t(
                    'Calibrated 1:1 against real hospital equipment, PBR UE5 materials, zero clipping.',
                    'Calibrato in scala 1:1 su dispositivi ospedalieri reali, PBR UE5 e zero clipping.'
                  )
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
