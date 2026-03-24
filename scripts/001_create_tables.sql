-- Rheo Database Schema
-- This script creates all tables needed for the period tracking app

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  last_period_date DATE,
  cycle_length INTEGER DEFAULT 28,
  period_length INTEGER DEFAULT 5,
  goal TEXT CHECK (goal IN ('track_cycle', 'plan_pregnancy', 'health_insights')),
  notifications_enabled BOOLEAN DEFAULT FALSE,
  fcm_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily logs table
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood TEXT,
  flow TEXT,
  symptoms TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Cravings table
CREATE TABLE IF NOT EXISTS public.cravings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('food', 'activity', 'gift', 'other')),
  notes TEXT,
  fulfilled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner links table
CREATE TABLE IF NOT EXISTS public.partner_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  partner_email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('partner', 'friend', 'family')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'declined')),
  permissions JSONB DEFAULT '{"viewCycle": true, "viewMood": true, "viewSymptoms": false, "sendGifts": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

-- Gifts table
CREATE TABLE IF NOT EXISTS public.gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gift_type TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'viewed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cravings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Daily logs policies
CREATE POLICY "daily_logs_select_own" ON public.daily_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "daily_logs_insert_own" ON public.daily_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_logs_update_own" ON public.daily_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "daily_logs_delete_own" ON public.daily_logs FOR DELETE USING (auth.uid() = user_id);

-- Cravings policies
CREATE POLICY "cravings_select_own" ON public.cravings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cravings_insert_own" ON public.cravings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cravings_update_own" ON public.cravings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cravings_delete_own" ON public.cravings FOR DELETE USING (auth.uid() = user_id);

-- Partner links policies (owner can manage, partners can view)
CREATE POLICY "partner_links_select_own" ON public.partner_links FOR SELECT 
  USING (auth.uid() = owner_id OR auth.uid() = partner_id);
CREATE POLICY "partner_links_insert_own" ON public.partner_links FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "partner_links_update_own" ON public.partner_links FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() = partner_id);
CREATE POLICY "partner_links_delete_own" ON public.partner_links FOR DELETE USING (auth.uid() = owner_id);

-- Gifts policies (sender and receiver can view)
CREATE POLICY "gifts_select_involved" ON public.gifts FOR SELECT 
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "gifts_insert_sender" ON public.gifts FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "gifts_update_receiver" ON public.gifts FOR UPDATE USING (auth.uid() = to_user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON public.daily_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_cravings_user ON public.cravings(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_links_owner ON public.partner_links(owner_id);
CREATE INDEX IF NOT EXISTS idx_partner_links_partner ON public.partner_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_gifts_to_user ON public.gifts(to_user_id);
