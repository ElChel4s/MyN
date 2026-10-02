-- ==============================================================================
-- BITÁCORA DE CITAS • ESQUEMA DE BASE DE DATOS SUPABASE (POSTGRESQL)
-- Pareja: Marcelo (Slot 1 - Turquesa) y Nicole (Slot 2 - Morado)
-- ==============================================================================

-- 1. EXTENSIONES NECESARIAS
-- "uuid-ossp" para UUIDs y "pgcrypto" para hashear contraseñas con bcrypt (crypt)
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. TABLA: USUARIOS DE LA PAREJA (MARCELO Y NICOLE)
-- ==============================================================================
-- Solo existen 2 usuarios. Permite apodos opcionales editables en cualquier momento.
-- Las contraseñas se almacenan hasheadas con bcrypt vía pgcrypto sin validaciones molestas.
create table if not exists public.couple_users (
  id uuid primary key default gen_random_uuid(),
  user_slot smallint not null unique check (user_slot in (1, 2)),
  username text unique not null,          -- 'marcelo', 'nicole'
  real_name text not null,                -- 'Marcelo', 'Nicole'
  nickname text,                          -- Apodo opcional (ej: 'Marce', 'Nico', 'Mi amor'), editable
  password_hash text not null,            -- Contraseña hasheada con crypt(password, gen_salt('bf'))
  color_theme text not null check (color_theme in ('teal', 'purple')),
  avatar_url text,                        -- Foto o avatar opcional
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 3. INSERCIÓN INICIAL DE MARCELO Y NICOLE
-- ==============================================================================
-- Contraseñas iniciales de ejemplo hasheadas con bcrypt:
-- Marcelo -> usuario: marcelo | contraseña: 123
-- Nicole  -> usuario: nicole  | contraseña: 123
-- (Pueden cambiar la contraseña o su apodo cuando gusten mediante las funciones RPC de abajo)
insert into public.couple_users (user_slot, username, real_name, nickname, password_hash, color_theme)
values
  (
    1,
    'marcelo',
    'Marcelo',
    'Marce',
    crypt('123', gen_salt('bf', 8)),
    'teal'
  ),
  (
    2,
    'nicole',
    'Nicole',
    'Nico',
    crypt('123', gen_salt('bf', 8)),
    'purple'
  )
on conflict (user_slot) do update set
  real_name = excluded.real_name,
  color_theme = excluded.color_theme;

-- ==============================================================================
-- 4. FUNCIONES DE AUTENTICACIÓN Y GESTIÓN DE APODOS / CONTRASEÑAS (RPC)
-- ==============================================================================

-- A) Iniciar sesión directo y sin validaciones complejas:
-- Recibe usuario (o apodo) y contraseña, compara el hash y retorna la sesión
create or replace function public.login_couple_user(
  p_username text,
  p_password text
)
returns table (
  id uuid,
  user_slot smallint,
  username text,
  real_name text,
  nickname text,
  color_theme text,
  display_name text
)
language plpgsql
security definer
as $$
begin
  return query
  select 
    u.id,
    u.user_slot,
    u.username,
    u.real_name,
    u.nickname,
    u.color_theme,
    coalesce(nullif(trim(u.nickname), ''), u.real_name) as display_name
  from public.couple_users u
  where (lower(u.username) = lower(trim(p_username)) or lower(u.real_name) = lower(trim(p_username)))
    and u.password_hash = crypt(trim(p_password), u.password_hash);
end;
$$;

-- B) Actualizar el apodo opcional de cualquiera de los dos (editable en cualquier momento):
create or replace function public.update_couple_nickname(
  p_user_slot smallint,
  p_nickname text
)
returns text
language plpgsql
security definer
as $$
declare
  v_new_nickname text;
begin
  v_new_nickname := trim(p_nickname);
  update public.couple_users
  set 
    nickname = v_new_nickname,
    updated_at = timezone('utc'::text, now())
  where user_slot = p_user_slot;

  return v_new_nickname;
end;
$$;

-- C) Cambiar la contraseña (se hashea automáticamente sin exigencias de longitud ni símbolos):
create or replace function public.update_couple_password(
  p_user_slot smallint,
  p_new_password text
)
returns boolean
language plpgsql
security definer
as $$
begin
  update public.couple_users
  set 
    password_hash = crypt(trim(p_new_password), gen_salt('bf', 8)),
    updated_at = timezone('utc'::text, now())
  where user_slot = p_user_slot;

  return true;
end;
$$;

-- ==============================================================================
-- 5. TABLA: PLANES Y BANCO DE IDEAS (SIN FOTOS, AÚN PENDIENTES)
-- ==============================================================================
-- Para anotar ideas rápidas o completas sin presión.
-- Soporta enlaces multimedia (Google Maps, TikTok, Reels) y checklist colaborativo.
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location_name text default '',
  tentative_date text default '',
  planning_notes text default '',
  -- Enlaces de referencia: [{ "id": "ref-1", "label": "Google Maps", "url": "https://..." }]
  "references" jsonb default '[]'::jsonb not null,
  -- Tareas colaborativas: [{ "id": "chk-1", "item": "Comprar postre", "completed": false }]
  checklist jsonb default '[]'::jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  created_by_slot smallint check (created_by_slot in (1, 2)),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 6. TABLA: CITAS (EN CURSO "ONGOING" Y COMPLETADAS EN BITÁCORA)
