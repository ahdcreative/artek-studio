<script setup lang="ts">
import {DEFAULT_PATREON_URL} from "~/composables/useStudioData.ts";

const { t } = useLocale();
const { data: settings } = useStudioSettings();

const patreonUrl = computed(() => settings.value?.patreon_url || DEFAULT_PATREON_URL);
</script>

<template>
  <aside
      class="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-clinical-surface/90 to-clinical-canvas p-5"
  >
    <div class="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-300">
      <ArtekIcons name="HospitalOutline" size="sm" color="cyan" />
      <span>{{ t('Flagship Project • Coming Soon', 'Progetto di Punta • In Arrivo') }}</span>
    </div>

    <h3 class="mt-2 text-base font-extrabold text-white">
      {{ t('The Playable Artek Medical Clinic for inZOI', 'La Clinica Medica Giocabile per inZOI') }}
    </h3>

    <p class="mt-1.5 text-xs leading-relaxed text-slate-300">
      {{
        t(
            'Includes a 1-Click Business Uniform Manager (works with ANY owned business in inZOI) and a real working Seca 700 Scale that actually measures your Zoi’s weight, height & BMI — not random numbers.',
            'Include un Business Uniform Manager a 1 clic (funziona su QUALSIASI attività in inZOI) e una bilancia Seca 700 funzionante che calcola davvero peso, altezza e BMI dello Zoi.'
        )
      }}
    </p>

    <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      <a
          :href="patreonUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-clinical-teal px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(8,145,178,0.3)] transition hover:bg-cyan-500"
      >
        <ArtekIcons name="StethoscopeOutline" size="sm" color="white" />
        <span>{{ t('Follow FREE for Previews ↗', 'Segui GRATIS per le Anteprime ↗') }}</span>
      </a>

      <NuxtLink
          to="/roadmap"
          class="inline-flex items-center justify-center rounded-xl border border-clinical-border bg-clinical-surface px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-200"
      >
        {{ t('View Clinic Roadmap →', 'Vedi la Roadmap →') }}
      </NuxtLink>
    </div>
  </aside>
</template>