import type { Json, Tables } from '~/types/database.types';

export type StudioSettings = Tables<'studio_settings'>;
export type StudioProject = Tables<'projects'>;
export type StudioPost = Tables<'studio_posts'>;
export type StudioIntegration = Tables<'studio_integrations'>;

export type JsonObject = { [key: string]: Json | undefined };

export function asJsonObject(value: Json | null | undefined): JsonObject {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return value;
    }
    return {};
}

export function asStringArray(value: Json | null | undefined): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}