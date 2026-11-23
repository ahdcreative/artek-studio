<script setup lang="ts">
import type { Database } from '~/types/database.types';
import type { StudioPost, StudioProject } from '~/types/studio.types';

type PlatformFilter = 'all' | 'patreon' | 'site';

interface SyncApiResponse {
  campaignId: string;
  totalFetched: number;
  syncedCount: number;
  mediaMirrored: number;
  mediaSkipped: number;
  errors: string[];
}

const props = defineProps<{
  projects: StudioProject[];
}>();

const emit = defineEmits<{
  updated: [];
}>();

const supabase = useSupabaseClient<Database>();
const { t } = useLocale();

const newsList = shallowRef<StudioPost[]>([]);
const platformFilter = ref<PlatformFilter>('all');
const selectedPatreonSlug = ref('');
const loadingList = ref(false);
const saving = ref(false);
const syncingPatreon = ref(false);
const syncMessage = ref('');
const syncError = ref('');
const feedback = ref('');
const errorMsg = ref('');
const confirmDeleteSlug = ref('');

const filterOptions = computed<ReadonlyArray<{ id: PlatformFilter; label: string }>>(() => [
  { id: 'all', label: t('All', 'Tutti') },
  { id: 'patreon', label: 'Patreon' },
  { id: 'site', label: t('Site', 'Sito') }
]);

const filteredNewsList = computed<StudioPost[]>(() => {
  if (platformFilter.value === 'all') return newsList.value;
  return newsList.value.filter((item: StudioPost) => item.platform === platformFilter.value);
});

const selectedPatreonPost = computed<StudioPost | null>(() => {
  if (!selectedPatreonSlug.value) return null;
  return newsList.value.find((item: StudioPost) => item.slug === selectedPatreonSlug.value) ?? null;
});

const emptyForm = () => ({
  slug: '',
  project_slug: '',
  post_type: 'release',
  is_published: true,
  cover_url: '',
  title_it: '',
  title_en: '',
  summary_it: '',
  summary_en: '',
  body_it: '',
  body_en: '',
  tagsInput: ''
});

const form = reactive(emptyForm());
const isEditingExisting = ref(false);

async function loadNews() {
  loadingList.value = true;
  const { data, error } = await supabase
      .from('studio_posts')
      .select('*')
      .in('platform', ['site', 'patreon'])
      .order('published_at', { ascending: false });

  loadingList.value = false;
  if (error) {
    errorMsg.value = error.message;
    return;
  }
  newsList.value = data ?? [];
}

onMounted(loadNews);

async function triggerPatreonSync() {
  syncError.value = '';
  syncMessage.value = '';
  syncingPatreon.value = true;

  try {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error(t('Active session required.', 'Sessione attiva richiesta.'));
    }

    const res = await $fetch<SyncApiResponse>('/api/admin/sync-patreon', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    syncMessage.value = t(
        `Synced ${res.syncedCount}/${res.totalFetched} Patreon posts (${res.mediaMirrored} covers saved to "previews", ${res.mediaSkipped} cached).`,
        `Sincronizzati ${res.syncedCount}/${res.totalFetched} post Patreon (${res.mediaMirrored} cover salvate su "previews", ${res.mediaSkipped} già presenti).`
    );

    if (res.errors.length > 0) {
      syncError.value = res.errors.join(' | ');
    }

    await loadNews();
    emit('updated');
  } catch (err: unknown) {
    syncError.value = err instanceof Error ? err.message : String(err);
  } finally {
    syncingPatreon.value = false;
  }
}

function startCreate() {
  selectedPatreonSlug.value = '';
  Object.assign(form, emptyForm());
  isEditingExisting.value = false;
  feedback.value = '';
  errorMsg.value = '';
}

function openPatreonPanel(item: StudioPost) {
  selectedPatreonSlug.value = item.slug;
  feedback.value = '';
  errorMsg.value = '';
}

function loadIntoEditor(item: StudioPost) {
  selectedPatreonSlug.value = '';
  form.slug = item.slug;
  form.project_slug = item.project_slug || '';
  form.post_type = item.post_type || 'release';
  form.is_published = Boolean(item.is_published);
  form.cover_url = item.cover_url || '';
  form.title_it = item.title_it || '';
  form.title_en = item.title_en || '';
  form.summary_it = item.summary_it || '';
  form.summary_en = item.summary_en || '';
  form.body_it = item.body_it || '';
  form.body_en = item.body_en || '';
  form.tagsInput = (item.tags ?? []).join(', ');
  isEditingExisting.value = true;
  feedback.value = '';
  errorMsg.value = '';
}

