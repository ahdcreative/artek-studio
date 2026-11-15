<script setup lang="ts">
const { t } = useLocale();
const { data: posts } = useStudioPosts();

const platformFilter = ref<'ALL' | 'patreon' | 'curseforge'>('ALL');

const filteredPosts = computed(() => {
  const list = posts.value ?? [];
  if (platformFilter.value === 'ALL') return list;
  return list.filter((p) => p.platform === platformFilter.value);
});
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div
      class="flex flex-col justify-between gap-4 border-b border-clinical-border/80 pb-8 sm:flex-row sm:items-end"
    >
      <div>
        <h1 class="text-3xl font-extrabold text-white sm:text-4xl">
          {{ t('Posts, Releases & Sneak Peeks', 'Post, Rilasci & Anteprime') }}
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-slate-400">
          {{
            t(
              'Every release announcement and CurseForge guide archived in bilingual English and Italian directly from our studio database.',
              'Tutti gli annunci Patreon e le schede CurseForge archiviate in formato bilingue direttamente dal database dello studio.'
            )
          }}
        </p>
      </div>

      <div
        class="flex items-center gap-1.5 rounded-xl border border-clinical-border bg-clinical-surface p-1"
      >
        <button
          v-for="tab in [
            { val: 'ALL', label: t('All', 'Tutti') },
            { val: 'patreon', label: 'Patreon' },
            { val: 'curseforge', label: 'CurseForge' }
          ]"
          :key="tab.val"
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
          :class="
            platformFilter === tab.val
              ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          "
          @click="platformFilter = tab.val as any"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <PostCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
    </div>
  </div>
</template>
