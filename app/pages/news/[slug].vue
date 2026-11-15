<script setup lang="ts">
import type { Database, StudioPost } from '~/types/database.types';

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
  title: () => (lang.value === 'it' ? post.value?.title_it || '' : post.value?.title_en || ''),
  description: () =>
    lang.value === 'it' ? post.value?.summary_it || '' : post.value?.summary_en || ''
});
</script>

<template>
  <NewsDetail v-if="post" :post="post" />
</template>
