<script setup lang="ts">
const { t } = useLocale();
const { data: posts } = useStudioPosts();

const latestPosts = computed(() => (posts.value ?? []).slice(0, 3));
</script>

<template>
  <section class="border-t border-clinical-border/80 bg-clinical-surface/35">
    <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div
            class="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400"
          >
            <ArtekIcons name="MedicalRecordsOutline" size="sm" color="cyan" />
            <span>{{ t('Studio Logbook', 'Diario di Studio') }}</span>
          </div>
          <h2 class="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            {{ t('Latest Studio News & Releases', 'Ultime News & Rilasci dello Studio') }}
          </h2>
        </div>

        <NuxtLink
          to="/news"
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          <span>{{ t('All studio news →', 'Tutte le news →') }}</span>
        </NuxtLink>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <PostCard v-for="post in latestPosts" :key="post.slug" :post="post" />
      </div>
    </div>
  </section>
</template>
