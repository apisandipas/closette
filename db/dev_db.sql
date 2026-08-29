--
-- PostgreSQL database dump
--

\restrict 8jRItfBe6ssek4M32hiXemCHJmfhe0VR6cza9Zy4Wl8GI72mo0HNYaIzNTg48Bw

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.types DROP CONSTRAINT IF EXISTS types_user_id_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS session_user_id_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.items DROP CONSTRAINT IF EXISTS items_user_id_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.items DROP CONSTRAINT IF EXISTS items_type_id_types_id_fk;
ALTER TABLE IF EXISTS ONLY public.items DROP CONSTRAINT IF EXISTS items_closet_id_closets_id_fk;
ALTER TABLE IF EXISTS ONLY public.items DROP CONSTRAINT IF EXISTS items_brand_id_brands_id_fk;
ALTER TABLE IF EXISTS ONLY public.closets DROP CONSTRAINT IF EXISTS closets_user_id_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.brands DROP CONSTRAINT IF EXISTS brands_user_id_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.account DROP CONSTRAINT IF EXISTS account_user_id_user_id_fk;
DROP INDEX IF EXISTS public.verification_identifier_idx;
DROP INDEX IF EXISTS public."types_userId_idx";
DROP INDEX IF EXISTS public."session_userId_idx";
DROP INDEX IF EXISTS public."items_userId_idx";
DROP INDEX IF EXISTS public."items_typeId_idx";
DROP INDEX IF EXISTS public."items_closetId_idx";
DROP INDEX IF EXISTS public."items_brandId_idx";
DROP INDEX IF EXISTS public."closets_userId_idx";
DROP INDEX IF EXISTS public."brands_userId_idx";
DROP INDEX IF EXISTS public."account_userId_idx";
ALTER TABLE IF EXISTS ONLY public.verification DROP CONSTRAINT IF EXISTS verification_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_email_unique;
ALTER TABLE IF EXISTS ONLY public.types DROP CONSTRAINT IF EXISTS types_pkey;
ALTER TABLE IF EXISTS ONLY public.types DROP CONSTRAINT IF EXISTS types_name_unique;
ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS session_token_unique;
ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS session_pkey;
ALTER TABLE IF EXISTS ONLY public.items DROP CONSTRAINT IF EXISTS items_pkey;
ALTER TABLE IF EXISTS ONLY public.closets DROP CONSTRAINT IF EXISTS closets_pkey;
ALTER TABLE IF EXISTS ONLY public.brands DROP CONSTRAINT IF EXISTS brands_pkey;
ALTER TABLE IF EXISTS ONLY public.brands DROP CONSTRAINT IF EXISTS brands_name_unique;
ALTER TABLE IF EXISTS ONLY public.account DROP CONSTRAINT IF EXISTS account_pkey;
ALTER TABLE IF EXISTS ONLY drizzle.__drizzle_migrations DROP CONSTRAINT IF EXISTS __drizzle_migrations_pkey;
ALTER TABLE IF EXISTS drizzle.__drizzle_migrations ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.verification;
DROP TABLE IF EXISTS public."user";
DROP TABLE IF EXISTS public.types;
DROP TABLE IF EXISTS public.session;
DROP TABLE IF EXISTS public.items;
DROP TABLE IF EXISTS public.closets;
DROP TABLE IF EXISTS public.brands;
DROP TABLE IF EXISTS public.account;
DROP SEQUENCE IF EXISTS drizzle.__drizzle_migrations_id_seq;
DROP TABLE IF EXISTS drizzle.__drizzle_migrations;
DROP SCHEMA IF EXISTS drizzle;
--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id text NOT NULL,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    user_id text NOT NULL,
    access_token text,
    refresh_token text,
    id_token text,
    access_token_expires_at timestamp without time zone,
    refresh_token_expires_at timestamp without time zone,
    scope text,
    password text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: closets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.closets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.closets OWNER TO postgres;

--
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    image text,
    year integer DEFAULT 1959 NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    closet_id uuid,
    type_id uuid,
    brand_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id text NOT NULL
);


ALTER TABLE public.items OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    id text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    ip_address text,
    user_agent text,
    user_id text NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.types OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    image text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: verification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.verification OWNER TO postgres;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	cf8f7eb9bfcead29b618b0ee26d2fb761f72e526f07fc62b1083c2dcff5b7b0e	1785002759231
2	97860ca5bac2c40288bb3ba2d9911873cfa208c47dffe7656fd8180ba19be6de	1787428311350
3	14f4bbc5fc32c1e32373fb885e084d553f7f630ac797d3947e032238fc3713ce	1787434372696
4	383175bce196ce2712b13e5d73ce23829763fabbd0811a7ed2cbe24e0a42764f	1787486437451
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at) FROM stdin;
AzTfAdjM7atF8hqreCQh0Y0Iso3i74qU	L4ajNfdbW9fL6oaklcBKOR43Ug1ld22s	credential	L4ajNfdbW9fL6oaklcBKOR43Ug1ld22s	\N	\N	\N	\N	\N	\N	cb259ea06ba2be3cc712df66eb966103:f1e98f8fbf13e88715f23b2c25b507fc0f1766c884469b68dbea36abd829fbb7abe9078c1b1228f4fb674599e054e26257b5cac84e1fcafaf93b77b3ec4dabde	2026-08-23 08:53:33.408	2026-08-23 08:53:33.408
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, name, user_id, created_at, updated_at) FROM stdin;
2d6c04b4-6652-4c1e-ad12-b598e8f910f0	Mattel	L4ajNfdbW9fL6oaklcBKOR43Ug1ld22s	2026-08-23 12:11:30.350871+00	2026-08-23 12:11:30.350871+00
\.


