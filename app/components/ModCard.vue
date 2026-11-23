<script setup lang="ts">
import {
  getProjectSummary,
  getProjectTitle,
  getStatusBadgeClass,
  getStatusLabel
} from '~/composables/useStudioData';
import type { StudioProject } from '~/types/studio.types';

const props = defineProps<{
  project: StudioProject;
}>();

const { lang, t } = useLocale();

const displayTitle = computed(() => getProjectTitle(props.project, lang.value));
const displaySummary = computed(() => getProjectSummary(props.project, lang.value));
</script>

<template>
  <article
      class="group flex flex-col overflow-hidden rounded-2xl border border-clinical-border bg-clinical-surface/90 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:shadow-[0_12px_36px_rgba(8,145,178,0.14)]"
  >
    <NuxtLink
        :to="`/mods/${project.slug}`"
        class="relative block aspect-video w-full overflow-hidden bg-clinical-canvas"
    >
      <img
          v-if="project.preview_url"
          :src="project.preview_url"
          :alt="displayTitle"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
      />
      <div
          v-else
          class="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-clinical-elevated to-clinical-canvas px-4 text-center"
      >
        <ArtekIcons name="StethoscopeOutline" size="xl" color="cyan" class="opacity-50" />
        <span class="font-mono text-[11px] uppercase tracking-wider text-slate-500">
          {{ project.category || project.section || 'Artek Medical' }}
        </span>
      </div>

      <div class="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
        <span
            class="rounded-lg border border-white/10 bg-clinical-canvas/85 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-200 backdrop-blur"
        >
          {{ project.section || 'Build Mode' }}
        </span>

        <span
            v-if="project.is_early_access"
            class="rounded-lg border border-amber-400/45 bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-100 backdrop-blur"
        >
          {{ t('14-Day Early Access', 'Early Access 14gg') }}
        </span>
        <span
            v-else-if="project.is_free"
            class="rounded-lg border border-emerald-400/35 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200 backdrop-blur"
        >
          {{ t('100% Free', '100% Gratis') }}
        </span>
        <span
            v-else
            class="rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan-100 backdrop-blur"
        >
          {{ t('Early Access Planned', 'Early Access Previsto') }}
        </span>
      </div>
    </NuxtLink>

    <div class="flex flex-1 flex-col justify-between gap-4 p-5">
      <NuxtLink :to="`/mods/${project.slug}`" class="block space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <span
              class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
              :class="getStatusBadgeClass(project.status)"
          >
            {{ getStatusLabel(project.status, lang) }}
          </span>
          <span v-if="project.category" class="text-xs text-slate-400">
            {{ project.category }}
          </span>
        </div>

        <h3 class="line-clamp-2 text-base font-bold text-white transition group-hover:text-cyan-300">
          {{ displayTitle }}
        </h3>

        <p v-if="displaySummary" class="line-clamp-2 text-xs leading-relaxed text-slate-400">
          {{ displaySummary }}
        </p>
      </NuxtLink>

      <div
          class="flex flex-wrap items-center justify-between gap-2 border-t border-clinical-border/70 pt-3 text-xs"
      >
        <div class="flex flex-wrap items-center gap-1.5">
          <a
              v-if="project.curseforge_url"
              :href="project.curseforge_url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 rounded-lg border border-amber-400/40 bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-200 transition hover:bg-amber-500/25"
          >
            <span>CurseForge</span>
            <span aria-hidden="true">↗</span>
          </a>

          <a
              v-if="project.patreon_url"
              :href="project.patreon_url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 rounded-lg border border-rose-400/40 bg-rose-500/15 px-2.5 py-1 text-[11px] font-semibold text-rose-200 transition hover:bg-rose-500/25"
          >
            <span>{{ project.is_early_access ? 'Early Access' : 'Patreon' }}</span>
            <span aria-hidden="true">↗</span>
          </a>

          <span
              v-if="!project.curseforge_url && !project.patreon_url"
              class="inline-flex items-center rounded-lg border border-clinical-border/80 bg-clinical-canvas/60 px-2 py-1 text-[10px] font-medium text-slate-400"
          >
            {{ t('In Development', 'In Sviluppo') }}
          </span>
        </div>

        <NuxtLink
            :to="`/mods/${project.slug}`"
            class="shrink-0 font-semibold text-cyan-300 transition hover:translate-x-0.5 hover:text-cyan-200"
        >
          {{ t('Details →', 'Dettagli →') }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>