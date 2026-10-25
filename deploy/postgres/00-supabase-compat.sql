-- Supabase compatibility layer for the self-hosted database.
--
-- The public schema dumped from Supabase depends on a few Supabase objects:
-- the `extensions` schema (pgvector lives there), the anon/authenticated/
-- service_role roles named in RLS policies, auth.uid()/auth.role() used by
-- those policies, and auth.users, which seven tables reference by foreign key.
-- This file recreates exactly those, so the dump restores unchanged and user
-- ids stay stable when auth moves off Supabase.
--
-- Run as a superuser on a fresh database, before restoring the public dump:
--   psql -d jsonresume -f deploy/postgres/00-supabase-compat.sql
-- Definitions copied from Supabase (Postgres 15, auth schema as of 2026-10).

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Supabase's API roles have `extensions` on their search_path; the RPCs rely
-- on it to resolve vector operators such as <=>. Our app connects directly.
DO $$ BEGIN
  EXECUTE format('ALTER DATABASE %I SET search_path = "$user", public, extensions',
    current_database());
END $$;

DO $$
DECLARE r text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('CREATE ROLE %I NOLOGIN', r);
    END IF;
  END LOOP;
END $$;

CREATE SCHEMA IF NOT EXISTS auth;

CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
LANGUAGE sql STABLE AS $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

CREATE OR REPLACE FUNCTION auth.role() RETURNS text
LANGUAGE sql STABLE AS $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;

CREATE TABLE IF NOT EXISTS auth.users (
    instance_id uuid,
    id uuid NOT NULL PRIMARY KEY,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text UNIQUE DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone
      GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0
      CHECK (email_change_confirm_status >= 0 AND email_change_confirm_status <= 2),
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_partial_key
  ON auth.users (email) WHERE (is_sso_user = false);
CREATE INDEX IF NOT EXISTS users_instance_id_email_idx
  ON auth.users (instance_id, lower((email)::text));

CREATE TABLE IF NOT EXISTS auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider)
);

CREATE INDEX IF NOT EXISTS identities_user_id_idx ON auth.identities (user_id);
CREATE INDEX IF NOT EXISTS identities_email_idx
  ON auth.identities (email text_pattern_ops);
