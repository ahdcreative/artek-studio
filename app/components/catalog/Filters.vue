<script setup lang="ts">
type SectionFilter = 'ALL' | 'CAZ' | 'Build Mode';
type TierFilter = 'ALL' | 'FREE' | 'PATREON';
type StatusFilter = 'ALL' | '3' | '2' | '1' | '0';

const query = defineModel<string>('query', { required: true });
const sectionFilter = defineModel<SectionFilter>('sectionFilter', { required: true });
const tierFilter = defineModel<TierFilter>('tierFilter', { required: true });
const statusFilter = defineModel<StatusFilter>('statusFilter', { required: true });

defineProps<{
  filteredCount: number;
  totalCount: number;
}>();

const emit = defineEmits<{
  reset: [];
}>();

const { t } = useLocale();

const sectionOptions = computed<ReadonlyArray<{ val: SectionFilter; label: string }>>(() => [
  { val: 'ALL', label: t('All Sections', 'Tutto') },
  { val: 'CAZ', label: 'CAZ' },
  { val: 'Build Mode', label: t('Build Mode', 'Modalità Costruisci') }
]);

const tierOptions = computed<ReadonlyArray<{ val: TierFilter; label: string }>>(() => [
  { val: 'ALL', label: t('All Access', 'Tutti') },
  { val: 'FREE', label: t('100% Free', 'Gratis') },
  { val: 'PATREON', label: t('Early Access', 'Early Access') }
]);

const statusOptions = computed<ReadonlyArray<{ val: StatusFilter; label: string }>>(() => [
  { val: 'ALL', label: t('All Statuses', 'Tutti gli Stati') },
  { val: '3', label: t('Released', 'Rilasciate') },
  { val: '2', label: t('Coming Soon', 'In Arrivo') },
  { val: '1', label: t('In Development', 'In Sviluppo') },
  { val: '0', label: t('Planned', 'In Programma') }
]);

const hasActiveFilters = computed(
    () =>
        Boolean(query.value) ||
        sectionFilter.value !== 'ALL' ||
        tierFilter.value !== 'ALL' ||
        statusFilter.value !== 'ALL'
);
</script>

<template>
  <div class="my-8 space-y-4 rounded-2xl border border-clinical-border bg-clinical-surface/85 p-5">
    <div class="grid gap-4 md:grid-cols-12">
      <!-- Search -->
      <div class="relative md:col-span-5">
        <ArtekIcons
            name="LabSearchOutline"
            size="sm"
            color="cyan"
            class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
        />
        <input
            v-model="query"
            type="search"
            :placeholder="
            t(
              'Search scrubs, Calzuro, Scholl, Littmann, Kobold...',
              'Cerca scrub, Calzuro, Scholl, Littmann, Kobold...'
            )
          "
            class="w-full rounded-xl border border-clinical-border bg-clinical-canvas py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
        />
      </div>

      <!-- Section Filter -->
      <div class="flex flex-wrap items-center gap-1.5 md:col-span-4">
        <button
            v-for="opt in sectionOptions"
            :key="opt.val"
            type="button"
            class="rounded-xl px-3 py-2 text-xs font-semibold transition"
            :class="
            sectionFilter === opt.val
              ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
              : 'bg-clinical-canvas text-slate-300 hover:text-white'
          "
            @click="sectionFilter = opt.val"
        >
          {{ opt.label }}
        </button>
      </div>

      <!-- Access Filter -->
      <div class="flex flex-wrap items-center gap-1.5 md:col-span-3 md:justify-end">
        <button
            v-for="opt in tierOptions"
            :key="opt.val"
            type="button"
            class="rounded-xl px-3 py-2 text-xs font-semibold transition"
            :class="
            tierFilter === opt.val
              ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
              : 'bg-clinical-canvas text-slate-300 hover:text-white'
          "
            @click="tierFilter = opt.val"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Status Row -->
    <div
        class="flex flex-wrap items-center justify-between gap-3 border-t border-clinical-border/60 pt-3"
    >
      <div class="flex flex-wrap items-center gap-1.5">
        <button
            v-for="st in statusOptions"
            :key="st.val"
            type="button"
            class="rounded-lg px-2.5 py-1 text-xs font-medium transition"
            :class="
            statusFilter === st.val
              ? 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          "
            @click="statusFilter = st.val"
        >
          {{ st.label }}
        </button>
      </div>

      <div class="flex items-center gap-3 text-xs text-slate-400">
        <span class="font-mono">{{ filteredCount }} / {{ totalCount }}</span>
        <button
            v-if="hasActiveFilters"
            type="button"
            class="font-semibold text-cyan-300 hover:underline"
            @click="emit('reset')"
        >
          {{ t('Reset', 'Azzera') }}
        </button>
      </div>
    </div>
  </div>
</template>