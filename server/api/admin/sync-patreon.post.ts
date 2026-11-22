import { resolvePatreonAuth } from '../../utils/patreon/auth';
import { mirrorPatreonCoverToStorage } from '../../utils/patreon/media';
import {
    buildTeaserSummary,
    extractPrimaryImageUrl,
    inferPostType,
    normalizePatreonPostUrl
} from '../../utils/patreon/parser';
import { getAdminSupabase } from '../../utils/patreon/supabase';
import type { PatreonPostsResponse, PatreonSyncResult } from '../../utils/patreon/types';

function readConfigString(value: unknown, fallback = ''): string {
    return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

async function fetchPatreonPostsPage(
    campaignId: string,
    accessToken: string
): Promise<Response> {
    const fields = encodeURIComponent(
        'title,content,is_public,is_paid,published_at,url,embed_url,embed_data'
    );
    const endpoint = `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/posts?fields[post]=${fields}&page[count]=25`;

    return fetch(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
}

export default defineEventHandler(async (event): Promise<PatreonSyncResult> => {
    const config = useRuntimeConfig(event);

    const authHeader = getHeader(event, 'authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!bearerToken) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized: missing session token.' });
    }

    const supabaseAdmin = getAdminSupabase(event);

    const {
        data: { user },
        error: userError
    } = await supabaseAdmin.auth.getUser(bearerToken);

    if (userError || !user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized: invalid session.' });
    }

    const adminEmail = readConfigString(config.adminEmail);
    if (adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden: admin account required.' });
    }

    const envCreds = {
        clientId: readConfigString(config.patreonClientId),
        clientSecret: readConfigString(config.patreonClientSecret),
        accessToken: readConfigString(config.patreonAccessToken),
        refreshToken: readConfigString(config.patreonRefreshToken),
        campaignId: readConfigString(config.patreonCampaignId)
    };

    let auth = await resolvePatreonAuth(supabaseAdmin, envCreds, false);
    let postsRes = await fetchPatreonPostsPage(auth.campaignId, auth.accessToken);

    if (postsRes.status === 401) {
        auth = await resolvePatreonAuth(supabaseAdmin, envCreds, true);
        postsRes = await fetchPatreonPostsPage(auth.campaignId, auth.accessToken);
    }

    if (!postsRes.ok) {
        const errBody = await postsRes.text();
        throw createError({
            statusCode: 502,
            statusMessage: `Patreon API error (${postsRes.status}): ${errBody}`
        });
    }

    const payload = (await postsRes.json()) as PatreonPostsResponse;
    const items = payload.data ?? [];

    const slugs = items.map((item) => `patreon-${item.id}`);
    const existingMap = new Map<string, { cover_url: string | null }>();

    if (slugs.length > 0) {
        const { data: existingRows } = await supabaseAdmin
            .from('studio_posts')
            .select('slug, cover_url')
            .in('slug', slugs);

        for (const row of existingRows ?? []) {
            existingMap.set(row.slug, { cover_url: row.cover_url });
        }
    }

    const bucket = readConfigString(config.supabaseStorageBucket, 'preview');
    let syncedCount = 0;
    let mediaMirrored = 0;
    let mediaSkipped = 0;
    const errors: string[] = [];

    for (const item of items) {
        if (!item.attributes.published_at) continue;

        const slug = `patreon-${item.id}`;
        const title = (item.attributes.title || 'Artek Medical Update').trim();
        const isPaid = item.attributes.is_public === false || Boolean(item.attributes.is_paid);
        const teaser = buildTeaserSummary(item.attributes.content);
        const externalUrl = normalizePatreonPostUrl(item.attributes.url, item.id);
        const postType = inferPostType(title, isPaid);

        let finalCoverUrl = existingMap.get(slug)?.cover_url ?? null;

        try {
            const sourceImg = extractPrimaryImageUrl(item);
            const mediaResult = await mirrorPatreonCoverToStorage(
                supabaseAdmin,
                bucket,
                item.id,
                sourceImg,
                finalCoverUrl
            );
            finalCoverUrl = mediaResult.publicUrl;
            if (mediaResult.mirrored) mediaMirrored += 1;
            if (mediaResult.skipped) mediaSkipped += 1;
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            errors.push(`Media [${item.id}]: ${msg}`);
        }

        const bodyFallback =
            teaser ||
            'Read the full update, previews, and devlog directly on the Artek Medical Patreon page.';

        const { error: upsertError } = await supabaseAdmin.from('studio_posts').upsert(
            {
                slug,
                project_slug: null,
                platform: 'patreon',
                post_type: postType,
                is_paid: isPaid,
                tier_name: isPaid ? 'Chief of Medicine / Early Access' : null,
                title_en: title,
                title_it: title,
                summary_en: teaser || null,
                summary_it: teaser || null,
                body_en: bodyFallback,
                body_it: bodyFallback,
                cover_url: finalCoverUrl,
                gallery_urls: [],
                external_url: externalUrl,
                tags: isPaid ? ['patreon', 'early-access'] : ['patreon', 'free-update'],
                published_at: item.attributes.published_at,
                is_published: true,
                metadata: {
                    patreon_post_id: item.id,
                    synced_at: new Date().toISOString()
                }
            },
            { onConflict: 'slug' }
        );

        if (upsertError) {
            errors.push(`DB [${item.id}]: ${upsertError.message}`);
        } else {
            syncedCount += 1;
        }
    }

    return {
        campaignId: auth.campaignId,
        totalFetched: items.length,
        syncedCount,
        mediaMirrored,
        mediaSkipped,
        errors
    };
});