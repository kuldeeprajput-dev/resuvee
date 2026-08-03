-- Create Resumes table in Supabase PostgreSQL
create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled Resume',
  target_role text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast user queries
create index if not exists idx_resumes_user_id on resumes(user_id);

-- Enable Row Level Security (RLS)
alter table resumes enable row level security;

-- RLS Policies
create policy "Users can view their own resumes"
  on resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own resumes"
  on resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
  on resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own resumes"
  on resumes for delete
  using (auth.uid() = user_id);
