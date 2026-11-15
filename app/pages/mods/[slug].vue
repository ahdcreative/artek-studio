<script setup lang="ts">
import type { Database, StudioPost, StudioProject } from '~/types/database.types';

const route = useRoute();
const slug = String(route.params.slug);
const supabase = useSupabaseClient<Database>();
const { lang } = useLocale();

const { data: project } = await useAsyncData<StudioProject | null>(`mod-${slug}`, async () => {
  const { data } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
  return data;
});

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Mod not found' });
}

const { data: relatedPosts } = await useAsyncData<StudioPost[]>(`mod-posts-${slug}`, async () => {
  const { data } = await supabase
    .from('studio_posts')
    .select('*')
    .eq('project_slug', slug)
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  return data ?? [];
});

useSeoMeta({
  title: () =>
    lang.value === 'it' && project.value?.metadata?.raw_title_it
      ? String(project.value.metadata.raw_title_it)
      : project.value?.title || '',
  description: () =>
    lang.value === 'it'
      ? project.value?.summary_it || project.value?.notes || ''
      : project.value?.summary_en || project.value?.notes || ''
});
</script>

<template>
  <ModsDetail v-if="project" :project="project" :related-posts="relatedPosts ?? []" />
</template>
