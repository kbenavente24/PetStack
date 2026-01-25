--
-- PostgreSQL database dump
--

\restrict coPYnqbqPoFhvzNpdasv6ZeIQANTpsT2952zG7BBY1per4DqxmaVmsMVjJ9AU7H

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-22 18:44:40

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
    activity_date date NOT NULL,
    activity_time time without time zone NOT NULL,
    activity_notes text
);


ALTER TABLE public.activity OWNER TO postgres;

--
-- TOC entry 4964 (class 0 OID 0)
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
-- TOC entry 4965 (class 0 OID 0)
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
-- TOC entry 4966 (class 0 OID 0)
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
-- TOC entry 4967 (class 0 OID 0)
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
    user_role character varying(50) DEFAULT 'member'::character varying NOT NULL
);


ALTER TABLE public.household_members OWNER TO postgres;

--
-- TOC entry 4968 (class 0 OID 0)
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
-- TOC entry 4969 (class 0 OID 0)
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
-- TOC entry 4970 (class 0 OID 0)
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
-- TOC entry 4971 (class 0 OID 0)
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
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- TOC entry 4778 (class 2604 OID 16470)
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
-- TOC entry 4958 (class 0 OID 16467)
-- Dependencies: 227
-- Data for Name: activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity (activity_id, user_id, pet_id, activity_type, activity_date, activity_time, activity_notes) FROM stdin;
1	1	2	FED	2026-01-09	08:30:00	\N
2	1	2	WALKED	2026-01-09	08:30:00	\N
4	1	2	FED	2026-01-10	08:30:00	\N
3	1	2	FED	2026-01-09	08:30:00	\N
5	1	2	WALKED	2026-01-20	21:08:33	\N
6	1	2	WALKED	2026-01-20	21:08:40	\N
7	1	2	PEE	2026-01-20	21:09:01	\N
8	1	2	PEE	2026-01-20	21:09:50	\N
9	1	2	PEE	2026-01-20	21:11:38	\N
10	1	2	PEE	2026-01-20	21:13:05	\N
11	1	2	WALKED	2026-01-20	21:13:11	\N
12	1	2	WALKED	2026-01-20	21:13:55	\N
13	1	2	PEE	2026-01-20	21:25:45	\N
14	1	2	WALKED	2026-01-20	21:25:50	\N
15	1	2	WALKED	2026-01-20	21:25:51	\N
16	1	2	WALKED	2026-01-20	21:25:52	\N
17	1	2	WALKED	2026-01-20	21:25:52	\N
18	1	2	WALKED	2026-01-20	21:25:53	\N
19	1	2	WALKED	2026-01-20	21:25:53	\N
44	1	2	POOP	2026-01-20	21:35:01	\N
45	1	2	FED	2026-01-20	21:35:04	\N
46	1	2	WALKED	2026-01-20	21:35:07	\N
47	1	2	FED	2026-01-20	21:35:08	\N
48	1	2	POOP	2026-01-20	21:35:12	\N
49	1	2	POOP	2026-01-20	21:36:06	\N
50	1	2	FED	2026-01-20	21:36:11	\N
51	1	2	WALKED	2026-01-20	21:37:39	\N
52	1	2	WALKED	2026-01-20	21:37:40	\N
53	1	2	WALKED	2026-01-20	21:37:40	\N
54	1	2	PEE	2026-01-20	21:37:55	\N
55	1	2	PEE	2026-01-20	21:37:56	\N
56	1	2	PEE	2026-01-20	21:37:57	\N
57	1	2	WALKED	2026-01-21	14:06:26	\N
58	1	2	PEE	2026-01-21	14:06:27	\N
59	1	2	POOP	2026-01-21	14:06:27	\N
60	1	2	FED	2026-01-21	14:06:30	\N
61	1	2	FED	2026-01-21	14:06:31	\N
62	1	2	FED	2026-01-21	14:06:33	\N
63	4	17	WALKED	2026-01-22	17:37:53	\N
64	4	17	WALKED	2026-01-22	17:37:53	\N
65	4	17	PEE	2026-01-22	17:37:54	\N
66	4	17	PEE	2026-01-22	17:37:54	\N
67	4	17	POOP	2026-01-22	17:37:55	\N
68	4	17	POOP	2026-01-22	17:37:55	\N
69	4	17	FED	2026-01-22	17:37:56	\N
70	4	17	FED	2026-01-22	17:37:56	\N
71	4	17	WALKED	2026-01-22	17:39:11	\N
72	4	17	WALKED	2026-01-22	17:39:11	\N
73	4	17	WALKED	2026-01-22	17:48:02	\N
74	4	17	POOP	2026-01-22	17:48:04	\N
75	4	17	POOP	2026-01-22	17:48:05	\N
76	4	17	POOP	2026-01-22	17:48:08	\N
77	4	17	POOP	2026-01-22	17:48:08	\N
78	6	18	WALKED	2026-01-22	17:48:37	\N
79	6	18	WALKED	2026-01-22	17:48:37	\N
80	6	18	FED	2026-01-22	17:48:38	\N
81	6	18	FED	2026-01-22	17:48:38	\N
82	6	18	PEE	2026-01-22	17:48:39	\N
83	6	18	PEE	2026-01-22	17:48:39	\N
84	7	19	WALKED	2026-01-22	17:56:17	\N
85	7	19	PEE	2026-01-22	17:56:19	\N
86	7	19	POOP	2026-01-22	17:56:19	\N
87	7	19	FED	2026-01-22	17:56:20	\N
88	7	19	WALKED	2026-01-22	17:56:22	\N
89	7	19	FED	2026-01-22	17:56:22	\N
90	7	19	PEE	2026-01-22	17:56:23	\N
91	7	19	POOP	2026-01-22	17:56:23	\N
92	7	19	FED	2026-01-22	17:56:23	\N
93	7	19	WALKED	2026-01-22	17:56:25	\N
94	7	19	POOP	2026-01-22	17:56:41	\N
95	7	19	POOP	2026-01-22	17:56:41	\N
96	7	19	POOP	2026-01-22	17:56:41	\N
97	7	19	WALKED	2026-01-22	17:56:43	\N
98	7	19	FED	2026-01-22	17:56:43	\N
99	7	19	PEE	2026-01-22	17:56:44	\N
100	8	20	WALKED	2026-01-22	18:50:10	\N
101	8	20	PEE	2026-01-22	18:50:12	\N
102	8	20	POOP	2026-01-22	18:50:12	\N
103	8	20	FED	2026-01-22	18:50:13	\N
\.


