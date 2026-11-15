<script setup lang="ts">
const { t } = useLocale();

useSeoMeta({
  title: () => t('Posts & Releases', 'Post & Rilasci'),
  description: () =>
    t(
      'Official bilingual release notes, Patreon sneak peeks, and CurseForge mod descriptions from ArtekMedical Studio.',
      'Note di rilascio ufficiali, anteprime Patreon e schede CurseForge bilingue di ArtekMedical Studio.'
    )
});
</script>

<template>
  <PostsArchive />
</template>
