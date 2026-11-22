import type { Database } from '~/types/database.types';
import {
  asJsonObject,
  type StudioPost,
  type StudioProject,
  type StudioSettings
} from '~/types/studio.types';

export const DEFAULT_PATREON_URL = 'https://www.patreon.com/darkart3k';
export const DEFAULT_CURSEFORGE_URL = 'https://www.curseforge.com/members/darkarteks/projects';

export function formatPlainSummary(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw.replace(/`([^`]+)`/g, '$1').replace(/\s+/g, ' ').trim();
}

export function getProjectTitle(project: StudioProject, lang: 'en' | 'it'): string {
  const rawTitleIt = asJsonObject(project.metadata).raw_title_it;
  if (lang === 'it' && typeof rawTitleIt === 'string' && rawTitleIt.trim().length > 0) {
    return rawTitleIt;
  }
  return project.title;
}

export function getProjectSummary(project: StudioProject, lang: 'en' | 'it'): string {
  const raw =
      lang === 'it'
          ? project.summary_it || project.summary_en || ''
          : project.summary_en || project.summary_it || '';
  return formatPlainSummary(raw);
}

export function getStudioDownloadsLabel(settings: StudioSettings | null | undefined): string {
  const value = asJsonObject(settings?.metadata).curseforge_downloads;
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value.toLocaleString('en-US')}+`;
  }
  return '7,000+';
}

export function getStatusLabel(status: number, lang: 'en' | 'it'): string {
  switch (status) {
    case 3:
      return lang === 'it' ? 'Rilasciata' : 'Released';
    case 2:
      return lang === 'it' ? 'In Arrivo' : 'Coming Soon';
    case 1:
      return lang === 'it' ? 'In Lavorazione' : 'In Development';
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
        .in('platform', ['site', 'patreon'])
        .eq('is_published', true)
        .order('published_at', { ascending: false });

    if (error) {
      console.error('Failed to load studio_posts:', error.message);
      return [];
    }
    return data ?? [];
  });
}