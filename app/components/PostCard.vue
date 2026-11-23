<script setup lang="ts">
import { DEFAULT_PATREON_URL, formatPlainSummary } from '~/composables/useStudioData';
import type { StudioPost } from '~/types/studio.types';

const props = defineProps<{
  post: StudioPost;
}>();

const { lang, t } = useLocale();

const isPatreon = computed(() => props.post.platform === 'patreon');

const cardHref = computed(() => {
  if (isPatreon.value) {
    return props.post.external_url || DEFAULT_PATREON_URL;
  }
  return `/news/${props.post.slug}`;
});

const displayTitle = computed(() =>
    lang.value === 'it'
        ? props.post.title_it || props.post.title_en
        : props.post.title_en || props.post.title_it
);

const displaySummary = computed(() => {
  const raw =
      lang.value === 'it'
          ? props.post.summary_it || props.post.summary_en || ''
          : props.post.summary_en || props.post.summary_it || '';
  return formatPlainSummary(raw);
});

const formattedDate = computed(() => {
  const date = new Date(props.post.published_at);
  return date.toLocaleDateString(lang.value === 'it' ? 'it-IT' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

const ctaLabel = computed(() => {
  if (!isPatreon.value) {
    return t('Read news →', 'Leggi news →');
  }
  return props.post.is_early_access
      ? t('Early Access on Patreon ↗', 'Early Access su Patreon ↗')
      : t('Read on Patreon ↗', 'Leggi su Patreon ↗');
});
</script>

<template>
  <article
      class="group flex flex-col overflow-hidden rounded-2xl border border-clinical-border bg-clinical-surface/90 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:shadow-[0_12px_36px_rgba(8,145,178,0.14)]"
  >
    <NuxtLink
        :to="cardHref"
        :external="isPatreon"
        :target="isPatreon ? '_blank' : undefined"
        :rel="isPatreon ? 'noopener noreferrer' : undefined"
        class="relative block aspect-video w-full overflow-hidden bg-clinical-canvas"
    >
      <img
          v-if="post.cover_url"
          :src="post.cover_url"
          :alt="displayTitle"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
      />
      <div
          v-else
          class="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-clinical-elevated to-clinical-canvas px-4 text-center"
      >
        <ArtekIcons
            :name="isPatreon ? 'StethoscopeOutline' : 'MedicalRecordsOutline'"
            size="xl"
            color="cyan"
            class="opacity-50"
        />
        <span class="font-mono text-[10px] uppercase tracking-wider text-slate-500">
          {{ isPatreon ? 'Patreon Devlog' : 'Artek Medical' }}
        </span>
      </div>

      <!-- Top Pills -->
      <div class="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5">
          <span
              class="rounded-lg border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide backdrop-blur"
              :class="
              isPatreon
                ? 'border-rose-400/45 bg-rose-500/25 text-rose-100'
                : 'border-cyan-400/40 bg-cyan-500/20 text-cyan-100'
            "
          >
            {{ isPatreon ? 'Patreon' : 'News' }}
          </span>
          <span
              class="rounded-lg border border-white/15 bg-clinical-canvas/85 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-slate-200 backdrop-blur"
          >
            {{ post.post_type }}
          </span>
        </div>

        <span
            v-if="post.is_early_access"
            class="rounded-lg border border-amber-400/45 bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-100 backdrop-blur"
        >
          {{ t('Early Access', 'Early Access') }}
        </span>
        <span
            v-else-if="isPatreon"
            class="rounded-lg border border-emerald-400/35 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200 backdrop-blur"
        >
          {{ t('Free', 'Gratis') }}
        </span>
      </div>
    </NuxtLink>

    <div class="flex flex-1 flex-col justify-between gap-4 p-5">
      <NuxtLink
          :to="cardHref"
          :external="isPatreon"
          :target="isPatreon ? '_blank' : undefined"
          :rel="isPatreon ? 'noopener noreferrer' : undefined"
          class="block space-y-2"
      >
        <div class="flex items-center gap-1.5 text-xs text-slate-400">
          <ArtekIcons name="CalendarOutline" size="xs" color="cyan" />
          <span>{{ formattedDate }}</span>
        </div>

        <h3 class="line-clamp-2 text-base font-bold text-white transition group-hover:text-cyan-300">
          {{ displayTitle }}
        </h3>

        <p v-if="displaySummary" class="line-clamp-3 text-xs leading-relaxed text-slate-400">
          {{ displaySummary }}
        </p>
      </NuxtLink>

      <div
          class="flex items-center justify-between gap-2 border-t border-clinical-border/70 pt-3 text-xs"
      >
        <NuxtLink
            v-if="post.project_slug"
            :to="`/mods/${post.project_slug}`"
            class="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
        >
          {{ t('View Mod →', 'Scheda Mod →') }}
        </NuxtLink>
        <span v-else class="font-mono text-[11px] text-slate-500">Artek Medical</span>

        <NuxtLink
            :to="cardHref"
            :external="isPatreon"
            :target="isPatreon ? '_blank' : undefined"
            :rel="isPatreon ? 'noopener noreferrer' : undefined"
            class="font-semibold transition"
            :class="
            isPatreon
              ? 'text-rose-300 hover:text-rose-200'
              : 'text-cyan-300 hover:text-cyan-200'
          "
        >
          {{ ctaLabel }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>