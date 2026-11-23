<script setup lang="ts">
import type { Database, Json } from '~/types/database.types';
import type { StudioPost, StudioProject } from '~/types/studio.types';

const STORAGE_BUCKET = 'previews';
const MAX_FILE_BYTES = 8 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif'
};

const props = defineProps<{
  post: StudioPost;
  projects: StudioProject[];
}>();

const emit = defineEmits<{
  saved: [];
  close: [];
}>();

const supabase = useSupabaseClient<Database>();
const { t } = useLocale();

const fileInputRef = ref<HTMLInputElement | null>(null);
const coverUrl = ref('');
const projectSlug = ref('');
const postType = ref('release');
const isEarlyAccess = ref(false);
const isPublished = ref(true);

const uploading = ref(false);
const saving = ref(false);
const feedback = ref('');
const errorMsg = ref('');

watch(
    () => props.post,
    (item) => {
      coverUrl.value = item.cover_url || '';
      projectSlug.value = item.project_slug || '';
      postType.value = item.post_type || 'release';
      isEarlyAccess.value = Boolean(item.is_early_access);
      isPublished.value = item.is_published;
      feedback.value = '';
      errorMsg.value = '';
    },
    { immediate: true }
);

const patreonPostId = computed(() =>
    props.post.slug.startsWith('patreon-')
        ? props.post.slug.slice('patreon-'.length)
        : props.post.slug
);

function withEditorialOverride(raw: Json): Json {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return { ...raw, editorial_override: true };
  }
  return { editorial_override: true };
}

function triggerFileDialog() {
  fileInputRef.value?.click();
}

async function persistChanges(nextCoverUrl?: string) {
  saving.value = true;
  errorMsg.value = '';
  feedback.value = '';

  const targetCover = (nextCoverUrl !== undefined ? nextCoverUrl : coverUrl.value).trim() || null;

  const { error } = await supabase
      .from('studio_posts')
      .update({
        cover_url: targetCover,
        project_slug: projectSlug.value || null,
        post_type: postType.value,
        is_early_access: isEarlyAccess.value,
        tier_name: isEarlyAccess.value ? 'Chief of Medicine / Early Access' : null,
        is_published: isPublished.value,
        metadata: withEditorialOverride(props.post.metadata),
        updated_at: new Date().toISOString()
      })
      .eq('slug', props.post.slug);

  saving.value = false;

  if (error) {
    errorMsg.value = error.message;
    return false;
  }

  coverUrl.value = targetCover || '';
  feedback.value = t(
      'Patreon post updated (protected from future sync overwrites).',
      'Post Patreon aggiornato (protetto dai futuri sync).'
  );
  emit('saved');
  return true;
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];
  if (!file) return;

  errorMsg.value = '';
  feedback.value = '';

  const ext = MIME_TO_EXT[file.type.toLowerCase()];
  if (!ext) {
    errorMsg.value = t(
        'Unsupported image format. Use JPG, PNG, WebP, GIF, or AVIF.',
        'Formato non supportato. Usa JPG, PNG, WebP, GIF o AVIF.'
    );
    input.value = '';
    return;
  }

  if (file.size > MAX_FILE_BYTES) {
    errorMsg.value = t('File too large (max 8 MB).', 'File troppo grande (massimo 8 MB).');
    input.value = '';
    return;
  }

  uploading.value = true;
  const storagePath = `patreon/${patreonPostId.value}/cover.${ext}`;

  const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: true
      });

  uploading.value = false;
  input.value = '';

  if (uploadError) {
    errorMsg.value = t(
        `Upload failed (${uploadError.message}). Check Storage INSERT/UPDATE policy on "${STORAGE_BUCKET}".`,
        `Upload fallito (${uploadError.message}). Verifica le policy INSERT/UPDATE sul bucket "${STORAGE_BUCKET}".`
    );
    return;
  }

  const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
  const versionedUrl = `${publicData.publicUrl}?v=${Date.now()}`;
  coverUrl.value = versionedUrl;

  await persistChanges(versionedUrl);
}
</script>

