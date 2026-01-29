-- Add admin and status columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Update RLS Policies for Profiles

-- Allow admins to view all profiles (override existing view policy if needed, or add new one)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING ( auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true) );

-- Allow admins to update all profiles (for banning/verifying)
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING ( auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true) );

-- Update RLS Policies for Skills

-- Allow admins to view all skills (already public, but good to be explicit if that changes)
-- "Skills are viewable by everyone" covers this, so we might not need a specific select policy.

-- Allow admins to update/delete any skill (for moderation)
CREATE POLICY "Admins can update all skills"
  ON skills FOR UPDATE
  USING ( auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true) );

CREATE POLICY "Admins can delete all skills"
  ON skills FOR DELETE
  USING ( auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true) );

-- Function to check if user is admin (helper for middleware/client if needed, though usually we query profile)
-- We can just query the profile directly.
