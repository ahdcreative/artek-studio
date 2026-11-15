<script setup lang="ts">
import type { Database, StudioProject } from '~/types/database.types';

const props = defineProps<{
  projects: StudioProject[];
  initialSearch?: string;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const supabase = useSupabaseClient<Database>();
const { lang, t } = useLocale();

const search = ref(props.initialSearch || '');
const filterMode = ref<'ALL' | 'MISSING_LINKS' | 'RELEASED' | 'IN_PROGRESS'>('ALL');

watch(
  () => props.initialSearch,
  (val) => {
    if (val) search.value = val;
  }
);

interface EditableProject {
  id: string;
  slug: string;
  title: string;
  modkit_project: string | null;
  section: string | null;
  patreon_url: string;
  curseforge_url: string;
  preview_url: string;
  status: number;
  is_free: boolean;
  tier_price_eur: string;
  featured: boolean;
  is_published: boolean;
  saving: boolean;
  savedOk: boolean;
  errorMsg: string;
}

const drafts = reactive<Record<string, EditableProject>>({});

watch(
  () => props.projects,
  (list) => {
    for (const p of list) {
      drafts[p.slug] = {
        id: p.id,
        slug: p.slug,
        title:
          lang.value === 'it' && p.metadata?.raw_title_it
            ? String(p.metadata.raw_title_it)
            : p.title,
        modkit_project: p.modkit_project,
        section: p.section,
        patreon_url: p.patreon_url || '',
        curseforge_url: p.curseforge_url || '',
        preview_url: p.preview_url || '',
        status: p.status,
        is_free: Boolean(p.is_free),
        tier_price_eur: p.tier_price_eur !== null && p.tier_price_eur !== undefined ? String(p.tier_price_eur) : '',
        featured: Boolean(p.featured),
        is_published: p.is_published !== false,
        saving: false,
        savedOk: false,
        errorMsg: ''
      };
    }
  },
  { immediate: true, deep: true }
);

const filteredDrafts = computed(() => {
  const q = search.value.trim().toLowerCase();
  return props.projects
    .map((p) => drafts[p.slug])
    .filter((row): row is EditableProject => {
      if (!row) return false;
      if (filterMode.value === 'MISSING_LINKS' && row.patreon_url && row.curseforge_url) {
        return false;
      }
      if (filterMode.value === 'RELEASED' && row.status !== 3) return false;
      if (filterMode.value === 'IN_PROGRESS' && row.status !== 1 && row.status !== 2) {
        return false;
      }
      if (!q) return true;
      return (
        row.slug.toLowerCase().includes(q) ||
        row.title.toLowerCase().includes(q) ||
        (row.modkit_project || '').toLowerCase().includes(q)
      );
    });
});

async function saveRow(row: EditableProject) {
  row.saving = true;
  row.savedOk = false;
  row.errorMsg = '';

  const parsedPrice =
    !row.is_free && row.tier_price_eur.trim() ? Number(row.tier_price_eur.trim()) : null;

  const { error } = await supabase
    .from('projects')
    .update({
      patreon_url: row.patreon_url.trim() || null,
      curseforge_url: row.curseforge_url.trim() || null,
      preview_url: row.preview_url.trim() || null,
      status: Number(row.status),
      is_free: row.is_free,
      tier_price_eur: parsedPrice !== null && !Number.isNaN(parsedPrice) ? parsedPrice : null,
      featured: row.featured,
      is_published: row.is_published
    })
    .eq('id', row.id);

  row.saving = false;
  if (error) {
    row.errorMsg = error.message;
    return;
  }

  row.savedOk = true;
  emit('updated');
  setTimeout(() => {
    row.savedOk = false;
  }, 2500);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Filter Bar -->
    <div
      class="flex flex-col gap-3 rounded-2xl border border-clinical-border bg-clinical-surface/85 p-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="relative flex-1">
        <ArtekIcons
          name="LabSearchOutline"
          size="sm"
          color="cyan"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
        />
        <input
          v-model="search"
          type="search"
          :placeholder="t('Search mod by name, slug, or ModKit package...', 'Cerca mod per nome, slug o pacchetto ModKit...')"
          class="w-full rounded-xl border border-clinical-border bg-clinical-canvas py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div class="flex flex-wrap items-center gap-1.5">
        <button
          v-for="tab in [
            { val: 'ALL', label: t('All', 'Tutte') },
            { val: 'MISSING_LINKS', label: t('Missing Links', 'Link Mancanti') },
            { val: 'RELEASED', label: t('Released', 'Rilasciate') },
            { val: 'IN_PROGRESS', label: t('Workbench / Ready', 'In Lavorazione / Pronte') }
          ]"
          :key="tab.val"
          type="button"
          class="rounded-xl px-3 py-1.5 text-xs font-semibold transition"
          :class="
            filterMode === tab.val
              ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
              : 'border border-clinical-border bg-clinical-canvas text-slate-400 hover:text-white'
          "
          @click="filterMode = tab.val as any"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="text-xs text-slate-400">
      {{ t('Showing', 'Visualizzate') }} <strong class="text-white">{{ filteredDrafts.length }}</strong>
      {{ t('projects', 'mod') }}
    </div>

    <!-- Editable Project Rows -->
    <div class="space-y-4">
      <div
        v-for="row in filteredDrafts"
        :key="row.id"
        class="rounded-2xl border border-clinical-border bg-clinical-surface/90 p-5 transition hover:border-cyan-500/35"
      >
        <div class="flex flex-wrap items-start justify-between gap-3 border-b border-clinical-border/70 pb-3">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-sm font-bold text-white">{{ row.title }}</h3>
              <span
                class="rounded-md border border-clinical-border bg-clinical-canvas px-2 py-0.5 font-mono text-[10px] text-slate-400"
              >
                {{ row.slug }}
              </span>
              <span
                v-if="row.section"
                class="rounded-md bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-300"
              >
                {{ row.section }}
              </span>
            </div>
            <p v-if="row.modkit_project" class="mt-1 font-mono text-[11px] text-slate-500">
              ModKit: {{ row.modkit_project }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <NuxtLink
              :to="`/mods/${row.slug}`"
              target="_blank"
              class="rounded-lg border border-clinical-border bg-clinical-canvas px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300"
            >
              {{ t('View Mod ↗', 'Apri Scheda ↗') }}
            </NuxtLink>

            <button
              type="button"
              :disabled="row.saving"
              class="rounded-xl bg-clinical-teal px-4 py-1.5 text-xs font-bold text-white transition hover:bg-cyan-500 disabled:opacity-50"
              @click="saveRow(row)"
            >
              {{ row.saving ? t('Saving...', 'Salvo...') : t('Save', 'Salva') }}
            </button>
          </div>
        </div>

        <div class="mt-4 grid gap-3 md:grid-cols-2">
          <label class="block space-y-1">
            <span class="text-[11px] font-semibold text-rose-200">Patreon URL</span>
            <input
              v-model="row.patreon_url"
              type="url"
              placeholder="https://www.patreon.com/posts/..."
              class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-rose-400 focus:outline-none"
            />
          </label>

          <label class="block space-y-1">
            <span class="text-[11px] font-semibold text-amber-200">CurseForge URL</span>
            <input
              v-model="row.curseforge_url"
              type="url"
              placeholder="https://www.curseforge.com/inzoi/..."
              class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
            />
          </label>

          <label class="block space-y-1">
            <span class="text-[11px] font-semibold text-slate-300">Preview Image URL</span>
            <input
              v-model="row.preview_url"
              type="url"
              placeholder="https://...supabase.co/storage/v1/object/public/previews/..."
              class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
            />
          </label>

          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <label class="col-span-2 block space-y-1">
              <span class="text-[11px] font-semibold text-slate-300">{{ t('Status', 'Stato') }}</span>
              <select
                v-model.number="row.status"
                class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-2.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option :value="0">0 • {{ t('Planned', 'In Programma') }}</option>
                <option :value="1">1 • {{ t('In Progress', 'In Lavorazione') }}</option>
                <option :value="2">2 • {{ t('Ready in ModKit', 'Pronta nel ModKit') }}</option>
                <option :value="3">3 • {{ t('Released', 'Rilasciata') }}</option>
              </select>
            </label>

            <label class="block space-y-1">
              <span class="text-[11px] font-semibold text-slate-300">Tier €</span>
              <input
                v-model="row.tier_price_eur"
                :disabled="row.is_free"
                type="number"
                step="0.5"
                min="0"
                placeholder="3.00"
                class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-2.5 py-2 text-xs text-white disabled:opacity-40 focus:border-cyan-500 focus:outline-none"
              />
            </label>

            <div class="flex flex-col justify-end gap-1.5 pb-1 text-[11px] text-slate-300">
              <label class="inline-flex cursor-pointer items-center gap-1.5">
                <input v-model="row.is_free" type="checkbox" class="accent-cyan-500" />
                <span>{{ t('Free', 'Gratis') }}</span>
              </label>
              <label class="inline-flex cursor-pointer items-center gap-1.5">
                <input v-model="row.featured" type="checkbox" class="accent-cyan-500" />
                <span>Featured</span>
              </label>
              <label class="inline-flex cursor-pointer items-center gap-1.5">
                <input v-model="row.is_published" type="checkbox" class="accent-cyan-500" />
                <span>{{ t('Visible', 'Visibile') }}</span>
              </label>
            </div>
          </div>
        </div>

        <p v-if="row.errorMsg" class="mt-2 text-xs text-rose-300">{{ row.errorMsg }}</p>
        <p v-if="row.savedOk" class="mt-2 text-xs font-semibold text-emerald-300">
          {{ t('Saved cleanly to Supabase.', 'Salvato correttamente su Supabase.') }}
        </p>
      </div>
    </div>
  </div>
</template>
