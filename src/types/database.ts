export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          onboarding_complete: boolean;
          last_period_date: string | null;
          cycle_length: number | null;
          period_length: number | null;
          goal: "track_cycle" | "plan_pregnancy" | "health_insights" | null;
          notifications_enabled: boolean;
          fcm_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          onboarding_complete?: boolean;
          last_period_date?: string | null;
          cycle_length?: number | null;
          period_length?: number | null;
          goal?: "track_cycle" | "plan_pregnancy" | "health_insights" | null;
          notifications_enabled?: boolean;
          fcm_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          onboarding_complete?: boolean;
          last_period_date?: string | null;
          cycle_length?: number | null;
          period_length?: number | null;
          goal?: "track_cycle" | "plan_pregnancy" | "health_insights" | null;
          notifications_enabled?: boolean;
          fcm_token?: string | null;
          updated_at?: string;
        };
      };
      daily_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          mood: string | null;
          flow: string | null;
          symptoms: string[] | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          mood?: string | null;
          flow?: string | null;
          symptoms?: string[] | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          date?: string;
          mood?: string | null;
          flow?: string | null;
          symptoms?: string[] | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      cravings: {
        Row: {
          id: string;
          user_id: string;
          item: string;
          category: "food" | "activity" | "gift" | "other";
          notes: string | null;
          fulfilled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item: string;
          category: "food" | "activity" | "gift" | "other";
          notes?: string | null;
          fulfilled?: boolean;
          created_at?: string;
        };
        Update: {
          item?: string;
          category?: "food" | "activity" | "gift" | "other";
          notes?: string | null;
          fulfilled?: boolean;
        };
      };
      partner_links: {
        Row: {
          id: string;
          owner_id: string;
          partner_id: string | null;
          partner_email: string;
          role: "partner" | "friend" | "family";
          status: "pending" | "active" | "declined";
          permissions: Json;
          created_at: string;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          partner_id?: string | null;
          partner_email: string;
          role: "partner" | "friend" | "family";
          status?: "pending" | "active" | "declined";
          permissions?: Json;
          created_at?: string;
          accepted_at?: string | null;
        };
        Update: {
          partner_id?: string | null;
          status?: "pending" | "active" | "declined";
          permissions?: Json;
          accepted_at?: string | null;
        };
      };
      gifts: {
        Row: {
          id: string;
          from_user_id: string;
          to_user_id: string;
          gift_type: string;
          message: string | null;
          status: "pending" | "delivered" | "viewed";
          created_at: string;
        };
        Insert: {
          id?: string;
          from_user_id: string;
          to_user_id: string;
          gift_type: string;
          message?: string | null;
          status?: "pending" | "delivered" | "viewed";
          created_at?: string;
        };
        Update: {
          status?: "pending" | "delivered" | "viewed";
        };
      };
    };
  };
}

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type DailyLog = Database["public"]["Tables"]["daily_logs"]["Row"];
export type Craving = Database["public"]["Tables"]["cravings"]["Row"];
export type PartnerLink = Database["public"]["Tables"]["partner_links"]["Row"];
export type Gift = Database["public"]["Tables"]["gifts"]["Row"];
