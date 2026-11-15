<script setup lang="ts">
const { t } = useLocale();

useSeoMeta({
  title: () => t('Studio Roadmap', 'Tabella di Marcia & Cantiere'),
  description: () =>
    t(
      'Live studio production pipeline synced from Supabase: Released, Ready in ModKit, In Progress, and Planned medical mods.',
      'Pipeline di produzione dello studio in tempo reale: Rilasciate, Pronte nel ModKit, In Lavorazione e In Programma.'
    )
});
</script>

<template>
  <RoadmapBoard />
</template>
