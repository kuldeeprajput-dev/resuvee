-- Create Cover Letters table in Supabase PostgreSQL
create table if not exists cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled Cover Letter',
  company text,
  role text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast user queries
create index if not exists idx_cover_letters_user_id on cover_letters(user_id);

-- Enable Row Level Security (RLS)
alter table cover_letters enable row level security;

-- RLS Policies
create policy "Users can view their own cover letters"
  on cover_letters for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cover letters"
  on cover_letters for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cover letters"
  on cover_letters for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cover letters"
  on cover_letters for delete
  using (auth.uid() = user_id);
