<script setup lang="ts">
import type { Database, StudioSettings } from '~/types/database.types';

const props = defineProps<{
  settings: StudioSettings | null;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const supabase = useSupabaseClient<Database>();
const { t } = useLocale();

const patreonUrl = ref('');
const curseforgeUrl = ref('');
const taglineIt = ref('');
const taglineEn = ref('');
const heroBannerUrl = ref('');
const saving = ref(false);
const savedOk = ref(false);
const errorMsg = ref('');

watch(
  () => props.settings,
  (val) => {
    if (!val) return;
    patreonUrl.value = val.patreon_url || '';
    curseforgeUrl.value = val.curseforge_url || '';
    taglineIt.value = val.tagline_it || '';
    taglineEn.value = val.tagline_en || '';
    heroBannerUrl.value = val.hero_banner_url || '';
  },
  { immediate: true }
);

async function saveSettings() {
  saving.value = true;
  savedOk.value = false;
  errorMsg.value = '';

  const { error } = await supabase
    .from('studio_settings')
    .update({
      patreon_url: patreonUrl.value.trim(),
      curseforge_url: curseforgeUrl.value.trim() || null,
      tagline_it: taglineIt.value.trim(),
      tagline_en: taglineEn.value.trim(),
      hero_banner_url: heroBannerUrl.value.trim() || null
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
      {{ t('Global Studio Links & Banner', 'Link Globali Studio & Banner') }}
    </h2>

    <div class="mt-4 space-y-4">
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
            placeholder="https://www.curseforge.com/members/..."
            class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </label>
      </div>

      <label class="block space-y-1">
        <span class="text-xs font-semibold text-slate-300">Tagline (IT)</span>
        <input
          v-model="taglineIt"
          type="text"
          class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
        />
      </label>

      <label class="block space-y-1">
        <span class="text-xs font-semibold text-slate-300">Tagline (EN)</span>
        <input
          v-model="taglineEn"
          type="text"
          class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
        />
      </label>

      <label class="block space-y-1">
        <span class="text-xs font-semibold text-slate-300">Hero Banner URL</span>
        <input
          v-model="heroBannerUrl"
          type="url"
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
