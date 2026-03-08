--
-- PostgreSQL database dump
--

\restrict xw6xxjSDlKzxOAz0bjMEOrf5b8kmw73j0yA3ZytlLKAWHoiw18f00Qbl84degF2

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-02-15 16:00:32

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 16467)
-- Name: activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity (
    activity_id integer NOT NULL,
    user_id integer NOT NULL,
    pet_id integer NOT NULL,
    activity_type character varying(50) NOT NULL,
    activity_notes text,
    activity_timestamp timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.activity OWNER TO postgres;

--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE activity; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.activity IS 'Logs all pet-related activities (feeding, walking, vet visits, etc.)';


--
-- TOC entry 226 (class 1259 OID 16466)
-- Name: activity_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_activity_id_seq OWNER TO postgres;

--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 226
-- Name: activity_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_activity_id_seq OWNED BY public.activity.activity_id;


--
-- TOC entry 222 (class 1259 OID 16406)
-- Name: household; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.household (
    household_id integer NOT NULL,
    household_name character varying(100) NOT NULL,
    household_profile_picture character varying(500),
    invite_code character varying(50) NOT NULL
);


ALTER TABLE public.household OWNER TO postgres;

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE household; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.household IS 'Stores household/family groups that share pet ownership';


--
-- TOC entry 221 (class 1259 OID 16405)
-- Name: household_household_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.household_household_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.household_household_id_seq OWNER TO postgres;

--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 221
-- Name: household_household_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.household_household_id_seq OWNED BY public.household.household_id;


--
-- TOC entry 225 (class 1259 OID 16430)
-- Name: household_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.household_members (
    user_id integer NOT NULL,
    household_id integer NOT NULL,
    user_role character varying(50) DEFAULT 'member'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.household_members OWNER TO postgres;

--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE household_members; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.household_members IS 'Links users to households with roles';


--
-- TOC entry 224 (class 1259 OID 16420)
-- Name: pet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pet (
    pet_id integer NOT NULL,
    pet_name character varying(100) NOT NULL,
    pet_birthdate date,
    pet_species character varying(50),
    pet_gender character varying(20),
    owner_notes text,
    household_id integer
);


ALTER TABLE public.pet OWNER TO postgres;

--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE pet; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.pet IS 'Stores pet information';


--
-- TOC entry 223 (class 1259 OID 16419)
-- Name: pet_pet_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pet_pet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pet_pet_id_seq OWNER TO postgres;

--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 223
-- Name: pet_pet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pet_pet_id_seq OWNED BY public.pet.pet_id;


--
-- TOC entry 220 (class 1259 OID 16391)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    display_name character varying(100) NOT NULL,
    profile_picture character varying(500)
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE "user"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."user" IS 'Stores user account information';


--
-- TOC entry 219 (class 1259 OID 16390)
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_user_id_seq OWNER TO postgres;

--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- TOC entry 4779 (class 2604 OID 16470)
-- Name: activity activity_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity ALTER COLUMN activity_id SET DEFAULT nextval('public.activity_activity_id_seq'::regclass);


--
-- TOC entry 4775 (class 2604 OID 16409)
-- Name: household household_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household ALTER COLUMN household_id SET DEFAULT nextval('public.household_household_id_seq'::regclass);


--
-- TOC entry 4776 (class 2604 OID 16423)
-- Name: pet pet_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pet ALTER COLUMN pet_id SET DEFAULT nextval('public.pet_pet_id_seq'::regclass);


--
-- TOC entry 4774 (class 2604 OID 16394)
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- TOC entry 4959 (class 0 OID 16467)
-- Dependencies: 227
-- Data for Name: activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity (activity_id, user_id, pet_id, activity_type, activity_notes, activity_timestamp) FROM stdin;
1	1	1	WALKED	\N	2026-01-29 19:09:43.56705-08
2	1	1	PEE	\N	2026-01-29 19:09:43.56705-08
3	1	1	PEE	\N	2026-01-29 20:22:12.93-08
4	1	1	POOP	\N	2026-01-29 20:22:14.039-08
5	1	1	WALKED	\N	2026-01-29 20:22:14.78-08
6	1	1	FED	\N	2026-01-29 20:22:15.192-08
7	1	1	FED	\N	2026-01-28 20:22:32.328-08
8	1	1	POOP	\N	2026-01-29 20:34:03.095-08
9	1	1	WALKED	\N	2026-01-29 20:34:36.106-08
10	1	1	POOP	\N	2026-01-29 20:34:43.416-08
11	1	1	WALKED	\N	2026-01-29 20:35:10.668-08
12	1	1	PEE	\N	2026-01-30 18:15:23.766-08
13	1	1	PEE	\N	2026-01-30 18:25:37.267-08
14	1	1	WALKED	\N	2026-01-30 18:25:38.177-08
15	1	1	FED	\N	2026-01-30 18:25:38.615-08
16	1	1	PEE	\N	2026-01-30 18:25:39.176-08
17	1	1	WALKED	\N	2026-01-30 18:25:39.843-08
18	1	1	PEE	\N	2026-01-30 18:25:40.121-08
19	1	1	WALKED	\N	2026-01-30 18:25:40.894-08
20	1	1	PEE	\N	2026-01-30 18:25:41.336-08
21	1	1	POOP	\N	2026-01-30 18:25:41.706-08
22	1	1	PEE	\N	2026-01-30 18:25:42.582-08
23	1	1	WALKED	\N	2026-01-30 18:25:43.427-08
24	1	1	PEE	\N	2026-01-30 18:25:43.788-08
25	1	1	POOP	\N	2026-01-30 18:25:44.047-08
26	1	1	PEE	\N	2026-01-30 18:25:44.53-08
27	1	1	WALKED	\N	2026-01-30 18:25:45.052-08
28	1	1	PEE	\N	2026-01-30 18:32:07.206-08
29	1	1	WALKED	\N	2026-01-30 19:02:16.626-08
30	1	1	WALKED	\N	2026-01-30 19:23:27.578-08
31	1	1	PEE	\N	2026-01-30 19:23:28.1-08
32	1	1	POOP	\N	2026-01-30 19:23:28.613-08
33	1	1	WALKED	\N	2026-01-30 19:50:14.944-08
34	1	1	POOP	\N	2026-01-30 19:50:30.418-08
35	2	1	PEE	\N	2026-01-30 19:54:14.011-08
36	2	1	POOP	\N	2026-01-30 19:54:18.082-08
37	1	1	PEE	\N	2026-01-30 23:30:28.183-08
38	1	1	FED	\N	2026-01-30 23:30:30.735-08
39	1	1	PEE	\N	2026-01-31 00:27:04.266-08
40	1	1	WALKED	\N	2026-01-31 00:46:49.825-08
41	1	1	FED	\N	2026-01-31 00:48:25.985-08
42	1	1	WALKED	\N	2026-01-31 00:51:27.513-08
43	1	1	WALKED	\N	2026-01-31 00:51:44.868-08
44	1	1	FED	\N	2026-01-31 00:51:45.111-08
45	1	1	FED	\N	2026-01-31 00:51:45.251-08
46	1	1	FED	\N	2026-01-31 00:51:45.504-08
47	3	2	PEE	\N	2026-02-02 14:28:22.539-08
48	3	2	WALKED	\N	2026-02-02 14:28:23.046-08
49	3	2	FED	\N	2026-02-02 14:28:23.554-08
50	3	2	POOP	\N	2026-02-02 14:28:23.931-08
51	3	2	PEE	\N	2026-02-02 14:28:53.685-08
52	3	2	WALKED	\N	2026-02-02 14:28:54.131-08
53	3	2	FED	\N	2026-02-02 14:28:54.435-08
54	3	2	POOP	\N	2026-02-02 14:28:55.788-08
55	3	2	WALKED	\N	2026-02-02 14:30:30.133-08
56	3	2	FED	\N	2026-02-02 14:30:30.407-08
57	3	2	PEE	\N	2026-02-02 14:30:30.731-08
58	3	2	POOP	\N	2026-02-02 14:30:30.972-08
59	3	2	POOP	\N	2026-02-02 14:54:04.563-08
60	3	2	PEE	\N	2026-02-02 14:54:04.999-08
61	3	2	PEE	\N	2026-02-02 14:54:06.542-08
63	3	2	POOP	\N	2026-02-02 14:54:07.522-08
64	3	2	PEE	\N	2026-02-02 14:54:09.999-08
65	3	2	PEE	\N	2026-02-02 14:54:10.459-08
66	3	2	PEE	\N	2026-02-02 14:54:10.648-08
67	3	2	PEE	\N	2026-02-02 14:54:12.153-08
68	3	2	PEE	\N	2026-02-02 14:54:12.292-08
70	3	2	POOP	\N	2026-02-02 14:54:16.425-08
77	3	3	WALKED	\N	2026-02-02 17:32:37.169-08
78	3	3	WALKED	\N	2026-02-02 17:32:37.969-08
79	3	3	FED	\N	2026-02-02 17:32:38.4-08
80	3	4	PEE	\N	2026-02-02 17:32:48.649-08
81	3	4	WALKED	\N	2026-02-02 17:32:49.529-08
82	3	4	FED	\N	2026-02-02 17:32:49.806-08
83	3	3	FED	\N	2026-02-02 17:32:56.553-08
84	3	3	POOP	\N	2026-02-02 17:32:57.273-08
85	3	5	WALKED	\N	2026-02-02 17:40:07.381-08
86	3	5	PEE	\N	2026-02-02 17:40:07.798-08
87	3	5	POOP	\N	2026-02-02 17:40:08.062-08
88	3	2	FED	\N	2026-02-02 17:52:52.415-08
89	3	2	WALKED	\N	2026-02-02 17:52:52.895-08
90	3	2	PEE	\N	2026-02-02 17:52:53.186-08
91	3	2	POOP	\N	2026-02-02 17:52:53.439-08
92	3	2	FED	\N	2026-02-02 17:57:37.854-08
93	3	2	WALKED	\N	2026-02-02 17:57:39.596-08
94	3	3	FED	\N	2026-02-02 18:00:41.094-08
95	3	3	PEE	\N	2026-02-02 18:03:04.974-08
96	3	3	WALKED	\N	2026-02-02 18:03:09.425-08
97	5	8	FED	\N	2026-02-02 18:08:41.648-08
98	5	8	FED	\N	2026-02-02 18:08:51.717-08
99	3	2	POOP	\N	2026-02-02 23:24:14.071-08
101	3	2	WALKED	\N	2026-02-02 23:24:53.33-08
102	3	2	FED	\N	2026-02-02 23:24:56.327-08
103	3	2	FED	\N	2026-02-02 23:25:01.017-08
\.


--
-- TOC entry 4954 (class 0 OID 16406)
-- Dependencies: 222
-- Data for Name: household; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.household (household_id, household_name, household_profile_picture, invite_code) FROM stdin;
3	The Benavente's	\N	ZVD93K2C
4	bruno's home	\N	WEZ72ARR
5	f	\N	ENEC3WC4
6	Test	\N	73HQHA8C
7	eee	\N	242LTHRS
8	TestingBeforeBed	\N	PHFQYEEG
9	tester	\N	KPN8R6F4
10	gfdsfda	\N	Z3VEVXXZ
11	df	\N	T35C2TVE
12	The dogs	\N	5TE6DQTK
13	B	\N	5JAF8EGR
\.


--
-- TOC entry 4957 (class 0 OID 16430)
-- Dependencies: 225
-- Data for Name: household_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.household_members (user_id, household_id, user_role, created_at) FROM stdin;
1	3	Creator	2026-01-29 17:28:14.204507
1	4	Creator	2026-01-29 17:28:34.388068
1	5	Creator	2026-01-29 17:28:37.114042
2	3	Member	2026-01-30 19:54:06.656932
1	6	Creator	2026-01-31 00:20:55.572244
2	7	Creator	2026-01-31 00:24:19.072693
1	7	Member	2026-01-31 00:24:34.153025
2	8	Creator	2026-01-31 00:26:46.876392
1	8	Member	2026-01-31 00:27:09.518371
3	9	Creator	2026-02-02 14:28:16.15413
3	10	Creator	2026-02-02 14:45:02.178982
3	11	Creator	2026-02-02 14:45:26.674306
4	12	Creator	2026-02-02 18:04:41.62808
5	13	Creator	2026-02-02 18:08:27.665092
\.


--
-- TOC entry 4956 (class 0 OID 16420)
-- Dependencies: 224
-- Data for Name: pet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pet (pet_id, pet_name, pet_birthdate, pet_species, pet_gender, owner_notes, household_id) FROM stdin;
1	Bozo	\N	\N	\N	\N	3
2	a	\N	\N	\N	\N	9
3	s	\N	\N	\N	\N	9
4	s	\N	\N	\N	\N	9
5	Soba	\N	Dog	\N	\N	9
6	a	\N	a	\N	\N	10
7	Kobe	\N	Dog	\N	\N	12
8	A	\N	A	\N	\N	13
9	Nala	\N	Dog	\N	\N	13
10	z	\N	z	\N	\N	10
\.


--
-- TOC entry 4952 (class 0 OID 16391)
-- Dependencies: 220
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (user_id, email, password_hash, display_name, profile_picture) FROM stdin;
1	test@123.com	123	Kobe	\N
2	test456@test.com	123	Elayne	\N
3	123test@gmail.com	$2a$10$Urfu9V1SWn3n/JB.zzHEk./nRCyR4ioIIwFt2h.dmaQ2JvhxcJlrm	kobe	\N
4	d@123.com	$2a$10$mctxzag7DCgeLHQYfLM.5uLR7ookOUCtdLPn2d7AXix38O.B8zGEi	D	\N
5	b@gmail.com	$2a$10$C23.Ns2G3IhBmt.o2j26s.mnXoyJe9xX/iTjNUDI2Sog4GM8XkkxC	B	\N
\.


--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 226
-- Name: activity_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_activity_id_seq', 103, true);


--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 221
-- Name: household_household_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.household_household_id_seq', 13, true);


--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 223
-- Name: pet_pet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pet_pet_id_seq', 10, true);


--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_user_id_seq', 5, true);


--
-- TOC entry 4796 (class 2606 OID 16480)
-- Name: activity activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (activity_id);


--
-- TOC entry 4786 (class 2606 OID 16418)
-- Name: household household_invite_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household
    ADD CONSTRAINT household_invite_code_key UNIQUE (invite_code);


--
-- TOC entry 4793 (class 2606 OID 16438)
-- Name: household_members household_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_pkey PRIMARY KEY (user_id, household_id);


--
-- TOC entry 4788 (class 2606 OID 16416)
-- Name: household household_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household
    ADD CONSTRAINT household_pkey PRIMARY KEY (household_id);


--
-- TOC entry 4791 (class 2606 OID 16429)
-- Name: pet pet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pet
    ADD CONSTRAINT pet_pkey PRIMARY KEY (pet_id);


--
-- TOC entry 4782 (class 2606 OID 16404)
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- TOC entry 4784 (class 2606 OID 16402)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4797 (class 1259 OID 16491)
-- Name: idx_activity_pet_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_pet_id ON public.activity USING btree (pet_id);


--
-- TOC entry 4798 (class 1259 OID 16492)
-- Name: idx_activity_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_user_id ON public.activity USING btree (user_id);


--
-- TOC entry 4794 (class 1259 OID 16494)
-- Name: idx_household_members_household; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_household_members_household ON public.household_members USING btree (household_id);


--
-- TOC entry 4789 (class 1259 OID 24693)
-- Name: idx_pet_household_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pet_household_id ON public.pet USING btree (household_id);


--
-- TOC entry 4802 (class 2606 OID 16486)
-- Name: activity activity_pet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pet(pet_id) ON DELETE CASCADE;


--
-- TOC entry 4803 (class 2606 OID 16481)
-- Name: activity activity_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- TOC entry 4800 (class 2606 OID 16444)
-- Name: household_members household_members_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.household(household_id) ON DELETE CASCADE;


--
-- TOC entry 4801 (class 2606 OID 16439)
-- Name: household_members household_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- TOC entry 4799 (class 2606 OID 24688)
-- Name: pet pet_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pet
    ADD CONSTRAINT pet_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.household(household_id) ON DELETE CASCADE;


-- Completed on 2026-02-15 16:00:33

--
-- PostgreSQL database dump complete
--

\unrestrict xw6xxjSDlKzxOAz0bjMEOrf5b8kmw73j0yA3ZytlLKAWHoiw18f00Qbl84degF2

