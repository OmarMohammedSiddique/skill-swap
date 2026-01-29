-- 1. Create a secure function to check admin status
-- SECURITY DEFINER means this function runs with the privileges of the creator (postgres/admin),
-- bypassing RLS checks on the profiles table, preventing recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public -- Best practice for security definers
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
$$;

-- 2. Drop the recursive policies (if they exist)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all skills" ON skills;
DROP POLICY IF EXISTS "Admins can delete all skills" ON skills;

-- 3. Re-create policies using the secure function instead of the recursive subquery

-- Profiles: Admins can view/update everything
-- Note: 'view' might be redundant if you have a public view policy, but this ensures admins definitely can.
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING ( is_admin() );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING ( is_admin() );

-- Skills: Admins can update/delete
CREATE POLICY "Admins can update all skills"
  ON skills FOR UPDATE
  USING ( is_admin() );

CREATE POLICY "Admins can delete all skills"
  ON skills FOR DELETE
  USING ( is_admin() );
