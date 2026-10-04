export interface CoupleUser {
  id: string;
  user_slot: 1 | 2;
  username: string;
  real_name: string;
  nickname?: string;
  password_hash?: string;
  color_theme: 'teal' | 'purple';
  avatar_url?: string;
  display_name?: string;
}

export interface Profile {
  id: string;
  email?: string;
  username?: string;
  real_name?: string;
  nickname?: string;
  user_slot: 1 | 2;
  color_theme: 'teal' | 'purple';
}

export interface PlanItem {
  id: string;
  title: string;
  location_name?: string;
  tentative_date?: string;
  planning_notes?: string;
  reference_photo?: string;
  references: { id: string; label: string; url: string }[];
  checklist: { id: string; item: string; completed: boolean }[];
  created_at?: string;
}

export interface DateMemory {
  id: string;
  date_number?: number;
  origin_plan_id?: string;
  fromWishId?: string;
  isEditingExistingMemory?: boolean;
  title: string;
  status?: 'ongoing' | 'completed';
  location_name: string;
  scheduled_date: string;
  gerbera_color: string;
  stamp_code?: string;
  quote_turn_slot?: 1 | 2;
  random_quote: string;
  person1_liked: string;
  person2_liked: string;
  person1_nice_note: string;
  person2_nice_note: string;
  created_at?: string;
  completed_at?: string;
  photos: DatePhoto[];
}

export interface DatePhoto {
  id: string;
  date_id?: string;
  url: string;
  caption: string;
  secret_back: string;
  rotation?: string;
  rotation_deg?: number;
}
