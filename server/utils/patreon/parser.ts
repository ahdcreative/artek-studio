import type { PatreonPostItem } from './types';

function decodeHtmlEntities(input: string): string {
    return input
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>');
}

export function stripHtmlToText(html: string | null | undefined): string {
    if (!html) return '';
    const withoutTags = html
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<\/(p|div|li|h[1-6]|br)>/gi, '\n')
        .replace(/<[^>]+>/g, ' ');
    return decodeHtmlEntities(withoutTags).replace(/\s+/g, ' ').trim();
}

export function buildTeaserSummary(html: string | null | undefined, maxLength = 210): string {
    const plain = stripHtmlToText(html);
    if (!plain) return '';
    if (plain.length <= maxLength) return plain;
    const sliced = plain.slice(0, maxLength);
    const lastSpace = sliced.lastIndexOf(' ');
    return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

export function extractPrimaryImageUrl(post: PatreonPostItem): string | null {
    const embedImage = post.attributes.embed_data?.image_url;
    if (embedImage && /^https?:\/\//i.test(embedImage)) {
        return embedImage;
    }

    const content = post.attributes.content || '';
    const imgMatch = content.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
    if (imgMatch?.[1]) {
        return decodeHtmlEntities(imgMatch[1]);
    }

    return null;
}

export function inferPostType(title: string, isPaid: boolean): 'release' | 'preview' | 'update' {
    const lower = title.toLowerCase();
    if (isPaid || lower.includes('wip') || lower.includes('preview') || lower.includes('early access')) {
        return 'preview';
    }
    if (lower.includes('release') || lower.includes('download') || lower.includes('v2') || lower.includes('free')) {
        return 'release';
    }
    return 'update';
}

export function normalizePatreonPostUrl(rawUrl: string | null | undefined, postId: string): string {
    if (!rawUrl) return `https://www.patreon.com/posts/${postId}`;
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
    return `https://www.patreon.com${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
}