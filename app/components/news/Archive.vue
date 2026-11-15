<script setup lang="ts">
const { t } = useLocale();
const { data: posts } = useStudioPosts();

const typeFilter = ref<'ALL' | 'release' | 'preview' | 'update'>('ALL');

const filteredPosts = computed(() => {
  const list = posts.value ?? [];
  if (typeFilter.value === 'ALL') return list;
  return list.filter((p) => p.post_type === typeFilter.value);
});
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div
      class="flex flex-col justify-between gap-4 border-b border-clinical-border/80 pb-8 sm:flex-row sm:items-end"
    >
      <div>
        <div
          class="mb-1 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400"
        >
          <ArtekIcons name="MedicalRecordsOutline" size="sm" color="cyan" />
          <span>{{ t('Studio Journal', 'Giornale di Studio') }}</span>
        </div>
        <h1 class="text-3xl font-extrabold text-white sm:text-4xl">
          {{ t('Studio News & Releases', 'News & Rilasci dello Studio') }}
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-slate-400">
          {{
            t(
              'Editorial release highlights and development previews written for art3k.org — each article links directly to its mod page.',
              'Articoli editoriali sui rilasci e sulle anteprime in sviluppo su art3k.org: ogni news rimanda direttamente alla scheda mod interna.'
            )
          }}
        </p>
      </div>

      <div
        class="flex flex-wrap items-center gap-1.5 rounded-xl border border-clinical-border bg-clinical-surface p-1"
      >
        <button
          v-for="tab in [
            { val: 'ALL', label: t('All', 'Tutte') },
            { val: 'release', label: t('Releases', 'Rilasci') },
            { val: 'preview', label: t('Previews', 'Anteprime') },
            { val: 'update', label: t('Updates', 'Aggiornamenti') }
          ]"
          :key="tab.val"
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
          :class="
            typeFilter === tab.val
              ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          "
          @click="typeFilter = tab.val as any"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div v-if="filteredPosts.length" class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <PostCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
    </div>

    <div
      v-else
      class="mt-10 rounded-2xl border border-clinical-border bg-clinical-surface/60 p-10 text-center text-sm text-slate-400"
    >
      {{ t('No studio news articles match this filter yet.', 'Nessuna news corrisponde a questo filtro.') }}
    </div>
  </div>
</template>
