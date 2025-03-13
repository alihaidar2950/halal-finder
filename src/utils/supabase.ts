import { createClient } from '@supabase/supabase-js';

// This approach is for client-side usage
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types for user profiles
export type UserProfile = {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
};

// Types for your database schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id'>;
        Update: Partial<Omit<UserProfile, 'id'>>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          created_at: string;
        };
        Insert: Omit<
          {
            id: string;
            user_id: string;
            restaurant_id: string;
            created_at: string;
          },
          'id' | 'created_at'
        >;
        Update: Partial<
          Omit<
            {
              id: string;
              user_id: string;
              restaurant_id: string;
              created_at: string;
            },
            'id' | 'created_at'
          >
        >;
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: Omit<
          {
            id: string;
            user_id: string;
            restaurant_id: string;
            rating: number;
            comment: string;
            created_at: string;
          },
          'id' | 'created_at'
        >;
        Update: Partial<
          Omit<
            {
              id: string;
              user_id: string;
              restaurant_id: string;
              rating: number;
              comment: string;
              created_at: string;
            },
            'id' | 'created_at'
          >
        >;
      };
    };
  };
}; 