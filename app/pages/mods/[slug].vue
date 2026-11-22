<script setup lang="ts">
import { getProjectSummary, getProjectTitle } from '~/composables/useStudioData';
import type { Database } from '~/types/database.types';
import type { StudioPost, StudioProject } from '~/types/studio.types';

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
      .in('platform', ['site', 'patreon'])
      .eq('is_published', true)
      .order('published_at', { ascending: false });
  return data ?? [];
});

useSeoMeta({
  title: () => (project.value ? getProjectTitle(project.value, lang.value) : ''),
  description: () => (project.value ? getProjectSummary(project.value, lang.value) : '')
});
</script>

<template>
  <ModsDetail v-if="project" :project="project" :related-posts="relatedPosts ?? []" />
</template>