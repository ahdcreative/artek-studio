<script setup lang="ts">
const { t } = useLocale();
const { data: projects } = useStudioProjects();

const query = ref('');
const sectionFilter = ref<'ALL' | 'CAZ' | 'Build Mode'>('ALL');
const tierFilter = ref<'ALL' | 'FREE' | 'PATREON'>('ALL');
const statusFilter = ref<'ALL' | '3' | '2' | '1' | '0'>('ALL');

const filteredProjects = computed(() => {
  const list = projects.value ?? [];
  const q = query.value.trim().toLowerCase();

  return list.filter((p) => {
    if (sectionFilter.value !== 'ALL' && p.section !== sectionFilter.value) return false;
    if (tierFilter.value === 'FREE' && !p.is_free) return false;
    if (tierFilter.value === 'PATREON' && p.is_free) return false;
    if (statusFilter.value !== 'ALL' && String(p.status) !== statusFilter.value) return false;

    if (!q) return true;
    const haystack = [
      p.title,
      p.metadata?.raw_title_it,
      p.category,
      p.modkit_project,
      p.summary_en,
      p.summary_it,
      p.notes
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
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
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="space-y-2 border-b border-clinical-border/80 pb-8">
      <h1 class="text-3xl font-extrabold text-white sm:text-4xl">
        {{ t('Complete Studio Mod Catalog', 'Catalogo Completo Mod dello Studio') }}
      </h1>
      <p class="max-w-2xl text-sm text-slate-400">
        {{
          t(
            'Filter across Create-a-Zoi healthcare uniforms, Build Mode medical devices, free CurseForge mods, and Patreon supporter releases.',
            'Filtra tra divise sanitarie Create-a-Zoi, dispositivi clinici Modalita Costruisci, mod gratuite CurseForge e rilasci Patreon.'
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
        class="mt-4 rounded-xl bg-clinical-teal px-4 py-2 text-xs font-semibold text-white"
        @click="resetFilters"
      >
        {{ t('Reset Filters', 'Ripristina Filtri') }}
      </button>
    </div>
  </div>
</template>
