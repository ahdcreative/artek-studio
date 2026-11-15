<script setup lang="ts">
const { t } = useLocale();

useSeoMeta({
  title: () => t('Studio News & Releases', 'News & Rilasci Studio'),
  description: () =>
    t(
      'Official studio news, release highlights, and development previews from ArtekMedical Studio.',
      'Notizie ufficiali dello studio, rilasci e anteprime in sviluppo di ArtekMedical Studio.'
    )
});
</script>

<template>
  <NewsArchive />
</template>
