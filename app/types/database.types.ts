export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface ProjectMetadata {
  raw_title_it?: string;
  status_badge?: string;
  raw_status?: string;
  payment_note?: string;
  mesh_source_cost?: string;
  cgtrader_url?: string | null;
  [key: string]: Json | undefined;
}

export interface Database {
  public: {
    Tables: {
      studio_settings: {
        Row: {
          id: string;
          brand_name: string;
          domain: string;
          tagline_en: string;
          tagline_it: string;
          bio_en: string;
          bio_it: string;
          patreon_url: string;
          curseforge_url: string | null;
          avatar_url: string | null;
          hero_banner_url: string | null;
          metadata: Record<string, Json>;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['studio_settings']['Row']> & {
          id: string;
          brand_name: string;
          domain: string;
          tagline_en: string;
          tagline_it: string;
          bio_en: string;
          bio_it: string;
          patreon_url: string;
        };
        Update: Partial<Database['public']['Tables']['studio_settings']['Row']>;
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: string | null;
          modkit_project: string | null;
          status: number;
          is_free: boolean;
          preview_url: string | null;
          package_url: string | null;
          metadata: ProjectMetadata | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          section: string | null;
          summary_en: string | null;
          summary_it: string | null;
          patreon_url: string | null;
          curseforge_url: string | null;
          tier_price_eur: number | null;
          featured: boolean | null;
          sort_order: number | null;
          is_published: boolean | null;
        };
        Insert: Partial<Database['public']['Tables']['projects']['Row']> & {
          slug: string;
          title: string;
        };
        Update: Partial<Database['public']['Tables']['projects']['Row']>;
      };
      studio_posts: {
        Row: {
          id: string;
          slug: string;
          project_slug: string | null;
          platform: string;
          post_type: string;
          is_paid: boolean;
          tier_name: string | null;
          title_en: string;
          title_it: string;
          summary_en: string | null;
          summary_it: string | null;
          body_en: string;
          body_it: string;
          cover_url: string | null;
          gallery_urls: string[];
          external_url: string | null;
          tags: string[];
          published_at: string;
          is_published: boolean;
          metadata: Record<string, Json>;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['studio_posts']['Row']> & {
          slug: string;
          title_en: string;
          title_it: string;
          body_en: string;
          body_it: string;
        };
        Update: Partial<Database['public']['Tables']['studio_posts']['Row']>;
      };
    };
  };
}

export type StudioSettings = Database['public']['Tables']['studio_settings']['Row'];
export type StudioProject = Database['public']['Tables']['projects']['Row'];
export type StudioPost = Database['public']['Tables']['studio_posts']['Row'];
