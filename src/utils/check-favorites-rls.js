/**
 * Supabase SQL commands to verify and fix RLS policies for the favorites table
 * 
 * Use these SQL commands in the Supabase SQL Editor to:
 * 1. Check current RLS status
 * 2. Enable RLS if not enabled
 * 3. Create proper policies for the favorites table
 */

/*
-- Check if RLS is enabled for the favorites table
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'favorites';

-- Enable RLS on the favorites table if it's not already enabled
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'favorites';

-- Create or replace policies for favorites table

-- Allow users to view their own favorites
CREATE POLICY IF NOT EXISTS "Users can view their own favorites" 
ON public.favorites FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to create their own favorites
CREATE POLICY IF NOT EXISTS "Users can create their own favorites" 
ON public.favorites FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own favorites
CREATE POLICY IF NOT EXISTS "Users can update their own favorites" 
ON public.favorites FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete their own favorites
CREATE POLICY IF NOT EXISTS "Users can delete their own favorites" 
ON public.favorites FOR DELETE 
USING (auth.uid() = user_id);

-- Verify the favorites table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public' AND 
  table_name = 'favorites';

-- The favorites table should have at least these columns:
-- id: UUID (primary key)
-- user_id: UUID (references auth.users)
-- restaurant_id: TEXT or UUID
-- created_at: TIMESTAMP WITH TIME ZONE

-- If the favorites table is missing or has incorrect structure, you can recreate it with:

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  restaurant_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);

-- Then re-apply the RLS policies after creating the table
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Re-create all the policies listed above
*/ 