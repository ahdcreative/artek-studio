import type { AdminSupabaseClient } from './supabase';

const MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif'
};

export interface MirrorMediaResult {
    publicUrl: string | null;
    mirrored: boolean;
    skipped: boolean;
}

function isAlreadyOnSupabaseBucket(url: string | null | undefined, bucket: string): boolean {
    if (!url) return false;
    return url.includes(`/storage/v1/object/public/${bucket}/`);
}

export async function mirrorPatreonCoverToStorage(
    supabase: AdminSupabaseClient,
    bucket: string,
    patreonPostId: string,
    sourceImageUrl: string | null,
    existingCoverUrl: string | null
): Promise<MirrorMediaResult> {
    if (isAlreadyOnSupabaseBucket(existingCoverUrl, bucket)) {
        return { publicUrl: existingCoverUrl, mirrored: false, skipped: true };
    }

    if (!sourceImageUrl) {
        return { publicUrl: existingCoverUrl, mirrored: false, skipped: false };
    }

    const response = await fetch(sourceImageUrl, {
        headers: { Accept: 'image/*' }
    });

    if (!response.ok) {
        throw new Error(`Image fetch failed (${response.status}) for post ${patreonPostId}`);
    }

    const rawContentType = (response.headers.get('content-type') || 'image/jpeg')
        .split(';')[0]
        ?.trim()
        .toLowerCase();

    const contentType = rawContentType && MIME_TO_EXT[rawContentType] ? rawContentType : 'image/jpeg';
    const ext = MIME_TO_EXT[contentType] || 'jpg';
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    if (bytes.byteLength === 0) {
        return { publicUrl: existingCoverUrl, mirrored: false, skipped: false };
    }

    const storagePath = `patreon/${patreonPostId}/cover.${ext}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, bytes, {
        contentType,
        cacheControl: '31536000',
        upsert: true
    });

    if (uploadError) {
        throw new Error(`Supabase Storage upload failed (${storagePath}): ${uploadError.message}`);
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return {
        publicUrl: publicData.publicUrl,
        mirrored: true,
        skipped: false
    };
}