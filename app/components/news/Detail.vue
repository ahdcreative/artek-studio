<script setup lang="ts">
import type { StudioPost } from '~/types/database.types';

const props = defineProps<{
  post: StudioPost;
}>();

const { lang, t } = useLocale();

const displayTitle = computed(() =>
  lang.value === 'it' ? props.post.title_it : props.post.title_en
);

const renderedBody = computed(() => {
  const raw = lang.value === 'it' ? props.post.body_it : props.post.body_en;
  return renderStudioMarkdown(raw);
});

const formattedDate = computed(() =>
  new Date(props.post.published_at).toLocaleDateString(
    lang.value === 'it' ? 'it-IT' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
);
</script>

<template>
  <article class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <NuxtLink
        to="/news"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
      >
        ← {{ t('All Studio News', 'Tutte le News') }}
      </NuxtLink>

      <NuxtLink
        v-if="post.project_slug"
        :to="`/mods/${post.project_slug}`"
        class="rounded-xl border border-emerald-500/35 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/25"
      >
        {{ t('Open Mod Page →', 'Apri Scheda Mod →') }}
      </NuxtLink>
    </div>

    <header class="mt-6 space-y-4 border-b border-clinical-border/80 pb-8">
      <div class="flex flex-wrap items-center gap-2.5">
        <span
          class="rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-cyan-200"
        >
          Studio News
        </span>
        <span
          class="rounded-lg border border-clinical-border bg-clinical-surface px-2.5 py-1 font-mono text-[11px] uppercase text-slate-300"
        >
          {{ post.post_type }}
        </span>
        <span class="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <ArtekIcons name="CalendarOutline" size="xs" color="cyan" />
          {{ formattedDate }}
        </span>
      </div>

      <h1 class="text-2xl font-extrabold leading-tight text-white sm:text-4xl">
        {{ displayTitle }}
      </h1>

      <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="rounded-md border border-clinical-border bg-clinical-surface/80 px-2 py-0.5 font-mono text-[11px] text-slate-400"
        >
          #{{ tag }}
        </span>
      </div>
    </header>

    <!-- Cover + Gallery -->
    <div v-if="post.cover_url || post.gallery_urls?.length" class="my-8 space-y-4">
      <div
        v-if="post.cover_url"
        class="overflow-hidden rounded-3xl border border-clinical-border bg-clinical-surface"
      >
        <img :src="post.cover_url" :alt="displayTitle" class="w-full object-cover" />
      </div>

      <div
        v-if="post.gallery_urls && post.gallery_urls.length > 1"
        class="grid gap-4 sm:grid-cols-2"
      >
        <div
          v-for="img in post.gallery_urls.filter((u) => u !== post.cover_url)"
          :key="img"
          class="overflow-hidden rounded-2xl border border-clinical-border bg-clinical-surface"
        >
          <img :src="img" :alt="displayTitle" loading="lazy" class="h-full w-full object-cover" />
        </div>
      </div>
    </div>

    <!-- Body (Rendered safe HTML from trusted Studio Markdown) -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div
      class="studio-prose rounded-3xl border border-clinical-border bg-clinical-surface/75 p-6 sm:p-9"
      v-html="renderedBody"
    />

    <!-- Internal CTA to Linked Mod Card -->
    <div
      class="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6"
    >
      <div class="space-y-1">
        <div class="text-xs font-mono uppercase tracking-wider text-cyan-300">
          {{ t('Featured Mod in This Article', 'Mod Collegata a Questo Articolo') }}
        </div>
        <p class="text-sm font-medium text-slate-200">
          {{
            t(
              'View full technical specifications, preview renders, and direct Patreon & CurseForge download links on the mod page.',
              'Consulta le specifiche tecniche complete, le immagini di anteprima e i link diretti Patreon e CurseForge nella scheda mod.'
            )
          }}
        </p>
      </div>

      <NuxtLink
        :to="post.project_slug ? `/mods/${post.project_slug}` : '/catalog'"
        class="inline-flex shrink-0 items-center gap-2 rounded-xl bg-clinical-teal px-5 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(8,145,178,0.35)] transition hover:bg-cyan-500"
      >
        <ArtekIcons name="StethoscopeOutline" size="sm" color="white" />
        <span>{{
          post.project_slug
            ? t('Go to Mod Page →', 'Vai alla Scheda Mod →')
            : t('Browse Mod Catalog →', 'Esplora Catalogo Mod →')
        }}</span>
      </NuxtLink>
    </div>
  </article>
</template>
