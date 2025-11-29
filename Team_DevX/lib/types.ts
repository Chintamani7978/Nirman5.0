import { Database } from "./supabase/types";

export type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  profiles: Pick<Database["public"]["Tables"]["profiles"]["Row"], "full_name" | "role">;
  replies?: Comment[];
};

export type Notification = Database["public"]["Tables"]["notifications"]["Row"] & {
  profiles: Pick<Database["public"]["Tables"]["profiles"]["Row"], "full_name">;
};

// Shape used in Dashboard; matches "problems" table plus optional geo helpers
export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  city?: string;
  votes_count: number; // Required for sorting
  latitude: number | null;
  longitude: number | null;
  pincode?: string | null;
  location?: any; // geo field from RPC
  comments_count?: number; // Optional comments count
  user_vote?: 'upvote' | 'downvote' | null;
  rating?: number | null;
  feedback?: string | null;
  user_id?: string | null;
  [key: string]: any;
}
