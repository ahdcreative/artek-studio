export interface PatreonPostAttributes {
    title?: string | null;
    content?: string | null;
    is_public?: boolean | null;
    is_paid?: boolean | null;
    published_at?: string | null;
    url?: string | null;
    embed_url?: string | null;
    embed_data?: {
        url?: string | null;
        image_url?: string | null;
        provider?: string | null;
    } | null;
}

export interface PatreonPostItem {
    id: string;
    type: 'post';
    attributes: PatreonPostAttributes
}

export interface PatreonPostsResponse {
    data: PatreonPostItem[];
    links?: {
        next?: string;
    };
}

export interface PatreonCampaignsResponse {
    data: Array<{
        id: string;
        type: 'campaign';
    }>;
}

export interface PatreonTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope?: string;
    token_type?: string;
}

export interface PatreonSyncResult {
    campaignId: string;
    totalFetched: number;
    syncedCount: number;
    mediaMirrored: number;
    mediaSkipped: number;
    errors: string[];
}