import type { Database, StudioPost, StudioProject, StudioSettings } from '~/types/database.types';

export function getStatusLabel(status: number, lang: 'en' | 'it'): string {
  switch (status) {
    case 3:
      return lang === 'it' ? 'Rilasciata' : 'Released';
    case 2:
      return lang === 'it' ? 'Pronta nel ModKit' : 'Ready in ModKit';
    case 1:
      return lang === 'it' ? 'In Lavorazione' : 'In Progress';
    default:
      return lang === 'it' ? 'In Programma' : 'Planned';
  }
}

export function getStatusBadgeClass(status: number): string {
  switch (status) {
    case 3:
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 2:
      return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    case 1:
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    default:
      return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
  }
}

export function useStudioSettings() {
  const supabase = useSupabaseClient<Database>();
  return useAsyncData<StudioSettings | null>('studio-settings', async () => {
    const { data, error } = await supabase
      .from('studio_settings')
      .select('*')
      .eq('id', 'art3k')
      .maybeSingle();

    if (error) {
      console.error('Failed to load studio_settings:', error.message);
      return null;
    }
    return data;
  });
}

export function useStudioProjects() {
  const supabase = useSupabaseClient<Database>();
  return useAsyncData<StudioProject[]>('studio-projects', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to load projects:', error.message);
      return [];
    }
    return data ?? [];
  });
}

export function useStudioPosts() {
  const supabase = useSupabaseClient<Database>();
  return useAsyncData<StudioPost[]>('studio-posts', async () => {
    const { data, error } = await supabase
      .from('studio_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Failed to load studio_posts:', error.message);
      return [];
    }
    return data ?? [];
  });
}
