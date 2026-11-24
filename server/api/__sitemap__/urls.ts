import { serverSupabaseClient } from '#supabase/server';
import type { Database } from "~/types/database.types";

interface SitemapImage {
    loc: string;
    title?: string;
}

interface SitemapUrlEntry {
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    images?: SitemapImage[]
}

export default defineEventHandler(async (event): Promise<SitemapUrlEntry[]> => {
    const supabase = await serverSupabaseClient<Database>(event)
    const { data: projects } = await supabase
        .from('projects')
        .select('slug, title, updated_at, preview_url, status')
        .eq('is_published', true)
        .order('updated_at', {ascending: false});

    const urls: SitemapUrlEntry[] = [];

    for (const project of projects ?? []) {
        const entry: SitemapUrlEntry = {
            loc: `/mods/${project.slug}`,
            lastmod: project.updated_at,
            changefreq: project.status === 3 ? 'monthly' : 'weekly',
            priority: project.status === 3 ? 0.9 : 0.7
        };

        if (project.preview_url) {
           entry.images = [{ loc: project.preview_url, title: project.title }];
        }

        urls.push(entry);
    }

    setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600');

    return urls;
})