--
-- TOC entry 4953 (class 0 OID 16406)
-- Dependencies: 222
-- Data for Name: household; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.household (household_id, household_name, household_profile_picture, invite_code) FROM stdin;
1	Test Household	\N	FILLER CODE
3	test	\N	123
4	bruno's home	\N	1234
6	aaa	\N	E95QN57J
7	asfxc	\N	K4RDWHAC
8	4	\N	RLMHGUVX
9	hhh	\N	Y2VWCVV4
10	testingtoday	\N	KZD6FFDV
11	testingtoday	\N	66NF8HEH
\.


--
-- TOC entry 4956 (class 0 OID 16430)
-- Dependencies: 225
-- Data for Name: household_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.household_members (user_id, household_id, user_role) FROM stdin;
1	1	owner
2	1	TEST
9	3	Creator
9	4	Creator
9	6	Creator
9	7	Creator
9	8	Creator
9	9	Creator
1	10	Creator
1	11	Creator
\.


--
-- TOC entry 4955 (class 0 OID 16420)
-- Dependencies: 224
-- Data for Name: pet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pet (pet_id, pet_name, pet_birthdate, pet_species, pet_gender, owner_notes, household_id) FROM stdin;
2	Nala	\N	\N	\N	\N	\N
3	asd	\N	\N	\N	\N	\N
4	asd	\N	\N	\N	\N	\N
5	asd	\N	\N	\N	\N	\N
6	asdasdasd	\N	\N	\N	\N	\N
7	Hddkf	\N	\N	\N	\N	\N
8	sdf	\N	\N	\N	\N	\N
9	111	\N	\N	\N	\N	\N
10	123	\N	\N	\N	\N	\N
11	444	\N	\N	\N	\N	\N
12	23232	\N	\N	\N	\N	\N
13	jjj	\N	\N	\N	\N	\N
14	fdfdsf	\N	\N	\N	\N	\N
15	asdasd	\N	\N	\N	\N	\N
16	21321	\N	\N	\N	\N	\N
17	a	\N	\N	\N	\N	\N
18	a	\N	\N	\N	\N	\N
19	z	\N	\N	\N	\N	\N
20	2	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4951 (class 0 OID 16391)
-- Dependencies: 220
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (user_id, email, password_hash, display_name, profile_picture) FROM stdin;
2	gay@123.com	gay1234	yessirski	\N
3	test@test.com	aaa	billy bob jenkins	\N
4	kobe123@test.com	123	kobekobekobe	\N
5	111@test	111	111	\N
1	test@example.com	password123	kobe	\N
6	a@a	a	a	\N
7	z@z	z	z	\N
8	2@2	2	2	\N
9	householdtest@gmail.com	123	bruno	\N
\.


