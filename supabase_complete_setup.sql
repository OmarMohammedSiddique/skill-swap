-- 1. PROFILES
-- Create a table for public profiles if it doesn't exist
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  country text,
  whatsapp_contact text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. SKILLS
create table if not exists skills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  skill_name text not null,
  skill_type text check (skill_type in ('TEACH', 'LEARN')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table skills enable row level security;

create policy "Skills are viewable by everyone"
  on skills for select
  using ( true );

create policy "Users can insert their own skills"
  on skills for insert
  with check ( auth.uid() = user_id );

-- 3. SWAP REQUESTS
create table if not exists swap_requests (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table swap_requests enable row level security;

create policy "Users can create requests"
  on swap_requests for insert
  with check ( auth.uid() = requester_id );

create policy "Users can view their own requests"
  on swap_requests for select
  using ( auth.uid() = requester_id or auth.uid() = receiver_id );

create policy "Users can update their own requests"
  on swap_requests for update
  using ( auth.uid() = requester_id or auth.uid() = receiver_id );

-- 4. MESSAGES
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  read_at timestamp with time zone
);

alter table messages enable row level security;

create policy "Users can send messages"
  on messages for insert
  with check ( auth.uid() = sender_id );

create policy "Users can view their own messages"
  on messages for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

-- Enable Realtime for messages
alter publication supabase_realtime add table messages;


-- 5. VOUCHES (New Feature)
create table if not exists vouches (
  id uuid default gen_random_uuid() primary key,
  voucher_id uuid references profiles(id) on delete cascade not null,
  vouched_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(voucher_id, vouched_id)
);

alter table vouches enable row level security;

create policy "Users can insert vouches" 
  on vouches for insert 
  with check (auth.uid() = voucher_id);

create policy "Everyone can read vouches" 
  on vouches for select 
  using (true);
