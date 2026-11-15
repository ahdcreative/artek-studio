<script setup lang="ts">
const { t } = useLocale();
const { data: settings } = useStudioSettings();
</script>

<template>
  <footer class="border-t border-clinical-border/80 bg-clinical-surface/70">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"
    >
      <div class="space-y-1.5">
        <div class="flex items-center gap-2 text-sm font-bold text-white">
          <ArtekIcons name="HeartCardiogramOutline" size="md" color="cyan" />
          <span>{{ settings?.brand_name ?? 'ArtekMedical Studio' }}</span>
          <span class="font-mono text-xs text-slate-500">• art3k.org</span>
        </div>
        <p class="max-w-xl text-xs leading-relaxed text-slate-400">
          {{
            t(
              'Custom medical apparel, clinical footwear, and 1:1 hospital props for inZOI — designed and playtested between shifts.',
              'Divise sanitarie, calzature ospedaliere e strumenti clinici in scala 1:1 per inZOI — progettati e testati tra un turno e l\'altro.'
            )
          }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
        <NuxtLink to="/catalog" class="transition hover:text-cyan-300">
          {{ t('Catalog', 'Catalogo') }}
        </NuxtLink>
        <NuxtLink to="/news" class="transition hover:text-cyan-300">
          {{ t('News', 'News') }}
        </NuxtLink>
        <NuxtLink to="/roadmap" class="transition hover:text-cyan-300">
          {{ t('Roadmap', 'Cantiere') }}
        </NuxtLink>
        <NuxtLink to="/admin" class="text-slate-400 transition hover:text-cyan-300">
          Admin
        </NuxtLink>
        <a
          :href="settings?.patreon_url ?? 'https://www.patreon.com/darkart3k'"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
        >
          patreon.com/darkart3k
        </a>
      </div>
    </div>
  </footer>
</template>
