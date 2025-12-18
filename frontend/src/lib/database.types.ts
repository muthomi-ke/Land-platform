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
      plots: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          location: string;
          size: string;
          price: string;
          category: string;
          image_url?: string;
          is_verified?: boolean;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          location: string;
          size: string;
          price: string;
          category: string;
          image_url?: string;
          is_verified?: boolean;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
          location?: string;
          size?: string;
          price?: string;
          category?: string;
          image_url?: string;
          is_verified?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