async function handlePatreonPostSaved() {
  await loadNews();
  emit('updated');
}

async function saveNews() {
  errorMsg.value = '';
  feedback.value = '';

  const cleanSlug = form.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '');

  if (
      !cleanSlug ||
      !form.title_it.trim() ||
      !form.title_en.trim() ||
      !form.body_it.trim() ||
      !form.body_en.trim()
  ) {
    errorMsg.value = t(
        'Please fill slug, bilingual titles, and bilingual bodies.',
        'Compila slug, titoli IT/EN e testi IT/EN.'
    );
    return;
  }

  saving.value = true;
  const tags = form.tagsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const payload = {
    slug: cleanSlug,
    project_slug: form.project_slug || null,
    platform: 'site',
    post_type: form.post_type,
    is_paid: false,
    is_early_access: false,
    title_it: form.title_it.trim(),
    title_en: form.title_en.trim(),
    summary_it: form.summary_it.trim() || null,
    summary_en: form.summary_en.trim() || null,
    body_it: form.body_it.trim(),
    body_en: form.body_en.trim(),
    cover_url: form.cover_url.trim() || null,
    external_url: form.project_slug ? `/mods/${form.project_slug}` : '/catalog',
    tags,
    is_published: form.is_published,
    published_at: new Date().toISOString()
  };

  const { error } = await supabase
      .from('studio_posts')
      .upsert(payload, { onConflict: 'slug' });

  saving.value = false;
  if (error) {
    errorMsg.value = error.message;
    return;
  }

  feedback.value = t('Site News saved!', 'News salvata su Supabase!');
  isEditingExisting.value = true;
  form.slug = cleanSlug;
  await loadNews();
  emit('updated');
}

async function deleteNews(slug: string) {
  const { error } = await supabase.from('studio_posts').delete().eq('slug', slug);
  confirmDeleteSlug.value = '';
  if (error) {
    errorMsg.value = error.message;
    return;
  }
  if (form.slug === slug) startCreate();
  if (selectedPatreonSlug.value === slug) selectedPatreonSlug.value = '';
  await loadNews();
  emit('updated');
}
</script>

