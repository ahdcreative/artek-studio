<script setup lang="ts">
import type { StudioPost, StudioProject } from '~/types/database.types';

const props = defineProps<{
  project: StudioProject;
  relatedPosts: StudioPost[];
}>();

const { lang, t } = useLocale();

const displayTitle = computed(() =>
  lang.value === 'it' && props.project.metadata?.raw_title_it
    ? String(props.project.metadata.raw_title_it)
    : props.project.title
);

const displaySummary = computed(() =>
  lang.value === 'it'
    ? props.project.summary_it || props.project.notes || props.project.summary_en || ''
    : props.project.summary_en || props.project.summary_it || props.project.notes || ''
);

const galleryImages = computed(() => {
  const urls = new Set<string>();
  if (props.project.preview_url) urls.add(props.project.preview_url);
  for (const post of props.relatedPosts) {
    if (post.cover_url) urls.add(post.cover_url);
    for (const img of post.gallery_urls ?? []) urls.add(img);
  }
  return Array.from(urls);
});
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <NuxtLink
      to="/catalog"
      class="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
    >
      ← {{ t('Back to Catalog', 'Torna al Catalogo') }}
    </NuxtLink>

    <div class="mt-6 grid gap-8 lg:grid-cols-12">
      <div class="lg:col-span-7">
        <ModsGallery :images="galleryImages" :alt="displayTitle" />
      </div>

      <!-- Technical Spec & CTA -->
      <div class="space-y-6 lg:col-span-5">
        <div class="space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="rounded-full border px-3 py-1 text-xs font-semibold"
              :class="getStatusBadgeClass(project.status)"
            >
              {{ getStatusLabel(project.status, lang) }}
            </span>

            <span
              class="rounded-full border border-clinical-border bg-clinical-surface px-3 py-1 font-mono text-xs text-slate-300"
            >
              {{ project.section || 'Build Mode' }}
            </span>

            <span
              v-if="project.is_free"
              class="rounded-full border border-emerald-500/35 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300"
            >
              {{ t('Free Community Mod', 'Mod Gratuita') }}
            </span>
            <span
              v-else
              class="rounded-full border border-rose-500/35 bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-200"
            >
              Patreon Tier{{
                project.tier_price_eur ? ` • €${Number(project.tier_price_eur).toFixed(2)}` : ''
              }}
            </span>
          </div>

          <h1 class="text-2xl font-extrabold text-white sm:text-3xl">
            {{ displayTitle }}
          </h1>

          <p class="text-sm leading-relaxed text-slate-300">
            {{ displaySummary }}
          </p>
        </div>

        <!-- Specs Card -->
        <div
          class="space-y-3 rounded-2xl border border-clinical-border bg-clinical-surface/85 p-5 text-xs"
        >
          <div class="flex items-center gap-2 font-semibold text-white">
            <ArtekIcons name="InfoOutline" size="sm" color="cyan" />
            <span>{{ t('Technical Details', 'Dettagli Tecnici') }}</span>
          </div>

          <dl class="divide-y divide-clinical-border/60">
            <div class="flex justify-between gap-4 py-2">
              <dt class="text-slate-400">{{ t('Category', 'Categoria') }}</dt>
              <dd class="font-medium text-slate-100">{{ project.category || '—' }}</dd>
            </div>
            <div class="flex justify-between gap-4 py-2">
              <dt class="text-slate-400">ModKit Package</dt>
              <dd class="font-mono text-cyan-300">{{ project.modkit_project || '—' }}</dd>
            </div>
            <div v-if="project.notes" class="flex justify-between gap-4 py-2">
              <dt class="text-slate-400">{{ t('Workbench Status', 'Stato Tecnico') }}</dt>
              <dd class="max-w-[62%] text-right text-slate-200">{{ project.notes }}</dd>
            </div>
          </dl>
        </div>

        <!-- External Buttons -->
        <div class="flex flex-col gap-3">
          <a
            :href="project.patreon_url || 'https://www.patreon.com/darkart3k'"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-clinical-teal px-5 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(8,145,178,0.35)] transition hover:bg-cyan-500"
          >
            <span>{{
              t('View on Patreon (patreon.com/darkart3k)', 'Apri su Patreon (patreon.com/darkart3k)')
            }}</span>
          </a>

          <a
            v-if="project.curseforge_url"
            :href="project.curseforge_url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-5 py-3 text-sm font-bold text-amber-200 transition hover:bg-amber-500/25"
          >
            <span>{{ t('Download on CurseForge', 'Scarica su CurseForge') }}</span>
          </a>

          <a
            v-if="project.metadata?.cgtrader_url"
            :href="String(project.metadata.cgtrader_url)"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-clinical-border bg-clinical-surface px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-500/40 hover:text-white"
          >
            <span>{{ t('3D Mesh Source Reference (CGTrader)', 'Sorgente Mesh 3D (CGTrader)') }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Linked Posts -->
    <section v-if="relatedPosts.length" class="mt-14 border-t border-clinical-border/80 pt-10">
      <div class="mb-6 flex items-center gap-2">
        <ArtekIcons name="MedicalRecordsOutline" size="md" color="cyan" />
        <h2 class="text-xl font-bold text-white">
          {{ t('Related Posts & Descriptions', 'Post & Descrizioni Collegate') }}
        </h2>
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="post in relatedPosts" :key="post.slug" :post="post" />
      </div>
    </section>
  </div>
</template>
