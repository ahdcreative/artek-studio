<script setup lang="ts">
import { formatPlainSummary } from '~/composables/useStudioData';
import type { Database } from '~/types/database.types';
import type { StudioPost } from '~/types/studio.types';

const route = useRoute();
const slug = String(route.params.slug);
const supabase = useSupabaseClient<Database>();
const { lang } = useLocale();

const { data: post } = await useAsyncData<StudioPost | null>(`news-${slug}`, async () => {
  const { data } = await supabase
      .from('studio_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
  return data;
});

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'News article not found' });
}

useSeoMeta({
  title: () =>
      lang.value === 'it'
          ? post.value?.title_it || post.value?.title_en || ''
          : post.value?.title_en || post.value?.title_it || '',
  description: () =>
      formatPlainSummary(
          lang.value === 'it'
              ? post.value?.summary_it || post.value?.summary_en || ''
              : post.value?.summary_en || post.value?.summary_it || ''
      ),
  robots: () => (post.value?.platform === 'patreon' ? 'noindex, follow' : 'index, follow')
});
</script>

<template>
  <NewsDetail v-if="post" :post="post" />
</template>