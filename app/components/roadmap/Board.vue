<script setup lang="ts">
const { lang, t } = useLocale();
const { data: projects } = useStudioProjects();

const lanes = computed(() => {
  const list = projects.value ?? [];
  return [
    {
      status: 3,
      title: t('Released', 'Rilasciate'),
      accent: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300',
      items: list.filter((p) => p.status === 3)
    },
    {
      status: 2,
      title: t('Ready / Packaged in ModKit', 'Pronte / Pacchettizzate ModKit'),
      accent: 'border-cyan-500/35 bg-cyan-500/10 text-cyan-300',
      items: list.filter((p) => p.status === 2)
    },
    {
      status: 1,
      title: t('In Active Workbench', 'In Lavorazione Attiva'),
      accent: 'border-amber-500/35 bg-amber-500/10 text-amber-300',
      items: list.filter((p) => p.status === 1)
    },
    {
      status: 0,
      title: t('Sourced / Planned', 'Sorgenti / In Programma'),
      accent: 'border-slate-500/35 bg-slate-500/10 text-slate-300',
      items: list.filter((p) => p.status === 0)
    }
  ];
});
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="space-y-2 border-b border-clinical-border/80 pb-8">
      <h1 class="text-3xl font-extrabold text-white sm:text-4xl">
        {{ t('Hospital Ecosystem Roadmap', 'Pipeline & Cantiere Studio') }}
      </h1>
      <p class="max-w-2xl text-sm text-slate-400">
        {{
          t(
            'Real-time production status across every CAZ uniform, diagnostic instrument, and clinical room prop.',
            'Avanzamento di produzione in tempo reale per tutte le divise CAZ, strumenti diagnostici e arredi clinici.'
          )
        }}
      </p>
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <section
        v-for="lane in lanes"
        :key="lane.status"
        class="flex flex-col rounded-3xl border border-clinical-border bg-clinical-surface/80 p-5"
      >
        <div
          class="mb-4 flex items-center justify-between gap-3 border-b border-clinical-border/70 pb-3"
        >
          <h2 class="text-base font-bold text-white">{{ lane.title }}</h2>
          <span
            class="rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold"
            :class="lane.accent"
          >
            {{ lane.items.length }}
          </span>
        </div>

        <div class="space-y-2.5">
          <NuxtLink
            v-for="item in lane.items"
            :key="item.slug"
            :to="`/mods/${item.slug}`"
            class="flex items-center justify-between gap-3 rounded-xl border border-clinical-border/70 bg-clinical-canvas/75 px-3.5 py-2.5 transition hover:border-cyan-500/45"
          >
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-white">
                {{
                  lang === 'it' && item.metadata?.raw_title_it
                    ? String(item.metadata.raw_title_it)
                    : item.title
                }}
              </div>
              <div class="truncate font-mono text-[11px] text-slate-500">
                {{ item.section }} • {{ item.modkit_project || item.category }}
              </div>
            </div>

            <span
              class="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
              :class="
                item.is_free ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/20 text-rose-200'
              "
            >
              {{ item.is_free ? t('Free', 'Gratis') : 'Patreon' }}
            </span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
