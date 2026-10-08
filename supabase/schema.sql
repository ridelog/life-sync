-- Life-Sync initial schema. Run once on a dedicated Supabase project.
create table public.pets (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 data jsonb not null check (jsonb_typeof(data) = 'object' and length(data->>'name') > 0),
 created_at timestamptz not null default now(),
 unique (id,user_id)
);
create table public.entries (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 pet_id uuid not null,
 data jsonb not null check (data->>'kind' in ('health','diary','behavior') and data->>'date' ~ '^\d{4}-\d{2}-\d{2}$'),
 created_at timestamptz not null default now(),
 foreign key (pet_id,user_id) references public.pets(id,user_id) on delete cascade
);
create index entries_pet_owner on public.entries(user_id,pet_id);
alter table public.pets enable row level security;
alter table public.entries enable row level security;
create policy pets_owner on public.pets for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy entries_owner on public.entries for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
revoke all on public.pets,public.entries from anon;
grant select,insert,update,delete on public.pets,public.entries to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('pet-media','pet-media',false,26214400,array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime','application/pdf']);
create policy media_read on storage.objects for select to authenticated using (bucket_id='pet-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy media_insert on storage.objects for insert to authenticated with check (bucket_id='pet-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy media_delete on storage.objects for delete to authenticated using (bucket_id='pet-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