<template>
  <div class="rounded-2xl border border-rose-500/35 bg-clinical-surface/90 p-5">
    <div
        class="flex flex-wrap items-start justify-between gap-3 border-b border-clinical-border/70 pb-4"
    >
      <div class="min-w-0 space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <span
              class="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-rose-200"
          >
            Patreon Post
          </span>
          <span class="font-mono text-[10px] text-slate-400">
            {{ post.slug }}
          </span>
        </div>
        <h2 class="text-base font-bold text-white">
          {{ post.title_en || post.title_it }}
        </h2>
      </div>

      <div class="flex items-center gap-2">
        <a
            v-if="post.external_url"
            :href="post.external_url"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg border border-rose-500/35 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-200 hover:bg-rose-500/20"
        >
          Patreon ↗
        </a>
        <button
            type="button"
            class="rounded-lg border border-clinical-border bg-clinical-canvas px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white"
            @click="emit('close')"
        >
          {{ t('Close', 'Chiudi') }}
        </button>
      </div>
    </div>

    <!-- Cover Preview + Direct Upload -->
    <div class="mt-4 space-y-3">
      <div
          class="relative aspect-video w-full overflow-hidden rounded-xl border border-clinical-border bg-clinical-canvas"
      >
        <img
            v-if="coverUrl"
            :src="coverUrl"
            :alt="post.title_en || post.title_it"
            class="h-full w-full object-contain"
        />
        <div
            v-else
            class="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center"
        >
          <ArtekIcons name="MedicalRecordsOutline" size="xl" color="cyan" class="opacity-45" />
          <span class="text-xs text-slate-400">
            {{
              t(
                  'No cover synced from Patreon API (native gallery/thumbnail post). Upload one below.',
                  'Nessuna cover importata dalle API Patreon (gallery/thumbnail nativa). Caricala qui sotto.'
              )
            }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <input
            ref="fileInputRef"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            class="hidden"
            @change="handleFileChange"
        />

        <button
            type="button"
            :disabled="uploading || saving"
            class="rounded-xl bg-clinical-teal px-4 py-2 text-xs font-bold text-white transition hover:bg-cyan-500 disabled:opacity-50"
            @click="triggerFileDialog"
        >
          {{
            uploading
                ? t('Uploading to previews...', 'Caricamento su previews...')
                : t('Upload Cover to "previews" ↑', 'Carica Cover su "previews" ↑')
          }}
        </button>

        <span class="font-mono text-[10px] text-slate-500">
          previews/patreon/{{ patreonPostId }}/cover.*
        </span>
      </div>
    </div>

    <!-- Editable Overrides -->
    <div class="mt-5 space-y-4 border-t border-clinical-border/60 pt-4">
      <label class="block space-y-1">
        <span class="text-[11px] font-semibold text-slate-300">
          {{ t('Cover Image URL (auto-filled on upload)', 'URL Cover (compilato in automatico)') }}
        </span>
        <input
            v-model="coverUrl"
            type="url"
            placeholder="https://...supabase.co/storage/v1/object/public/previews/..."
            class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
        />
      </label>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block space-y-1">
          <span class="text-[11px] font-semibold text-emerald-300">
            {{ t('Linked Mod on art3k.org', 'Mod Collegata su art3k.org') }}
          </span>
          <select
              v-model="projectSlug"
              class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="">
              {{ t('None (General Studio Post)', 'Nessuna (Post Generale)') }}
            </option>
            <option v-for="proj in props.projects" :key="proj.slug" :value="proj.slug">
              {{ proj.slug }} — {{ proj.title }}
            </option>
          </select>
        </label>

        <label class="block space-y-1">
          <span class="text-[11px] font-semibold text-slate-300">
            {{ t('Post Type', 'Tipo Post') }}
          </span>
          <select
              v-model="postType"
              class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="release">release</option>
            <option value="preview">preview</option>
            <option value="update">update</option>
          </select>
        </label>
      </div>

      <div class="flex flex-wrap items-center gap-6 pt-1">
        <label class="flex items-center text-xs font-semibold text-amber-200">
          <input v-model="isEarlyAccess" type="checkbox" class="mr-2 accent-amber-400" />
          <span>{{ t('Early Access (14-Day Tier)', 'Early Access (Tier 14gg)') }}</span>
        </label>

        <label class="flex items-center text-xs font-medium text-slate-200">
          <input v-model="isPublished" type="checkbox" class="mr-2 accent-cyan-500" />
          <span>{{ t('Visible on art3k.org', 'Visibile su art3k.org') }}</span>
        </label>
      </div>
    </div>

    <p v-if="errorMsg" class="mt-3 text-xs text-rose-300">{{ errorMsg }}</p>
    <p v-if="feedback" class="mt-3 text-xs font-semibold text-emerald-300">{{ feedback }}</p>

    <div class="mt-5 flex items-center justify-end gap-3">
      <button
          type="button"
          :disabled="saving || uploading"
          class="rounded-xl bg-clinical-teal px-5 py-2.5 text-xs font-bold text-white transition hover:bg-cyan-500 disabled:opacity-50"
          @click="persistChanges()"
      >
        {{ saving ? t('Saving...', 'Salvataggio...') : t('Save Changes', 'Salva Modifiche') }}
      </button>
    </div>
  </div>
</template>