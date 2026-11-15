<script setup lang="ts">
const { t } = useLocale();
const { data: projects } = useStudioProjects();

const totalProjects = computed(() => projects.value?.length ?? 0);

const featuredMods = computed(() => {
  const list = projects.value ?? [];
  const featured = list.filter((p) => p.featured);
  return [...featured]
    .sort((a, b) => {
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
          <span>{{ t('Featured Collection', 'Collezione in Evidenza') }}</span>
        </div>
        <h2 class="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
          {{ t('Signature Medical Gear & Clinic Props', 'Abbigliamento & Strumentario Clinico') }}
        </h2>
      </div>

      <NuxtLink
        to="/catalog"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
      >
        <span>{{ t(`View all ${totalProjects} projects →`, `Vedi tutti i ${totalProjects} progetti →`) }}</span>
      </NuxtLink>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ModCard v-for="mod in featuredMods" :key="mod.slug" :project="mod" />
    </div>
  </section>
</template>
