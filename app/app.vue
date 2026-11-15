<script setup lang="ts">
const { lang } = useLocale();

useHead({
  htmlAttrs: {
    lang: () => lang.value
  },
  titleTemplate: (titleChunk) =>
    titleChunk ? `${titleChunk} — ArtekMedical Studio` : 'ArtekMedical Studio — inZOI Healthcare Mods'
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
