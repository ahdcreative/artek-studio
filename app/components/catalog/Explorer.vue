<script setup lang="ts">
import { getProjectTitle, useStudioProjects } from '~/composables/useStudioData';

type SectionFilter = 'ALL' | 'CAZ' | 'Build Mode';
type TierFilter = 'ALL' | 'FREE' | 'PATREON';
type StatusFilter = 'ALL' | '3' | '2' | '1' | '0';

const { t } = useLocale();
const { data: projects } = useStudioProjects();

const query = ref('');
const sectionFilter = ref<SectionFilter>('ALL');
const tierFilter = ref<TierFilter>('ALL');
const statusFilter = ref<StatusFilter>('ALL');

const filteredProjects = computed(() => {
  const list = projects.value ?? [];
  const q = query.value.trim().toLowerCase();

  const matches = list.filter((p) => {
    if (sectionFilter.value !== 'ALL' && p.section !== sectionFilter.value) return false;
    if (tierFilter.value === 'FREE' && !p.is_free) return false;
    if (tierFilter.value === 'PATREON' && p.is_free) return false;
    if (statusFilter.value !== 'ALL' && String(p.status) !== statusFilter.value) return false;

    if (!q) return true;
    const haystack = [
      p.title,
      getProjectTitle(p, 'it'),
      p.category,
      p.section,
      p.summary_en,
      p.summary_it
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    return haystack.includes(q);
  });

  return [...matches].sort((a, b) => {
    if (a.status !== b.status) return b.status - a.status;
    const aImg = a.preview_url ? 0 : 1;
    const bImg = b.preview_url ? 0 : 1;
    if (aImg !== bImg) return aImg - bImg;
    return (a.sort_order ?? 100) - (b.sort_order ?? 100);
  });
});

function resetFilters() {
  query.value = '';
  sectionFilter.value = 'ALL';
  tierFilter.value = 'ALL';
  statusFilter.value = 'ALL';
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
    <div class="space-y-2 border-b border-clinical-border/80 pb-8">
      <h1 class="text-3xl font-extrabold text-white sm:text-4xl">
        {{ t('Complete Studio Mod Catalog', 'Catalogo Completo Mod dello Studio') }}
      </h1>
      <p class="max-w-2xl text-sm text-slate-400">
        {{
          t(
              'Browse 100% free Create-a-Zoi healthcare uniforms, Build Mode medical devices, and upcoming playable clinic mods (14-day Early Access, then free for everyone).',
              'Esplora divise sanitarie Create-a-Zoi 100% gratuite, dispositivi medici in Modalità Costruisci e le prossime mod gameplay della clinica (Early Access 14 giorni, poi gratis per tutti).'
          )
        }}
      </p>
    </div>

    <CatalogFilters
        v-model:query="query"
        v-model:section-filter="sectionFilter"
        v-model:tier-filter="tierFilter"
        v-model:status-filter="statusFilter"
        :filtered-count="filteredProjects.length"
        :total-count="projects?.length ?? 0"
        @reset="resetFilters"
    />

    <div v-if="filteredProjects.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ModCard v-for="mod in filteredProjects" :key="mod.slug" :project="mod" />
    </div>

    <div
        v-else
        class="rounded-2xl border border-clinical-border bg-clinical-surface/60 px-6 py-16 text-center"
    >
      <p class="text-sm text-slate-300">
        {{
          t(
              'No projects match your current filters.',
              'Nessun progetto corrisponde ai filtri selezionati.'
          )
        }}
      </p>
      <button
          type="button"
          class="mt-4 rounded-xl bg-clinical-teal px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500"
          @click="resetFilters"
      >
        {{ t('Reset Filters', 'Ripristina Filtri') }}
      </button>
    </div>
  </div>
</template>