--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 226
-- Name: activity_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_activity_id_seq', 103, true);


--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 221
-- Name: household_household_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.household_household_id_seq', 11, true);


--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 223
-- Name: pet_pet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pet_pet_id_seq', 20, true);


--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_user_id_seq', 9, true);


--
-- TOC entry 4794 (class 2606 OID 16480)
-- Name: activity activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (activity_id);


--
-- TOC entry 4784 (class 2606 OID 16418)
-- Name: household household_invite_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household
    ADD CONSTRAINT household_invite_code_key UNIQUE (invite_code);


--
-- TOC entry 4791 (class 2606 OID 16438)
-- Name: household_members household_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_pkey PRIMARY KEY (user_id, household_id);


--
-- TOC entry 4786 (class 2606 OID 16416)
-- Name: household household_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household
    ADD CONSTRAINT household_pkey PRIMARY KEY (household_id);


--
-- TOC entry 4789 (class 2606 OID 16429)
-- Name: pet pet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pet
    ADD CONSTRAINT pet_pkey PRIMARY KEY (pet_id);


--
-- TOC entry 4780 (class 2606 OID 16404)
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- TOC entry 4782 (class 2606 OID 16402)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4795 (class 1259 OID 16493)
-- Name: idx_activity_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_date ON public.activity USING btree (activity_date);


--
-- TOC entry 4796 (class 1259 OID 16491)
-- Name: idx_activity_pet_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_pet_id ON public.activity USING btree (pet_id);


--
-- TOC entry 4797 (class 1259 OID 16492)
-- Name: idx_activity_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_user_id ON public.activity USING btree (user_id);


--
-- TOC entry 4792 (class 1259 OID 16494)
-- Name: idx_household_members_household; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_household_members_household ON public.household_members USING btree (household_id);


--
-- TOC entry 4787 (class 1259 OID 24693)
-- Name: idx_pet_household_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pet_household_id ON public.pet USING btree (household_id);


--
-- TOC entry 4801 (class 2606 OID 16486)
-- Name: activity activity_pet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pet(pet_id) ON DELETE CASCADE;


--
-- TOC entry 4802 (class 2606 OID 16481)
-- Name: activity activity_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- TOC entry 4799 (class 2606 OID 16444)
-- Name: household_members household_members_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.household(household_id) ON DELETE CASCADE;


--
-- TOC entry 4800 (class 2606 OID 16439)
-- Name: household_members household_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- TOC entry 4798 (class 2606 OID 24688)
-- Name: pet pet_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pet
    ADD CONSTRAINT pet_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.household(household_id) ON DELETE CASCADE;


-- Completed on 2026-01-22 18:44:40

--
-- PostgreSQL database dump complete
--

\unrestrict coPYnqbqPoFhvzNpdasv6ZeIQANTpsT2952zG7BBY1per4DqxmaVmsMVjJ9AU7H

