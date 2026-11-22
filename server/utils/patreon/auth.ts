import type { AdminSupabaseClient } from './supabase';
import type { PatreonCampaignsResponse, PatreonTokenResponse } from './types';

interface PatreonRuntimeCredentials {
    clientId: string;
    clientSecret: string;
    accessToken: string;
    refreshToken: string;
    campaignId: string;
}

interface ResolvedPatreonAuth {
    accessToken: string;
    campaignId: string;
}

const PROVIDER_KEY = 'patreon';
const REFRESH_BUFFER_MS = 1000 * 60 * 60 * 24;

async function refreshPatreonOAuthToken(
    refreshToken: string,
    clientId: string,
    clientSecret: string
): Promise<PatreonTokenResponse> {
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret
    });

    const response = await fetch('https://www.patreon.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Patreon OAuth refresh failed (${response.status}): ${errText}`);
    }

    return (await response.json()) as PatreonTokenResponse;
}

async function discoverCampaignId(accessToken: string): Promise<string> {
    const response = await fetch('https://www.patreon.com/api/oauth2/v2/campaigns', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Patreon campaign lookup failed (${response.status}): ${errText}`);
    }

    const payload = (await response.json()) as PatreonCampaignsResponse;
    const firstId = payload.data?.[0]?.id;
    if (!firstId) {
        throw new Error('No Patreon campaign found for this creator token.');
    }
    return firstId;
}

export async function resolvePatreonAuth(
    supabase: AdminSupabaseClient,
    envCreds: PatreonRuntimeCredentials,
    forceRefresh = false
): Promise<ResolvedPatreonAuth> {
    const { data: stored } = await supabase
        .from('studio_integrations')
        .select('*')
        .eq('provider', PROVIDER_KEY)
        .maybeSingle();

    let accessToken = stored?.access_token || envCreds.accessToken;
    let refreshToken = stored?.refresh_token || envCreds.refreshToken;
    let campaignId = stored?.campaign_id || envCreds.campaignId;
    const expiresAtMs = stored?.expires_at ? Date.parse(stored.expires_at) : null;

    if (!accessToken) {
        throw new Error('Missing NUXT_PATREON_ACCESS_TOKEN configuration.');
    }

    const shouldRefresh =
        forceRefresh || (expiresAtMs !== null && Date.now() + REFRESH_BUFFER_MS >= expiresAtMs);

    if (shouldRefresh) {
        if (!refreshToken || !envCreds.clientId || !envCreds.clientSecret) {
            throw new Error(
                'Cannot refresh Patreon token: missing NUXT_PATREON_REFRESH_TOKEN, NUXT_PATREON_CLIENT_ID, or NUXT_PATREON_CLIENT_SECRET.'
            );
        }

        const refreshed = await refreshPatreonOAuthToken(
            refreshToken,
            envCreds.clientId,
            envCreds.clientSecret
        );
        accessToken = refreshed.access_token;
        refreshToken = refreshed.refresh_token;
        const nextExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

        await supabase.from('studio_integrations').upsert({
            provider: PROVIDER_KEY,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: nextExpiry,
            campaign_id: campaignId || null,
            updated_at: new Date().toISOString()
        });
    } else if (!stored && refreshToken) {
        await supabase.from('studio_integrations').upsert({
            provider: PROVIDER_KEY,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: null,
            campaign_id: campaignId || null,
            updated_at: new Date().toISOString()
        });
    }

    if (!campaignId) {
        campaignId = await discoverCampaignId(accessToken);
        await supabase
            .from('studio_integrations')
            .update({ campaign_id: campaignId, updated_at: new Date().toISOString() })
            .eq('provider', PROVIDER_KEY);
    }

    return { accessToken, campaignId };
}