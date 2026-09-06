-- =============================================================
-- Control de finanzas - Esquema de base de datos (Supabase/Postgres)
-- =============================================================

-- Tabla principal de transacciones
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  amount      numeric(12, 2) not null check (amount >= 0),
  type        text not null check (type in ('income', 'expense')),
  category    text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- Índice para ordenar por fecha de creación de forma descendente
create index if not exists transactions_created_at_idx
  on public.transactions (created_at desc);

-- =============================================================
-- Row Level Security (RLS)
-- =============================================================

-- Habilitar RLS en la tabla
alter table public.transactions enable row level security;

-- Política temporal de desarrollo: permite lectura/escritura pública.
-- IMPORTANTE: reemplazar por políticas autenticadas antes de producción.
drop policy if exists "public_dev_all" on public.transactions;

create policy "public_dev_all"
  on public.transactions
  for all
  using (true)
  with check (true);
