<script setup lang="ts">
import type { StudioPost, StudioProject } from '~/types/database.types';

const props = defineProps<{
  project: StudioProject;
  relatedPosts: StudioPost[];
}>();

const { lang, t } = useLocale();
const user = useSupabaseUser();

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

        <!-- Download & Platform Links (Patreon + CurseForge) -->
        <div
          class="space-y-3 rounded-2xl border border-clinical-border bg-clinical-surface/85 p-5"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-300">
              {{ t('Download & Official Links', 'Link Ufficiali & Download') }}
            </span>
            <NuxtLink
              v-if="user"
              :to="`/admin?edit=${project.slug}`"
              class="rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
            >
              {{ t('Edit Links →', 'Modifica Link →') }}
            </NuxtLink>
          </div>

          <div class="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            <!-- Patreon -->
            <a
              v-if="project.patreon_url"
              :href="project.patreon_url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-between gap-2 rounded-xl border border-rose-400/45 bg-rose-500/20 px-4 py-3 text-sm font-bold text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.18)] transition hover:bg-rose-500/30"
            >
              <span>Patreon</span>
              <span class="text-xs font-semibold">{{ t('Open Post ↗', 'Apri su Patreon ↗') }}</span>
            </a>
            <div
              v-else
              class="inline-flex items-center justify-between gap-2 rounded-xl border border-clinical-border/80 bg-clinical-canvas/60 px-4 py-3 text-xs font-medium text-slate-500"
            >
              <span>Patreon</span>
              <span>{{ t('Link coming soon', 'Link in arrivo') }}</span>
            </div>

            <!-- CurseForge -->
            <a
              v-if="project.curseforge_url"
              :href="project.curseforge_url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-between gap-2 rounded-xl border border-amber-400/45 bg-amber-500/20 px-4 py-3 text-sm font-bold text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.15)] transition hover:bg-amber-500/30"
            >
              <span>CurseForge</span>
              <span class="text-xs font-semibold">{{ t('Download Mod ↗', 'Scarica Mod ↗') }}</span>
            </a>
            <div
              v-else
              class="inline-flex items-center justify-between gap-2 rounded-xl border border-clinical-border/80 bg-clinical-canvas/60 px-4 py-3 text-xs font-medium text-slate-500"
            >
              <span>CurseForge</span>
              <span>{{ t('Link coming soon', 'Link in arrivo') }}</span>
            </div>
          </div>

          <a
            v-if="project.metadata?.cgtrader_url"
            :href="String(project.metadata.cgtrader_url)"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-clinical-border bg-clinical-canvas/70 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-500/40 hover:text-white"
          >
            <span>{{ t('3D Mesh Source Reference (CGTrader) ↗', 'Sorgente Mesh 3D (CGTrader) ↗') }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Linked News -->
    <section v-if="relatedPosts.length" class="mt-14 border-t border-clinical-border/80 pt-10">
      <div class="mb-6 flex items-center gap-2">
        <ArtekIcons name="MedicalRecordsOutline" size="md" color="cyan" />
        <h2 class="text-xl font-bold text-white">
          {{ t('Related Studio News', 'News & Aggiornamenti Collegati') }}
        </h2>
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="post in relatedPosts" :key="post.slug" :post="post" />
      </div>
    </section>
  </div>
</template>
