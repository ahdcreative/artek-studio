<script setup lang="ts">
import { getStudioDownloadsLabel } from '~/composables/useStudioData';
import type { Database, Json } from '~/types/database.types';
import { asJsonObject, type StudioSettings } from '~/types/studio.types';

const props = defineProps<{
  settings: StudioSettings | null;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const supabase = useSupabaseClient<Database>();
const { t } = useLocale();

const brandName = ref('');
const patreonUrl = ref('');
const curseforgeUrl = ref('');
const curseforgeDownloads = ref('7,000+');
const taglineIt = ref('');
const taglineEn = ref('');
const bioIt = ref('');
const bioEn = ref('');
const avatarUrl = ref('');
const heroBannerUrl = ref('');
const saving = ref(false);
const savedOk = ref(false);
const errorMsg = ref('');

watch(
    () => props.settings,
    (val) => {
      if (!val) return;
      brandName.value = val.brand_name || 'Artek Medical';
      patreonUrl.value = val.patreon_url || '';
      curseforgeUrl.value = val.curseforge_url || '';
      curseforgeDownloads.value = getStudioDownloadsLabel(val);
      taglineIt.value = val.tagline_it || '';
      taglineEn.value = val.tagline_en || '';
      bioIt.value = val.bio_it || '';
      bioEn.value = val.bio_en || '';
      avatarUrl.value = val.avatar_url || '';
      heroBannerUrl.value = val.hero_banner_url || '';
    },
    { immediate: true }
);

async function saveSettings() {
  saving.value = true;
  savedOk.value = false;
  errorMsg.value = '';

  const existingMeta = asJsonObject(props.settings?.metadata);
  const nextMetadata: Record<string, Json> = {};
  for (const [key, value] of Object.entries(existingMeta)) {
    if (value !== undefined) {
      nextMetadata[key] = value;
    }
  }
  nextMetadata.curseforge_downloads = curseforgeDownloads.value.trim() || '7,000+';

  const { error } = await supabase
      .from('studio_settings')
      .update({
        brand_name: brandName.value.trim() || 'Artek Medical',
        patreon_url: patreonUrl.value.trim(),
        curseforge_url: curseforgeUrl.value.trim() || null,
        tagline_it: taglineIt.value.trim(),
        tagline_en: taglineEn.value.trim(),
        bio_it: bioIt.value.trim(),
        bio_en: bioEn.value.trim(),
        avatar_url: avatarUrl.value.trim() || null,
        hero_banner_url: heroBannerUrl.value.trim() || null,
        metadata: nextMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', 'art3k');

  saving.value = false;
  if (error) {
    errorMsg.value = error.message;
    return;
  }

  savedOk.value = true;
  emit('updated');
}
</script>

<template>
  <div class="max-w-3xl rounded-2xl border border-clinical-border bg-clinical-surface/90 p-6">
    <h2 class="text-base font-bold text-white">
      {{ t('Global Studio Brand, Links & Media', 'Brand Studio, Link Globali & Media') }}
    </h2>

    <div class="mt-4 space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block space-y-1">
          <span class="text-xs font-semibold text-cyan-200">Brand Name</span>
          <input
              v-model="brandName"
              type="text"
              placeholder="Artek Medical"
              class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <label class="block space-y-1">
          <span class="text-xs font-semibold text-amber-200">CurseForge Downloads Badge</span>
          <input
              v-model="curseforgeDownloads"
              type="text"
              placeholder="7,000+"
              class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
          />
        </label>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block space-y-1">
          <span class="text-xs font-semibold text-rose-200">Studio Patreon URL</span>
          <input
              v-model="patreonUrl"
              type="url"
              class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <label class="block space-y-1">
          <span class="text-xs font-semibold text-amber-200">Studio CurseForge Profile URL</span>
          <input
              v-model="curseforgeUrl"
              type="url"
              placeholder="https://www.curseforge.com/members/darkarteks/projects"
              class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </label>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block space-y-1">
          <span class="text-xs font-semibold text-slate-300">Avatar Logo URL (preview)</span>
          <input
              v-model="avatarUrl"
              type="url"
              placeholder="https://...supabase.co/storage/v1/object/public/preview/..."
              class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <label class="block space-y-1">
          <span class="text-xs font-semibold text-slate-300">Hero 4:1 Banner URL (preview)</span>
          <input
              v-model="heroBannerUrl"
              type="url"
              placeholder="https://...supabase.co/storage/v1/object/public/preview/..."
              class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </label>
      </div>

      <label class="block space-y-1">
        <span class="text-xs font-semibold text-slate-300">Tagline (EN)</span>
        <input
            v-model="taglineEn"
            type="text"
            class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
        />
      </label>

      <label class="block space-y-1">
        <span class="text-xs font-semibold text-slate-300">Tagline (IT)</span>
        <input
            v-model="taglineIt"
            type="text"
            class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
        />
      </label>

      <label class="block space-y-1">
        <span class="text-xs font-semibold text-slate-300">Bio (EN)</span>
        <textarea
            v-model="bioEn"
            rows="2"
            class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
        />
      </label>

      <label class="block space-y-1">
        <span class="text-xs font-semibold text-slate-300">Bio (IT)</span>
        <textarea
            v-model="bioIt"
            rows="2"
            class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
        />
      </label>

      <p v-if="errorMsg" class="text-xs text-rose-300">{{ errorMsg }}</p>
      <p v-if="savedOk" class="text-xs font-semibold text-emerald-300">
        {{ t('Studio settings saved!', 'Impostazioni salvate!') }}
      </p>

      <div class="flex justify-end">
        <button
            type="button"
            :disabled="saving"
            class="rounded-xl bg-clinical-teal px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 disabled:opacity-50"
            @click="saveSettings"
        >
          {{ saving ? t('Saving...', 'Salvo...') : t('Save Settings', 'Salva Impostazioni') }}
        </button>
      </div>
    </div>
  </div>
</template>