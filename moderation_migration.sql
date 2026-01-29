-- 1. Add warning_count to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS warning_count INT DEFAULT 0;

-- 2. Create Moderation Logs Table
CREATE TABLE IF NOT EXISTS moderation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL, -- The bad message
    detected_words TEXT, -- What words triggered it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Admins can view everything (assuming we reuse the is_admin function from before, or logic)
-- We'll use the is_admin() function we created earlier for valid RLS
CREATE POLICY "Admins can view moderation logs"
  ON moderation_logs
  FOR SELECT
  USING ( is_admin() );

-- System/Server needs to insert (Service Role), generally RLS defaults to allow if using server keys, 
-- but for "Authenticated Users" trying to insert? No, users shouldn't insert their own logs manually.
-- The server action will do it. 
-- However, Supabase Server Actions usually run as the User unless we use a service role client.
-- If running as User, we need them to be able to INSERT their own log (technically).
-- OR we generally trust the server action to bypass RLS if using the service role, 
-- but Next.js Supabase auth helpers usually default to the user.

-- Let's allow users to insert logs where they are the user_id (for the server action to work under their auth)
CREATE POLICY "Users can insert their own moderation logs"
  ON moderation_logs
  FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- 5. Ensure Messages Table allows inserts (Already done in setup, but good to verify)
-- "Users can send messages" policy exists.
