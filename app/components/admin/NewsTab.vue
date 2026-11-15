<script setup lang="ts">
import type { Database, StudioPost, StudioProject } from '~/types/database.types';

const props = defineProps<{
  projects: StudioProject[];
}>();

const emit = defineEmits<{
  updated: [];
}>();

const supabase = useSupabaseClient<Database>();
const { t } = useLocale();

const newsList = ref<StudioPost[]>([]);
const loadingList = ref(false);
const saving = ref(false);
const feedback = ref('');
const errorMsg = ref('');
const confirmDeleteSlug = ref('');

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
    .eq('platform', 'site')
    .order('published_at', { ascending: false });

  loadingList.value = false;
  if (error) {
    errorMsg.value = error.message;
    return;
  }
  newsList.value = data ?? [];
}

onMounted(loadNews);

function startCreate() {
  Object.assign(form, emptyForm());
  isEditingExisting.value = false;
  feedback.value = '';
  errorMsg.value = '';
}

function loadIntoEditor(item: StudioPost) {
  form.slug = item.slug;
  form.project_slug = item.project_slug || '';
  form.post_type = item.post_type || 'release';
  form.is_published = item.is_published;
  form.cover_url = item.cover_url || '';
  form.title_it = item.title_it;
  form.title_en = item.title_en;
  form.summary_it = item.summary_it || '';
  form.summary_en = item.summary_en || '';
  form.body_it = item.body_it;
  form.body_en = item.body_en;
  form.tagsInput = (item.tags ?? []).join(', ');
  isEditingExisting.value = true;
  feedback.value = '';
  errorMsg.value = '';
}

async function saveNews() {
  errorMsg.value = '';
  feedback.value = '';

  const cleanSlug = form.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
  if (!cleanSlug || !form.title_it.trim() || !form.title_en.trim() || !form.body_it.trim() || !form.body_en.trim()) {
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
  await loadNews();
  emit('updated');
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-12">
    <!-- Left List -->
    <div class="space-y-3 lg:col-span-5">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-white">
          {{ t('Published & Draft Site News', 'News dello Studio (Sito)') }}
        </h2>
        <button
          type="button"
          class="rounded-xl bg-clinical-teal px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-500"
          @click="startCreate"
        >
          + {{ t('New Article', 'Nuova News') }}
        </button>
      </div>

      <div v-if="loadingList" class="text-xs text-slate-400">
        {{ t('Loading...', 'Caricamento...') }}
      </div>

      <div class="space-y-2.5">
        <div
          v-for="item in newsList"
          :key="item.slug"
          class="rounded-2xl border border-clinical-border bg-clinical-surface/90 p-4"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="rounded bg-cyan-500/15 px-2 py-0.5 font-mono text-[10px] uppercase text-cyan-300">
                  {{ item.post_type }}
                </span>
                <span
                  v-if="!item.is_published"
                  class="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] text-amber-200"
                >
                  Draft
                </span>
              </div>
              <h3 class="mt-1.5 text-xs font-bold text-white">{{ item.title_it }}</h3>
              <p class="mt-0.5 font-mono text-[10px] text-slate-500">
                /news/{{ item.slug }} → {{ item.project_slug || 'catalog' }}
              </p>
            </div>
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <button
              type="button"
              class="rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-2.5 py-1 font-semibold text-cyan-300 hover:bg-cyan-500/20"
              @click="loadIntoEditor(item)"
            >
              {{ t('Edit', 'Modifica') }}
            </button>
            <NuxtLink
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

    <!-- Right Editor -->
    <div class="rounded-2xl border border-clinical-border bg-clinical-surface/90 p-5 lg:col-span-7">
      <h2 class="text-base font-bold text-white">
        {{
          isEditingExisting
            ? t('Edit Site News Article', 'Modifica Articolo News')
            : t('Create Site News Article', 'Crea Nuova News per il Sito')
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
            <option value="">{{ t('General Studio / Catalog', 'Generale / Catalogo') }}</option>
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
            rows="5"
            class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 font-mono text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <label class="block space-y-1">
          <span class="text-[11px] font-semibold text-slate-300">Markdown Body (EN)</span>
          <textarea
            v-model="form.body_en"
            rows="5"
            class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 font-mono text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <div class="grid gap-3 sm:grid-cols-2">
          <label class="block space-y-1">
            <span class="text-[11px] font-semibold text-slate-300">Tags (comma-separated)</span>
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
</template>