-- ==============================================================================
create sequence if not exists public.date_counter_seq start with 1;

create table if not exists public.dates (
  id uuid primary key default gen_random_uuid(),
  date_number integer not null default nextval('public.date_counter_seq'),
  stamp_code text,                                          -- Ej: 'CITA #001'
  title text not null,
  status text not null default 'ongoing' check (status in ('ongoing', 'completed')),
  location_name text default '',
  scheduled_date text default '',                           -- Fecha visual artesanal (ej: '30 Sep 2026')
  gerbera_color text default 'purple',                      -- 'purple', 'teal', 'aqua', 'lavender', 'mixed'
  origin_plan_id uuid references public.plans(id) on delete set null,
  
  -- Recuerdos de la cita
  random_quote text default '',                             -- Frase random o graciosa
  person1_liked text default '',                            -- Lo que más le gustó a Marcelo
  person2_liked text default '',                            -- Lo que más le gustó a Nicole
  person1_nice_note text default '',                        -- Nota linda de Marcelo para Nicole
  person2_nice_note text default '',                        -- Nota linda de Nicole para Marcelo
  
  created_by_slot smallint check (created_by_slot in (1, 2)),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger para autogenerar el stamp_code si no viene especificado (ej: CITA #001)
create or replace function public.fn_auto_stamp_code()
returns trigger
language plpgsql
as $$
begin
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

-- ==============================================================================
-- 7. TABLA: FOTOS POLAROID (CON NOTA SECRETA AL DORSO)
-- ==============================================================================
create table if not exists public.date_photos (
  id uuid primary key default gen_random_uuid(),
  date_id uuid not null references public.dates(id) on delete cascade,
  photo_url text not null,
  caption text default '',                                  -- Pie de foto frontal
  secret_back text default '',                              -- Nota secreta escrita al reverso
  rotation text default '-2deg',                            -- Inclinación artesanal (ej: '-2deg', '2deg')
  order_index smallint default 0,
  uploaded_by_slot smallint check (uploaded_by_slot in (1, 2)),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 8. TRIGGER UNIVERSAL PARA UPDATED_AT
-- ==============================================================================
create or replace function public.fn_update_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists tr_plans_updated on public.plans;
create trigger tr_plans_updated
  before update on public.plans
  for each row execute function public.fn_update_timestamp();

drop trigger if exists tr_dates_updated on public.dates;
create trigger tr_dates_updated
  before update on public.dates
  for each row execute function public.fn_update_timestamp();

drop trigger if exists tr_couple_users_updated on public.couple_users;
create trigger tr_couple_users_updated
  before update on public.couple_users
  for each row execute function public.fn_update_timestamp();

-- ==============================================================================
-- 9. SEGURIDAD DIRECTA Y SIN COMPLICACIONES (ROW LEVEL SECURITY)
-- ==============================================================================
-- Como es una bitácora íntima de 2 personas, habilitamos RLS permitiendo acceso total
-- a las tablas para que el cliente web pueda sincronizar todo con la clave anónima de Supabase.

alter table public.couple_users enable row level security;
alter table public.plans enable row level security;
alter table public.dates enable row level security;
alter table public.date_photos enable row level security;

-- Políticas libres de lectura y escritura para la pareja:
drop policy if exists "Acceso total a usuarios" on public.couple_users;
create policy "Acceso total a usuarios" on public.couple_users for all using (true) with check (true);

drop policy if exists "Acceso total a planes" on public.plans;
create policy "Acceso total a planes" on public.plans for all using (true) with check (true);

drop policy if exists "Acceso total a citas" on public.dates;
create policy "Acceso total a citas" on public.dates for all using (true) with check (true);

drop policy if exists "Acceso total a fotos" on public.date_photos;
create policy "Acceso total a fotos" on public.date_photos for all using (true) with check (true);

-- ==============================================================================
-- 10. STORAGE: BUCKET DE FOTOS POLAROID
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('polaroids', 'polaroids', true)
on conflict (id) do update set public = true;

drop policy if exists "Cualquiera puede ver polaroids" on storage.objects;
create policy "Cualquiera puede ver polaroids"
  on storage.objects for select
  using (bucket_id = 'polaroids');

drop policy if exists "La pareja puede subir fotos" on storage.objects;
create policy "La pareja puede subir fotos"
  on storage.objects for insert
  with check (bucket_id = 'polaroids');

drop policy if exists "La pareja puede borrar fotos" on storage.objects;
create policy "La pareja puede borrar fotos"
  on storage.objects for delete
  using (bucket_id = 'polaroids');

-- ==============================================================================
-- 11. SUPABASE REALTIME (SINCRONIZACIÓN EN VIVO SIN CONFLICTOS)
-- ==============================================================================
-- Sincroniza al instante cuando Marcelo o Nicole agregan fotos, frases o tachan checklists.
-- Comprueba si cada tabla ya está suscrita para evitar el error "relation is already member of publication".
do $$
begin
  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime' and c.relname = 'couple_users'
  ) then
    alter publication supabase_realtime add table public.couple_users;
  end if;

  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime' and c.relname = 'plans'
  ) then
    alter publication supabase_realtime add table public.plans;
  end if;

  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime' and c.relname = 'dates'
  ) then
    alter publication supabase_realtime add table public.dates;
  end if;

  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime' and c.relname = 'date_photos'
  ) then
    alter publication supabase_realtime add table public.date_photos;
  end if;
end;
$$;