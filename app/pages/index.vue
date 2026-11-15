<script setup lang="ts">
const { t } = useLocale();

useSeoMeta({
  title: () => t('Home', 'Home'),
  description: () =>
    t(
      'Authentic medical apparel, clinical footwear, and 1:1 hospital props for inZOI — designed by a practicing hospital doctor.',
      'Divise sanitarie autentiche, calzature ospedaliere e strumenti clinici 1:1 per inZOI — progettati da un medico ospedaliero.'
    )
});
</script>

<template>
  <div>
    <HomeHero />
    <HomeFeaturedMods />
    <HomeLatestPosts />
  </div>
</template>
