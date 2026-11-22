import { serverSupabaseServiceRole } from '#supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { H3Event } from 'h3';
import type { Database } from '~~/app/types/database.types';

export type AdminSupabaseClient = SupabaseClient<Database, 'public'>;

export function getAdminSupabase(event: H3Event): AdminSupabaseClient {
    return serverSupabaseServiceRole(event) as unknown as AdminSupabaseClient;
}