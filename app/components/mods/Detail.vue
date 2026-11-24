<script setup lang="ts">
import {
  DEFAULT_PATREON_URL,
  getProjectSummary,
  getProjectTitle,
  getStatusBadgeClass,
  getStatusLabel,
  useStudioSettings
} from '~/composables/useStudioData';
import { asStringArray, type StudioPost, type StudioProject } from '~/types/studio.types';
import { buildReferralUrl, EXTERNAL_LINK_REL } from '~/utils/referral';

const props = defineProps<{
  project: StudioProject;
  relatedPosts: StudioPost[];
}>();

const { lang, t } = useLocale();
const { data: settings } = useStudioSettings();
const user = useSupabaseUser();

const displayTitle = computed(() => getProjectTitle(props.project, lang.value));
const displaySummary = computed(() => getProjectSummary(props.project, lang.value));

const curseforgeTargetUrl = computed(() =>
    buildReferralUrl(props.project.curseforge_url, 'mod_detail', props.project.slug)
);

const patreonTargetUrl = computed(() =>
    buildReferralUrl(
        props.project.patreon_url || settings.value?.patreon_url || DEFAULT_PATREON_URL,
        'mod_detail',
        props.project.slug
    )
);

const patreonCtaLabel = computed(() => {
  if (props.project.is_early_access) {
    return t('Unlock Early Access on Patreon ↗', 'Sblocca Early Access su Patreon ↗');
  }
  return props.project.patreon_url
      ? t('Open Devlog Post ↗', 'Apri Post su Patreon ↗')
      : t('Follow FREE for Updates ↗', 'Segui GRATIS su Patreon ↗');
});

const galleryImages = computed(() => {
  const urls = new Set<string>();
  if (props.project.preview_url) urls.add(props.project.preview_url);
  for (const post of props.relatedPosts) {
    if (post.cover_url) urls.add(post.cover_url);
    for (const img of asStringArray(post.gallery_urls)) {
      urls.add(img);
    }
  }
  return Array.from(urls);
});
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
    <NuxtLink
        to="/catalog"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
    >
      ← {{ t('Back to Catalog', 'Torna al Catalogo') }}
    </NuxtLink>

    <div class="mt-6 grid gap-8 lg:grid-cols-12">
      <div class="space-y-6 lg:col-span-7">
        <ModsGallery :images="galleryImages" :alt="displayTitle" />
        <ClinicSpotlightBanner />
      </div>

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
                v-if="project.is_early_access"
                class="rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-200"
            >
              {{ t('14-Day Early Access (Then Free)', 'Early Access 14gg (Poi Gratis)') }}
            </span>
            <span
                v-else-if="project.is_free"
                class="rounded-full border border-emerald-500/35 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300"
            >
              {{ t('100% Free Mod', 'Mod 100% Gratuita') }}
            </span>
            <span
                v-else
                class="rounded-full border border-cyan-500/35 bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-200"
            >
              {{ t('Early Access Planned (Then Free)', 'Early Access Previsto (Poi Gratis)') }}
            </span>
          </div>

          <h1 class="text-2xl font-extrabold text-white sm:text-3xl">
            {{ displayTitle }}
          </h1>

          <p v-if="displaySummary" class="text-sm leading-relaxed text-slate-300">
            {{ displaySummary }}
          </p>
        </div>

        <div
            class="space-y-3 rounded-2xl border border-clinical-border bg-clinical-surface/85 p-5"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-300">
              {{ t('Download & Official Links', 'Download & Link Ufficiali') }}
            </span>
            <NuxtLink
                v-if="user"
                :to="`/admin?edit=${project.slug}`"
                class="rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
            >
              {{ t('Edit Links →', 'Modifica Link →') }}
            </NuxtLink>
          </div>

          <div class="grid gap-2.5">
            <a
                v-if="curseforgeTargetUrl"
                :href="curseforgeTargetUrl"
                target="_blank"
                :rel="EXTERNAL_LINK_REL"
                class="inline-flex items-center justify-between gap-2 rounded-xl border border-amber-400/50 bg-amber-500/20 px-4 py-3 text-sm font-bold text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.16)] transition hover:bg-amber-500/30"
            >
              <span>CurseForge</span>
              <span class="text-xs font-semibold">
                {{ t('Download Free Mod ↗', 'Scarica Mod Gratis ↗') }}
              </span>
            </a>
            <div
                v-else
                class="inline-flex items-center justify-between gap-2 rounded-xl border border-clinical-border/80 bg-clinical-canvas/60 px-4 py-3 text-xs font-medium text-slate-400"
            >
              <span>CurseForge</span>
              <span>{{
                  project.is_early_access
                      ? t('Free after 14-day Early Access', 'Gratis dopo i 14gg di Early Access')
                      : t('Release coming soon', 'Rilascio in arrivo')
                }}</span>
            </div>

            <a
                :href="patreonTargetUrl"
                target="_blank"
                :rel="EXTERNAL_LINK_REL"
                class="inline-flex items-center justify-between gap-2 rounded-xl border border-rose-400/45 bg-rose-500/20 px-4 py-3 text-sm font-bold text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.16)] transition hover:bg-rose-500/30"
            >
              <span>Patreon</span>
              <span class="text-xs font-semibold">{{ patreonCtaLabel }}</span>
            </a>
          </div>
        </div>

        <div
            class="space-y-3 rounded-2xl border border-clinical-border bg-clinical-surface/85 p-5 text-xs"
        >
          <div class="flex items-center gap-2 font-semibold text-white">
            <ArtekIcons name="InfoOutline" size="sm" color="cyan" />
            <span>{{ t('Mod Details', 'Dettagli della Mod') }}</span>
          </div>

          <dl class="divide-y divide-clinical-border/60">
            <div class="flex justify-between gap-4 py-2">
              <dt class="text-slate-400">{{ t('Category', 'Categoria') }}</dt>
              <dd class="font-medium text-slate-100">{{ project.category || '—' }}</dd>
            </div>
            <div class="flex justify-between gap-4 py-2">
              <dt class="text-slate-400">{{ t('Status', 'Stato') }}</dt>
              <dd class="font-medium text-slate-100">{{ getStatusLabel(project.status, lang) }}</dd>
            </div>
            <div v-if="project.modkit_project" class="flex justify-between gap-4 py-2">
              <dt class="text-slate-400">{{ t('Mod Folder ID', 'ID Cartella Mod') }}</dt>
              <dd class="font-mono text-cyan-300">{{ project.modkit_project }}</dd>
            </div>
            <div v-if="user && project.notes" class="flex justify-between gap-4 py-2">
              <dt class="flex items-center gap-1.5 text-slate-400">
                <span>Admin Notes</span>
                <span class="rounded bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[9px] text-cyan-300">
                  Admin only
                </span>
              </dt>
              <dd class="max-w-[62%] text-right text-slate-200">{{ project.notes }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

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