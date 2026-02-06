# Admin Dashboard Implementation Plan

## 1. Database Schema (Run this in Supabase SQL Editor)
You will need to run the query below in your Supabase project to create the necessary tables.

```sql
-- Profile Table
create table profile (
  id bigint primary key generated always as identity,
  full_name text not null,
  role text not null,
  bio text not null,
  location text not null,
  status text not null,
  avatar_url text,
  whatsapp text
);

-- Insert default profile
insert into profile (full_name, role, bio, location, status)
values ('Fikri Bintang', 'Creative Technologist', 'Currently a student based in Cikupa, Tangerang Regency. I specialize in crafting high-end web interactions and cinematic motion.', 'Cikupa, Indonesia', 'University Student');

-- Experience Table
create table experience (
  id bigint primary key generated always as identity,
  role text not null,
  company text not null,
  period text not null,
  description text not null,
  "order" int default 0
);

-- Navbar Links Table
create table nav_links (
  id bigint primary key generated always as identity,
  name text not null,
  href text not null,
  icon_name text not null, -- Store Lucide icon name usually, or URL
  "order" int default 0,
  is_active boolean default true
);

-- Projects Table
create table projects (
  id bigint primary key generated always as identity,
  title text not null,
  description text not null,
  thumbnail_url text,
  image_urls text[], -- Array of image URLs
  created_at timestamp with time zone default now(),
  project_date text, -- e.g., "Jan 2024"
  link text,
  category text,
  "order" int default 0
);

-- Gear (Devices) Table
create table gear (
  id bigint primary key generated always as identity,
  name text not null,
  image_url text,
  description text,
  sequence_path text, -- Path to the folder in storage e.g. "sequences/laptop-rog"
  frame_count int default 0,
  start_frame int default 0,
  "order" int default 0
);

-- Default Gear
insert into gear (name, description, sequence_path, frame_count)
values ('OPPO RENO 14', 'Daily Mobile Driver', null, 192);
```

## 2. Environment Variables
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Architecture
- **Admin Route**: `/admin` (Protected)
- **Login Route**: `/login`
- **Data Fetching**: Components will try to fetch from Supabase. If no data/keys are found, they will gracefully fallback to the hardcoded content (so the site doesn't break while you set up).

## 4. Features
- **Profile Editor**: specific form to update the main hero section.
- **Menu Manager**: Add/Remove/Reorder navbar items.
- **Projects & Devices**: Full CRUD for your works and equipment.

## 5. Storage (Buckets)
In your Supabase dashboard, create a storage bucket named `documents`:
1. Go to **Storage**.
2. Create a new bucket named `documents`.
3. Set the privacy to **Public**.
4. This bucket is used for CV PDFs, project thumbnails, and device photos.
