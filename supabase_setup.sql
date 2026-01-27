-- Milestone 1: Swap Requests
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
  with check (auth.uid() = requester_id);

create policy "Users can view their own requests"
  on swap_requests for select
  using (auth.uid() = requester_id or auth.uid() = receiver_id);

create policy "Users can update their own requests"
  on swap_requests for update
  using (auth.uid() = requester_id or auth.uid() = receiver_id);


-- Milestone 2: Messages
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
  with check (auth.uid() = sender_id);

create policy "Users can view their own messages"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Enable Realtime
alter publication supabase_realtime add table messages;
