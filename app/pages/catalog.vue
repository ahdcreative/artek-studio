<script setup lang="ts">
const { t } = useLocale();

useSeoMeta({
  title: () => t('Mod Catalog', 'Catalogo Mod'),
  description: () =>
    t(
      'Browse every CAZ garment, hospital clog, stethoscope, and Build Mode medical device by ArtekMedical Studio.',
      'Sfoglia tutte le divise CAZ, calzature sanitarie, fonendoscopi e strumenti ospedalieri Build Mode di ArtekMedical Studio.'
    )
});
</script>

<template>
  <CatalogExplorer />
</template>
