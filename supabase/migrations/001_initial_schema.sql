-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('creator', 'brand', 'spectator', 'admin');
create type contest_status as enum ('draft', 'live', 'ended');

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text,
  role user_role not null default 'spectator',
  avatar_url text,
  bio text,
  
  -- Creator-specific fields
  tiktok_handle text unique,
  tiktok_user_id text unique,
  total_followers integer default 0,
  verified boolean default false,
  
  -- Gamification fields
  xp_points integer default 0,
  level integer default 1,
  streak_days integer default 0,
  last_activity_date date default current_date,
  
  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Contests table
create table public.contests (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  brand_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Contest settings
  status contest_status default 'draft',
  max_participants integer,
  submission_deadline timestamp with time zone,
  voting_deadline timestamp with time zone,
  
  -- Prize information
  prize_description text,
  prize_value numeric,
  
  -- Content guidelines
  hashtags text[],
  content_guidelines text,
  
  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Contest submissions table
create table public.contest_submissions (
  id uuid default uuid_generate_v4() primary key,
  contest_id uuid references public.contests(id) on delete cascade not null,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  
  -- TikTok video info
  tiktok_video_id text not null,
  tiktok_video_url text not null,
  
  -- Engagement metrics (updated periodically)
  views_count integer default 0,
  likes_count integer default 0,
  comments_count integer default 0,
  shares_count integer default 0,
  
  -- Contest-specific metrics
  votes_count integer default 0,
  rank_position integer,
  xp_earned integer default 0,
  
  -- Timestamps
  submitted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Ensure one submission per creator per contest
  unique(contest_id, creator_id)
);

-- Leaderboards table (for caching leaderboard data)
create table public.leaderboards (
  id uuid default uuid_generate_v4() primary key,
  contest_id uuid references public.contests(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Rankings
  global_rank integer,
  contest_rank integer,
  
  -- Metrics
  total_xp integer default 0,
  monthly_xp integer default 0,
  weekly_xp integer default 0,
  
  -- Timestamps
  calculated_at timestamp with time zone default now(),
  
  -- Indexes for fast querying
  unique(contest_id, user_id)
);

-- User achievements/badges table
create table public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  achievement_type text not null,
  achievement_name text not null,
  description text,
  badge_icon_url text,
  
  -- Achievement data
  earned_at timestamp with time zone default now(),
  xp_reward integer default 0,
  
  -- Prevent duplicate achievements
  unique(user_id, achievement_type, achievement_name)
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.contests enable row level security;
alter table public.contest_submissions enable row level security;
alter table public.leaderboards enable row level security;
alter table public.user_achievements enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Contests policies
create policy "Contests are viewable by everyone" on public.contests
  for select using (status = 'live' or auth.uid() = brand_id);

create policy "Brands can create contests" on public.contests
  for insert with check (
    auth.uid() = brand_id and 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'brand')
  );

create policy "Brands can update their own contests" on public.contests
  for update using (auth.uid() = brand_id);

-- Contest submissions policies
create policy "Submissions are viewable for live contests" on public.contest_submissions
  for select using (
    exists (select 1 from public.contests where id = contest_id and status = 'live')
  );

create policy "Creators can submit to contests" on public.contest_submissions
  for insert with check (
    auth.uid() = creator_id and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'creator') and
    exists (select 1 from public.contests where id = contest_id and status = 'live')
  );

create policy "Creators can update their own submissions" on public.contest_submissions
  for update using (auth.uid() = creator_id);

-- Leaderboards policies (read-only for users)
create policy "Leaderboards are viewable by everyone" on public.leaderboards
  for select using (true);

-- User achievements policies
create policy "User achievements are viewable by everyone" on public.user_achievements
  for select using (true);

-- Functions and Triggers

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to relevant tables
create trigger handle_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at before update on public.contests
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at before update on public.contest_submissions
  for each row execute function public.handle_updated_at();

-- Create indexes for performance
create index profiles_role_idx on public.profiles(role);
create index profiles_xp_points_idx on public.profiles(xp_points desc);
create index contests_status_idx on public.contests(status);
create index contests_brand_id_idx on public.contests(brand_id);
create index contest_submissions_contest_id_idx on public.contest_submissions(contest_id);
create index contest_submissions_creator_id_idx on public.contest_submissions(creator_id);
create index leaderboards_contest_id_idx on public.leaderboards(contest_id);
create index leaderboards_global_rank_idx on public.leaderboards(global_rank);
create index user_achievements_user_id_idx on public.user_achievements(user_id);