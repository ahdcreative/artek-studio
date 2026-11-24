export type ReferralCampaign =
    | 'mod_detail'
    | 'mod_card'
    | 'news_card'
    | 'news_detail'
    | 'header_cta'
    | 'footer_link'
    | 'footer_agency'
    | 'clinic_banner'
    | 'hero_cta';

export const EXTERNAL_LINK_REL = 'noopener nofollow';
export const AGENCY_LINK_REL = 'noopener';

export function buildReferralUrl(
    rawUrl: string | null | undefined,
    campaign: ReferralCampaign,
    content?: string
): string {
    if (!rawUrl) return '';
    const trimmed = rawUrl.trim();
    if (!trimmed || !/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    try {
        const parsed = new URL(trimmed);
        if (!parsed.searchParams.has('utm_source')) {
            parsed.searchParams.set('utm_source', 'art3k.org');
        }
        if (!parsed.searchParams.has('utm_medium')) {
            parsed.searchParams.set('utm_medium', 'referral');
        }
        if (!parsed.searchParams.has('utm_campaign')) {
            parsed.searchParams.set('utm_campaign', campaign);
        }
        if (content && !parsed.searchParams.has('utm_content')) {
            parsed.searchParams.set('utm_content', content);
        }
        return parsed.toString();
    } catch {
        return trimmed;
    }
}