<template>
  <div class="space-y-6">
    <!-- Patreon Sync Header -->
    <div
        class="flex flex-col justify-between gap-4 rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-clinical-surface to-clinical-surface p-5 sm:flex-row sm:items-center"
    >
      <div class="space-y-1">
        <div
            class="flex items-center gap-2 font-mono text-[11px] font-bold uppercase text-rose-300"
        >
          <span>Patreon API v2 → Supabase Storage (previews)</span>
        </div>
        <h2 class="text-sm font-bold text-white">
          {{ t('Import Latest Patreon Posts', 'Sincronizza Post da Patreon') }}
        </h2>
        <p class="text-xs text-slate-400">
          {{
            t(
                'Fetches your Patreon posts as teaser cards, mirrors covers into the "previews" bucket, and links directly to Patreon.',
                'Importa i post di Patreon come card teaser, copia le cover nel bucket "previews" e linka direttamente a Patreon.'
            )
          }}
        </p>
      </div>

      <button
          type="button"
          :disabled="syncingPatreon"
          class="shrink-0 rounded-xl border border-rose-400/45 bg-rose-500/20 px-4 py-2.5 text-xs font-bold text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.16)] transition hover:bg-rose-500/30 disabled:opacity-50"
          @click="triggerPatreonSync"
      >
        {{
          syncingPatreon
              ? t('Syncing Patreon...', 'Sincronizzazione...')
              : t('Sync Patreon Now ↻', 'Sincronizza Patreon Ora ↻')
        }}
      </button>
    </div>

    <p
        v-if="syncMessage"
        class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300"
    >
      {{ syncMessage }}
    </p>
    <p
        v-if="syncError"
        class="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-200"
    >
      {{ syncError }}
    </p>

    <div class="grid gap-6 lg:grid-cols-12">
      <!-- Left List -->
      <div class="space-y-3 lg:col-span-5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-sm font-bold text-white">
            {{ t('Published & Synced Posts', 'Post Pubblicati & Sincronizzati') }}
          </h2>
          <button
              type="button"
              class="rounded-xl bg-clinical-teal px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-500"
              @click="startCreate"
          >
            + {{ t('New Site Article', 'Nuova News Sito') }}
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-1.5">
          <button
              v-for="opt in filterOptions"
              :key="opt.id"
              type="button"
              class="rounded-lg px-2.5 py-1 text-[11px] font-semibold transition"
              :class="
              platformFilter === opt.id
                ? 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40'
                : 'border border-clinical-border bg-clinical-canvas text-slate-400 hover:text-white'
            "
              @click="platformFilter = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>

        <div v-if="loadingList" class="text-xs text-slate-400">
          {{ t('Loading...', 'Caricamento...') }}
        </div>

        <div class="space-y-2.5">
          <div
              v-for="item in filteredNewsList"
              :key="item.slug"
              class="rounded-2xl border bg-clinical-surface/90 p-4 transition"
              :class="
              selectedPatreonSlug === item.slug
                ? 'border-rose-400/60 ring-1 ring-rose-400/30'
                : 'border-clinical-border'
            "
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span
                      class="rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase"
                      :class="
                      item.platform === 'patreon'
                        ? 'bg-rose-500/20 text-rose-200'
                        : 'bg-cyan-500/15 text-cyan-300'
                    "
                  >
                    {{ item.platform }}
                  </span>
                  <span
                      class="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-300"
                  >
                    {{ item.post_type }}
                  </span>
                  <span
                      v-if="item.is_early_access"
                      class="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-200"
                  >
                    Early Access
                  </span>
                  <span
                      v-if="!item.cover_url"
                      class="rounded bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300"
                  >
                    {{ t('No cover', 'Senza cover') }}
                  </span>
                  <span
                      v-if="!item.is_published"
                      class="rounded bg-slate-500/20 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                  >
                    Hidden
                  </span>
                </div>
                <h3 class="mt-1.5 text-xs font-bold text-white">
                  {{ item.title_en || item.title_it }}
                </h3>
                <p class="mt-0.5 truncate font-mono text-[10px] text-slate-500">
                  {{ item.slug }}
                  <span v-if="item.project_slug"> → {{ item.project_slug }}</span>
                </p>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
              <button
                  v-if="item.platform === 'patreon'"
                  type="button"
                  class="rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-2.5 py-1 font-semibold text-cyan-300 hover:bg-cyan-500/20"
                  @click="openPatreonPanel(item)"
              >
                {{ t('Cover & Mod', 'Cover & Mod') }}
              </button>
              <button
                  v-else
                  type="button"
                  class="rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-2.5 py-1 font-semibold text-cyan-300 hover:bg-cyan-500/20"
                  @click="loadIntoEditor(item)"
              >
                {{ t('Edit', 'Modifica') }}
              </button>

              <a
                  v-if="item.platform === 'patreon' && item.external_url"
                  :href="item.external_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-lg border border-rose-500/35 bg-rose-500/10 px-2.5 py-1 font-semibold text-rose-200 hover:bg-rose-500/20"
              >
                Patreon ↗
              </a>
              <NuxtLink
                  v-else
                  :to="`/news/${item.slug}`"
                  target="_blank"
                  class="rounded-lg border border-clinical-border px-2.5 py-1 text-slate-300 hover:text-white"
              >
                {{ t('Open ↗', 'Apri ↗') }}
              </NuxtLink>

              <button
                  v-if="confirmDeleteSlug !== item.slug"
                  type="button"
                  class="ml-auto text-rose-400 hover:text-rose-300"
                  @click="confirmDeleteSlug = item.slug"
              >
                {{ t('Delete', 'Elimina') }}
              </button>
              <button
                  v-else
                  type="button"
                  class="ml-auto rounded bg-rose-500/25 px-2 py-0.5 font-bold text-rose-200"
                  @click="deleteNews(item.slug)"
              >
                {{ t('Confirm Delete', 'Conferma Elimina') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Patreon Override Panel OR Manual Site Article Editor -->
      <div class="lg:col-span-7">
        <AdminPatreonPostPanel
            v-if="selectedPatreonPost"
            :post="selectedPatreonPost"
            :projects="props.projects"
            @saved="handlePatreonPostSaved"
            @close="selectedPatreonSlug = ''"
        />

        <div
            v-else
            class="rounded-2xl border border-clinical-border bg-clinical-surface/90 p-5"
        >
          <h2 class="text-base font-bold text-white">
            {{
              isEditingExisting
                  ? t('Edit Site News Article', 'Modifica Articolo News')
                  : t('Create Manual Site Article (Optional)', 'Crea Articolo Manuale (Opzionale)')
            }}
          </h2>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <label class="block space-y-1">
              <span class="text-[11px] font-semibold text-slate-300">News Slug</span>
              <input
                  v-model="form.slug"
                  :disabled="isEditingExisting"
                  type="text"
                  placeholder="news-new-mod-release"
                  class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white disabled:opacity-60 focus:border-cyan-500 focus:outline-none"
              />
            </label>

            <label class="block space-y-1">
              <span class="text-[11px] font-semibold text-emerald-300">
                {{ t('Linked Internal Mod', 'Mod Collegata sul Sito') }}
              </span>
              <select
                  v-model="form.project_slug"
                  class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="">
                  {{ t('General Studio / Catalog', 'Generale / Catalogo') }}
                </option>
                <option v-for="proj in props.projects" :key="proj.slug" :value="proj.slug">
                  {{ proj.slug }} — {{ proj.title }}
                </option>
              </select>
            </label>

            <label class="block space-y-1">
              <span class="text-[11px] font-semibold text-slate-300">Type</span>
              <select
                  v-model="form.post_type"
                  class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="release">release</option>
                <option value="preview">preview</option>
                <option value="update">update</option>
              </select>
            </label>

            <label class="block space-y-1">
              <span class="text-[11px] font-semibold text-slate-300">Cover Image URL</span>
              <input
                  v-model="form.cover_url"
                  type="url"
                  placeholder="https://...supabase.co/storage/v1/object/public/previews/..."
                  class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </label>

            <label class="block space-y-1">
              <span class="text-[11px] font-semibold text-slate-300">Titolo (IT)</span>
              <input
                  v-model="form.title_it"
                  type="text"
                  class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </label>

            <label class="block space-y-1">
              <span class="text-[11px] font-semibold text-slate-300">Title (EN)</span>
              <input
                  v-model="form.title_en"
                  type="text"
                  class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </label>

            <label class="block space-y-1">
              <span class="text-[11px] font-semibold text-slate-300">Riassunto (IT)</span>
              <textarea
                  v-model="form.summary_it"
                  rows="2"
                  class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </label>

            <label class="block space-y-1">
              <span class="text-[11px] font-semibold text-slate-300">Summary (EN)</span>
              <textarea
                  v-model="form.summary_en"
                  rows="2"
                  class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </label>
          </div>

          <div class="mt-3 space-y-3">
            <label class="block space-y-1">
              <span class="text-[11px] font-semibold text-slate-300">Testo Markdown (IT)</span>
              <textarea
                  v-model="form.body_it"
                  rows="4"
                  class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 font-mono text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </label>

            <label class="block space-y-1">
              <span class="text-[11px] font-semibold text-slate-300">Markdown Body (EN)</span>
              <textarea
                  v-model="form.body_en"
                  rows="4"
                  class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 font-mono text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </label>

            <div class="grid gap-3 sm:grid-cols-2">
              <label class="block space-y-1">
                <span class="text-[11px] font-semibold text-slate-300">
                  Tags (comma-separated)
                </span>
                <input
                    v-model="form.tagsInput"
                    type="text"
                    placeholder="caz, footwear, free-mod"
                    class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </label>

              <label class="flex items-end pb-2 text-xs font-medium text-slate-200">
                <input v-model="form.is_published" type="checkbox" class="mr-2 accent-cyan-500" />
                <span>{{ t('Published on art3k.org', 'Pubblicata su art3k.org') }}</span>
              </label>
            </div>
          </div>

          <p v-if="errorMsg" class="mt-3 text-xs text-rose-300">{{ errorMsg }}</p>
          <p v-if="feedback" class="mt-3 text-xs font-semibold text-emerald-300">{{ feedback }}</p>

          <div class="mt-4 flex items-center justify-end gap-3">
            <button
                type="button"
                :disabled="saving"
                class="rounded-xl bg-clinical-teal px-5 py-2.5 text-xs font-bold text-white transition hover:bg-cyan-500 disabled:opacity-50"
                @click="saveNews"
            >
              {{ saving ? t('Saving...', 'Salvataggio...') : t('Save News Article', 'Salva News') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>