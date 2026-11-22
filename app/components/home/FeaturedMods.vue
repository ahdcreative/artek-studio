<script setup lang="ts">
const { t } = useLocale();
const { data: projects } = useStudioProjects();

const releasedCount = computed(() => (projects.value ?? []).filter((p) => p.status === 3).length);

const featuredMods = computed(() => {
  const list = projects.value ?? [];
  const featured = list.filter((p) => p.featured);
  const pool = featured.length > 0 ? featured : list;

  return [...pool]
      .sort((a, b) => {
        // Always showcase live released mods first
        const aLive = a.status === 3 ? 0 : 1;
        const bLive = b.status === 3 ? 0 : 1;
        if (aLive !== bLive) return aLive - bLive;

        const aImg = a.preview_url ? 0 : 1;
        const bImg = b.preview_url ? 0 : 1;
        if (aImg !== bImg) return aImg - bImg;

        return (a.sort_order ?? 100) - (b.sort_order ?? 100);
      })
      .slice(0, 6);
});
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div
            class="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400"
        >
          <ArtekIcons name="HospitalOutline" size="sm" color="cyan" />
          <span>{{ t('Download Free Today', 'Scarica Gratis Oggi') }}</span>
        </div>
        <h2 class="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
          {{ t('Signature Medical Gear & Clinic Props', 'Divise Sanitarie & Strumentario Clinico') }}
        </h2>
      </div>

      <NuxtLink
          to="/catalog"
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
      >
        <span>{{
            t(
                `Browse all ${releasedCount} live mods →`,
                `Esplora tutte le ${releasedCount} mod online →`
            )
          }}</span>
      </NuxtLink>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ModCard v-for="mod in featuredMods" :key="mod.slug" :project="mod" />
    </div>
  </section>
</template>