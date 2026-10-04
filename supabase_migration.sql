-- ==============================================================================
-- BITÁCORA DE RECUERDOS (M&N) • MIGRACIÓN DE REPARACIÓN Y TIEMPO REAL
-- Ejecuta este script completo en el SQL Editor de tu panel de Supabase.
-- ==============================================================================

-- 1. SECUENCIA PARA CONTADOR DE CITAS
create sequence if not exists public.date_counter_seq start with 1;

-- 2. ASEGURAR COLUMNAS EN LA TABLA "DATES" (CITAS)
-- Si la tabla ya existía, alter table agrega las columnas faltantes sin borrar datos.
alter table public.dates add column if not exists date_number integer default nextval('public.date_counter_seq');
alter table public.dates add column if not exists stamp_code text;
alter table public.dates add column if not exists title text not null default 'Nuestra Cita';
alter table public.dates add column if not exists status text not null default 'ongoing';
alter table public.dates add column if not exists location_name text default '';
alter table public.dates add column if not exists scheduled_date text default '';
alter table public.dates add column if not exists gerbera_color text default 'teal';
alter table public.dates add column if not exists origin_plan_id uuid;
alter table public.dates add column if not exists random_quote text default '';
alter table public.dates add column if not exists person1_liked text default '';
alter table public.dates add column if not exists person2_liked text default '';
alter table public.dates add column if not exists person1_nice_note text default '';
alter table public.dates add column if not exists person2_nice_note text default '';
alter table public.dates add column if not exists created_by_slot smallint default 1;
alter table public.dates add column if not exists created_at timestamp with time zone default timezone('utc'::text, now());
alter table public.dates add column if not exists completed_at timestamp with time zone;
alter table public.dates add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- 3. ASEGURAR COLUMNAS EN LA TABLA "PLANS" (PLANES / IDEAS)
alter table public.plans add column if not exists status text not null default 'pending';
alter table public.plans add column if not exists created_by_slot smallint default 1;
alter table public.plans add column if not exists "references" jsonb not null default '[]'::jsonb;
alter table public.plans add column if not exists checklist jsonb not null default '[]'::jsonb;

-- 4. ASEGURAR TABLA "DATE_PHOTOS" (FOTOS POLAROID)
create table if not exists public.date_photos (
  id uuid primary key default gen_random_uuid(),
  date_id uuid not null references public.dates(id) on delete cascade,
  photo_url text not null,
  caption text default '',
  secret_back text default '',
  rotation text default '-2deg',
  order_index smallint default 0,
  uploaded_by_slot smallint check (uploaded_by_slot in (1, 2)),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.date_photos add column if not exists caption text default '';
alter table public.date_photos add column if not exists secret_back text default '';
alter table public.date_photos add column if not exists rotation text default '-2deg';
alter table public.date_photos add column if not exists order_index smallint default 0;
alter table public.date_photos add column if not exists uploaded_by_slot smallint default 1;

-- 5. TRIGGER SEGURO PARA EL SELLO DE CITA (CITA #001)
create or replace function public.fn_auto_stamp_code()
returns trigger
language plpgsql
as $$
begin
  if new.date_number is null then
    new.date_number := nextval('public.date_counter_seq');
  end if;
  if new.stamp_code is null or trim(new.stamp_code) = '' then
    new.stamp_code := 'CITA #' || lpad(new.date_number::text, 3, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists tr_auto_stamp_code on public.dates;
create trigger tr_auto_stamp_code
  before insert on public.dates
  for each row execute function public.fn_auto_stamp_code();

-- 6. PERMISOS Y SEGURIDAD RLS (ROW LEVEL SECURITY)
alter table public.couple_users enable row level security;
alter table public.plans enable row level security;
alter table public.dates enable row level security;
alter table public.date_photos enable row level security;

drop policy if exists "Acceso total a usuarios" on public.couple_users;
create policy "Acceso total a usuarios" on public.couple_users for all using (true) with check (true);

drop policy if exists "Acceso total a planes" on public.plans;
create policy "Acceso total a planes" on public.plans for all using (true) with check (true);

drop policy if exists "Acceso total a citas" on public.dates;
create policy "Acceso total a citas" on public.dates for all using (true) with check (true);

drop policy if exists "Acceso total a fotos" on public.date_photos;
create policy "Acceso total a fotos" on public.date_photos for all using (true) with check (true);

-- 7. REPLICA IDENTITY FULL (IMPRESCINDIBLE PARA REALTIME WEBSOCKETS EN SUPABASE)
-- Esto permite que Supabase envíe todos los campos del registro modificado a través del WebSocket.
alter table public.couple_users replica identity full;
alter table public.plans replica identity full;
alter table public.dates replica identity full;
alter table public.date_photos replica identity full;

-- 8. REGISTRO EN LA PUBLICACIÓN DE REALTIME SIN CONFLICTOS
do $$
begin
  if not exists (
    select 1 from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime' and c.relname = 'couple_users'
  ) then
    alter publication supabase_realtime add table public.couple_users;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime' and c.relname = 'plans'
  ) then
    alter publication supabase_realtime add table public.plans;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime' and c.relname = 'dates'
  ) then
    alter publication supabase_realtime add table public.dates;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime' and c.relname = 'date_photos'
  ) then
    alter publication supabase_realtime add table public.date_photos;
  end if;
end;
$$;
