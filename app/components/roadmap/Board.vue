<script setup lang="ts">
import { getProjectTitle, useStudioProjects } from '~/composables/useStudioData';
import type { StudioProject } from '~/types/studio.types';

const { lang, t } = useLocale();
const { data: projects } = useStudioProjects();

interface RoadmapLane {
  status: number;
  title: string;
  subtitle: string;
  accent: string;
  items: StudioProject[];
}

const lanes = computed<RoadmapLane[]>(() => {
  const list = projects.value ?? [];
  return [
    {
      status: 3,
      title: t('Released & Live', 'Rilasciate & Scaricabili'),
      subtitle: t('Available free on CurseForge right now', 'Disponibili gratis su CurseForge ora'),
      accent: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300',
      items: list.filter((p) => p.status === 3)
    },
    {
      status: 2,
      title: t('Coming Soon', 'In Arrivo'),
      subtitle: t('Finished and queued for upcoming drops', 'Completate e pronte ai prossimi rilasci'),
      accent: 'border-cyan-500/35 bg-cyan-500/10 text-cyan-300',
      items: list.filter((p) => p.status === 2)
    },
    {
      status: 1,
      title: t('In Development', 'In Sviluppo'),
      subtitle: t(
          'Currently in 3D modeling, animation & testing',
          'Attualmente in modellazione, animazione e test'
      ),
      accent: 'border-amber-500/35 bg-amber-500/10 text-amber-300',
      items: list.filter((p) => p.status === 1)
    },
    {
      status: 0,
      title: t('Planned', 'In Programma'),
      subtitle: t('Scheduled for future studio updates', 'Pianificate per i prossimi aggiornamenti'),
      accent: 'border-slate-500/35 bg-slate-500/10 text-slate-300',
      items: list.filter((p) => p.status === 0)
    }
  ];
});

function formatMetaLine(item: StudioProject): string {
  return [item.section, item.category].filter(Boolean).join(' • ') || 'inZOI Mod';
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
    <div class="space-y-2 border-b border-clinical-border/80 pb-8">
      <h1 class="text-3xl font-extrabold text-white sm:text-4xl">
        {{ t('Hospital Ecosystem Roadmap', 'Roadmap Ecosistema Clinico') }}
      </h1>
      <p class="max-w-2xl text-sm text-slate-400">
        {{
          t(
              'Live production progress across every Create-a-Zoi uniform, diagnostic instrument, and playable clinic feature.',
              'Avanzamento in tempo reale per ogni divisa Create-a-Zoi, strumento diagnostico e funzione della clinica giocabile.'
          )
        }}
      </p>
    </div>

    <div class="mt-8">
      <ClinicSpotlightBanner />
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <section
          v-for="lane in lanes"
          :key="lane.status"
          class="flex flex-col rounded-3xl border border-clinical-border bg-clinical-surface/80 p-5"
      >
        <div
            class="mb-4 flex items-start justify-between gap-3 border-b border-clinical-border/70 pb-3"
        >
          <div>
            <h2 class="text-base font-bold text-white">{{ lane.title }}</h2>
            <p class="mt-0.5 text-xs text-slate-400">{{ lane.subtitle }}</p>
          </div>
          <span
              class="shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold"
              :class="lane.accent"
          >
            {{ lane.items.length }}
          </span>
        </div>

        <div class="space-y-2.5">
          <NuxtLink
              v-for="item in lane.items"
              :key="item.slug"
              :to="`/mods/${item.slug}`"
              class="flex items-center justify-between gap-3 rounded-xl border border-clinical-border/70 bg-clinical-canvas/75 px-3.5 py-2.5 transition hover:border-cyan-500/45"
          >
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-white">
                {{ getProjectTitle(item, lang) }}
              </div>
              <div class="truncate text-[11px] text-slate-400">
                {{ formatMetaLine(item) }}
              </div>
            </div>

            <span
                class="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
                :class="
                item.is_free
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-cyan-500/20 text-cyan-200'
              "
            >
              {{ item.is_free ? t('Free', 'Gratis') : t('Early Access', 'Early Access') }}
            </span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>