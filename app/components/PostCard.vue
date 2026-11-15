<script setup lang="ts">
import type { StudioPost } from '~/types/database.types';

const props = defineProps<{
  post: StudioPost;
}>();

const { lang, t } = useLocale();

const displayTitle = computed(() => (lang.value === 'it' ? props.post.title_it : props.post.title_en));
const displaySummary = computed(() =>
  lang.value === 'it'
    ? props.post.summary_it || props.post.summary_en || ''
    : props.post.summary_en || props.post.summary_it || ''
);

const formattedDate = computed(() => {
  const date = new Date(props.post.published_at);
  return date.toLocaleDateString(lang.value === 'it' ? 'it-IT' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});
</script>

<template>
  <article
    class="group flex flex-col overflow-hidden rounded-2xl border border-clinical-border bg-clinical-surface/90 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-500/50"
  >
    <NuxtLink
      :to="`/news/${post.slug}`"
      class="relative block aspect-16/9 w-full overflow-hidden bg-clinical-elevated"
    >
      <img
        v-if="post.cover_url"
        :src="post.cover_url"
        :alt="displayTitle"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-gradient-to-br from-clinical-elevated to-clinical-canvas"
      >
        <ArtekIcons name="MedicalRecordsOutline" size="xl" color="cyan" class="opacity-50" />
      </div>

      <div class="absolute left-3 top-3 flex items-center gap-2">
        <span
          class="rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-cyan-100 backdrop-blur"
        >
          News
        </span>
        <span
          class="rounded-lg border border-white/15 bg-clinical-canvas/85 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-slate-200 backdrop-blur"
        >
          {{ post.post_type }}
        </span>
      </div>
    </NuxtLink>

    <div class="flex flex-1 flex-col justify-between gap-4 p-5">
      <NuxtLink :to="`/news/${post.slug}`" class="block space-y-2">
        <div class="flex items-center gap-1.5 text-xs text-slate-400">
          <ArtekIcons name="CalendarOutline" size="xs" color="cyan" />
          <span>{{ formattedDate }}</span>
        </div>

        <h3 class="line-clamp-2 text-base font-bold text-white transition group-hover:text-cyan-300">
          {{ displayTitle }}
        </h3>

        <p class="line-clamp-3 text-xs leading-relaxed text-slate-400">
          {{ displaySummary }}
        </p>
      </NuxtLink>

      <div class="flex items-center justify-between gap-2 border-t border-clinical-border/70 pt-3 text-xs">
        <NuxtLink
          v-if="post.project_slug"
          :to="`/mods/${post.project_slug}`"
          class="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
        >
          {{ t('View Mod →', 'Scheda Mod →') }}
        </NuxtLink>
        <span v-else class="font-mono text-[11px] text-slate-500">ArtekMedical</span>

        <NuxtLink
          :to="`/news/${post.slug}`"
          class="font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          {{ t('Read news →', 'Leggi news →') }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