--
-- Data for Name: closets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.closets (id, name, user_id, created_at, updated_at) FROM stdin;
17ff0736-1ccb-4e73-a539-659cb9ffa45c	Kat	L4ajNfdbW9fL6oaklcBKOR43Ug1ld22s	2026-08-23 11:01:55.543814+00	2026-08-23 11:01:55.543814+00
2d82f21f-1f24-45e7-9870-3c4e16389d15	Mads	L4ajNfdbW9fL6oaklcBKOR43Ug1ld22s	2026-08-23 11:05:10.815888+00	2026-08-23 11:05:10.815888+00
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, name, image, year, quantity, closet_id, type_id, brand_id, created_at, updated_at, user_id) FROM stdin;
34228eb2-aa1d-4d5b-b538-c91b277e6230	Cool Blue Barbie	\N	1997	1	2d82f21f-1f24-45e7-9870-3c4e16389d15	989153cb-5931-4e4c-8ea2-f4f5bea9b2c3	2d6c04b4-6652-4c1e-ad12-b598e8f910f0	2026-08-23 10:07:36.886887+00	2026-08-23 10:07:36.886887+00	L4ajNfdbW9fL6oaklcBKOR43Ug1ld22s
f52fbbbf-c42f-449d-bf5e-c4dca6009681	Too Cool Teen Skipper	\N	1998	2	17ff0736-1ccb-4e73-a539-659cb9ffa45c	989153cb-5931-4e4c-8ea2-f4f5bea9b2c3	2d6c04b4-6652-4c1e-ad12-b598e8f910f0	2026-08-23 08:56:48.777138+00	2026-08-23 08:56:48.777138+00	L4ajNfdbW9fL6oaklcBKOR43Ug1ld22s
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) FROM stdin;
BT1R8hiE5nknsShzdKl86k9OQCFzWUZT	2026-09-05 09:16:54.918	3DFtK8hkqnv04bFVxMuT1DqNk7lnWlKZ	2026-08-23 08:53:33.419	2026-08-29 09:16:54.918	127.0.0.1	Mozilla/5.0 (X11; Linux x86_64; rv:153.0) Gecko/20100101 Firefox/153.0	L4ajNfdbW9fL6oaklcBKOR43Ug1ld22s
\.


--
-- Data for Name: types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.types (id, name, user_id, created_at, updated_at) FROM stdin;
989153cb-5931-4e4c-8ea2-f4f5bea9b2c3	T-Shirt	L4ajNfdbW9fL6oaklcBKOR43Ug1ld22s	2026-08-23 12:12:48.480983+00	2026-08-23 12:12:48.480983+00
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, name, email, email_verified, image, created_at, updated_at) FROM stdin;
L4ajNfdbW9fL6oaklcBKOR43Ug1ld22s	Bryan Example	bryan@example.com	f	\N	2026-08-23 08:53:33.4	2026-08-23 08:53:33.4
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification (id, identifier, value, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 4, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: brands brands_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_name_unique UNIQUE (name);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: closets closets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.closets
    ADD CONSTRAINT closets_pkey PRIMARY KEY (id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_token_unique UNIQUE (token);


--
-- Name: types types_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types
    ADD CONSTRAINT types_name_unique UNIQUE (name);


--
-- Name: types types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types
    ADD CONSTRAINT types_pkey PRIMARY KEY (id);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: account_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "account_userId_idx" ON public.account USING btree (user_id);


--
-- Name: brands_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "brands_userId_idx" ON public.brands USING btree (user_id);


--
-- Name: closets_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "closets_userId_idx" ON public.closets USING btree (user_id);


--
-- Name: items_brandId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "items_brandId_idx" ON public.items USING btree (brand_id);


--
-- Name: items_closetId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "items_closetId_idx" ON public.items USING btree (closet_id);


--
-- Name: items_typeId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "items_typeId_idx" ON public.items USING btree (type_id);


--
-- Name: items_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "items_userId_idx" ON public.items USING btree (user_id);


--
-- Name: session_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "session_userId_idx" ON public.session USING btree (user_id);


--
-- Name: types_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "types_userId_idx" ON public.types USING btree (user_id);


--
-- Name: verification_identifier_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX verification_identifier_idx ON public.verification USING btree (identifier);


--
-- Name: account account_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: brands brands_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: closets closets_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.closets
    ADD CONSTRAINT closets_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: items items_brand_id_brands_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_brand_id_brands_id_fk FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE SET NULL;


--
-- Name: items items_closet_id_closets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_closet_id_closets_id_fk FOREIGN KEY (closet_id) REFERENCES public.closets(id) ON DELETE SET NULL;


--
-- Name: items items_type_id_types_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_type_id_types_id_fk FOREIGN KEY (type_id) REFERENCES public.types(id) ON DELETE SET NULL;


--
-- Name: items items_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: session session_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: types types_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types
    ADD CONSTRAINT types_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 8jRItfBe6ssek4M32hiXemCHJmfhe0VR6cza9Zy4Wl8GI72mo0HNYaIzNTg48Bw

