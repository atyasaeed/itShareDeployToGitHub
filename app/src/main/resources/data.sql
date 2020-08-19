--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.2

-- Started on 2020-02-26 13:15:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 196 (class 1259 OID 47421)
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL
);


ALTER TABLE public.account OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 47426)
-- Name: authority; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authority (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    authority character varying(255),
    user_id uuid NOT NULL
);


ALTER TABLE public.authority OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 47431)
-- Name: file_asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.file_asset (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    name character varying(255),
    account_id uuid NOT NULL
);


ALTER TABLE public.file_asset OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 47436)
-- Name: house_hold; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.house_hold (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    address character varying(255),
    name character varying(255),
    phone character varying(255)
);


ALTER TABLE public.house_hold OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 47444)
-- Name: job; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    finished timestamp without time zone NOT NULL,
    start timestamp without time zone NOT NULL,
    status integer,
    line_item_id uuid,
    machine_id uuid NOT NULL
);


ALTER TABLE public.job OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 47449)
-- Name: line_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.line_item (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    color character varying(255),
    estimated_end_date date,
    estimated_stard_date date,
    material character varying(255),
    notes character varying(255),
    planned_end_date date,
    planned_start_date date,
    project_type character varying(255),
    quantity bigint NOT NULL,
    rank integer NOT NULL,
    unit character varying(255),
    unit_price numeric(19,2),
    digtal_assets_id uuid,
    order_entity_id uuid NOT NULL,
    service_id uuid NOT NULL
);


ALTER TABLE public.line_item OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 47457)
-- Name: machine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.machine (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    name character varying(255) NOT NULL,
    status integer NOT NULL
);


ALTER TABLE public.machine OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 47462)
-- Name: material; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    name character varying(255)
);


ALTER TABLE public.material OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 47472)
-- Name: material_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material_type (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    name character varying(255)
);


ALTER TABLE public.material_type OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 47477)
-- Name: material_type_colors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material_type_colors (
    material_type_id uuid NOT NULL,
    colors character varying(255)
);


ALTER TABLE public.material_type_colors OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 47480)
-- Name: material_type_dimensions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material_type_dimensions (
    material_type_id uuid NOT NULL,
    dimensions character varying(255)
);


ALTER TABLE public.material_type_dimensions OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 47467)
-- Name: material_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material_types (
    material_id uuid NOT NULL,
    types_id uuid NOT NULL
);


ALTER TABLE public.material_types OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 47483)
-- Name: order_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_entity (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    status integer NOT NULL,
    account_id uuid NOT NULL,
    placed_by_id uuid NOT NULL
);


ALTER TABLE public.order_entity OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 47488)
-- Name: password_reset_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_token (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    expiry_date timestamp without time zone,
    sent boolean NOT NULL,
    used boolean NOT NULL,
    user_id uuid
);


ALTER TABLE public.password_reset_token OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 47493)
-- Name: service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    description character varying(255),
    extensions text,
    max_files integer NOT NULL,
    name character varying(255),
    template text,
    working_area character varying(255)
);


ALTER TABLE public.service OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 47501)
-- Name: user_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_info (
    id uuid NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    version integer NOT NULL,
    account_non_expired boolean NOT NULL,
    account_non_locked boolean NOT NULL,
    credentials_non_expired boolean NOT NULL,
    email character varying(255),
    enabled boolean NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    middle_name character varying(255),
    password character varying(255),
    username character varying(255)
);


ALTER TABLE public.user_info OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 47509)
-- Name: users_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_accounts (
    user_id uuid NOT NULL,
    accounts_id uuid NOT NULL
);


ALTER TABLE public.users_accounts OWNER TO postgres;

--
-- TOC entry 2943 (class 2613 OID 47602)
-- Name: 47602; Type: BLOB; Schema: -; Owner: postgres
--

SELECT pg_catalog.lo_create('47602');


ALTER LARGE OBJECT 47602 OWNER TO postgres;

--
-- TOC entry 2944 (class 2613 OID 47603)
-- Name: 47603; Type: BLOB; Schema: -; Owner: postgres
--

SELECT pg_catalog.lo_create('47603');


ALTER LARGE OBJECT 47603 OWNER TO postgres;

--
-- TOC entry 2945 (class 2613 OID 47604)
-- Name: 47604; Type: BLOB; Schema: -; Owner: postgres
--

SELECT pg_catalog.lo_create('47604');


ALTER LARGE OBJECT 47604 OWNER TO postgres;

--
-- TOC entry 2946 (class 2613 OID 47605)
-- Name: 47605; Type: BLOB; Schema: -; Owner: postgres
--

SELECT pg_catalog.lo_create('47605');


ALTER LARGE OBJECT 47605 OWNER TO postgres;

--
-- TOC entry 2947 (class 2613 OID 47606)
-- Name: 47606; Type: BLOB; Schema: -; Owner: postgres
--

SELECT pg_catalog.lo_create('47606');


ALTER LARGE OBJECT 47606 OWNER TO postgres;

--
-- TOC entry 2948 (class 2613 OID 47607)
-- Name: 47607; Type: BLOB; Schema: -; Owner: postgres
--

SELECT pg_catalog.lo_create('47607');


ALTER LARGE OBJECT 47607 OWNER TO postgres;

--
-- TOC entry 2926 (class 0 OID 47421)
-- Dependencies: 196
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.account VALUES ('c79d740c-08e2-4fc9-a81a-3cb4d9a36b25', '2020-02-26 13:01:39.823', '2020-02-26 13:01:39.823', 0);
INSERT INTO public.account VALUES ('8185cc8e-afb3-4415-a49d-9fb61904a87b', '2020-02-26 13:01:39.951', '2020-02-26 13:01:39.951', 0);
INSERT INTO public.account VALUES ('dcbbbc4b-7909-40d8-ba7c-99a461370b1a', '2020-02-26 13:01:40.068', '2020-02-26 13:01:40.068', 0);


--
-- TOC entry 2927 (class 0 OID 47426)
-- Dependencies: 197
-- Data for Name: authority; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.authority VALUES ('79964904-37fb-4be6-8a01-deb4c3001052', '2020-02-26 13:01:39.823', '2020-02-26 13:01:39.823', 0, 'ROLE_USER', '5566a60c-b58c-4b88-bd2f-046a04c07618');
INSERT INTO public.authority VALUES ('78060d4d-cfb0-41af-aaf2-5871e516db2a', '2020-02-26 13:01:39.951', '2020-02-26 13:01:39.951', 0, 'ROLE_USER', 'ea91c1f5-9606-4da3-b5c7-ace63eda30f6');
INSERT INTO public.authority VALUES ('1763fdca-dcba-44e4-8550-0dbc1223274d', '2020-02-26 13:01:40.069', '2020-02-26 13:01:40.069', 0, 'ROLE_USER', 'd0b8e3a6-56af-4ee4-bfc7-72198243e2dd');
INSERT INTO public.authority VALUES ('ae3d5e1e-4bcc-4e45-9505-ccc5badd9125', '2020-02-26 13:01:40.086', '2020-02-26 13:01:40.086', 0, 'ROLE_ADMIN', 'd0b8e3a6-56af-4ee4-bfc7-72198243e2dd');


--
-- TOC entry 2928 (class 0 OID 47431)
-- Dependencies: 198
-- Data for Name: file_asset; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2929 (class 0 OID 47436)
-- Dependencies: 199
-- Data for Name: house_hold; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2930 (class 0 OID 47444)
-- Dependencies: 200
-- Data for Name: job; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2931 (class 0 OID 47449)
-- Dependencies: 201
-- Data for Name: line_item; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2932 (class 0 OID 47457)
-- Dependencies: 202
-- Data for Name: machine; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2933 (class 0 OID 47462)
-- Dependencies: 203
-- Data for Name: material; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2935 (class 0 OID 47472)
-- Dependencies: 205
-- Data for Name: material_type; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2936 (class 0 OID 47477)
-- Dependencies: 206
-- Data for Name: material_type_colors; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2937 (class 0 OID 47480)
-- Dependencies: 207
-- Data for Name: material_type_dimensions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2934 (class 0 OID 47467)
-- Dependencies: 204
-- Data for Name: material_types; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2938 (class 0 OID 47483)
-- Dependencies: 208
-- Data for Name: order_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2939 (class 0 OID 47488)
-- Dependencies: 209
-- Data for Name: password_reset_token; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2940 (class 0 OID 47493)
-- Dependencies: 210
-- Data for Name: service; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.service VALUES ('2cf49e28-3a37-4451-8343-6760b6558e20', '2020-02-26 13:01:39.589', '2020-02-26 13:01:39.589', 0, '3D Printing Description', '47602', 2, '3D Printing', '47603', 'Working Area 1');
INSERT INTO public.service VALUES ('e24a46b4-6bba-4c5a-a8a4-63a407d166e9', '2020-02-26 13:01:39.681', '2020-02-26 13:01:39.681', 0, 'Laser Cutting Description', '47604', 1, 'Laser Scanning', '47605', 'Working Area 2');
INSERT INTO public.service VALUES ('6caeaf34-cbd4-4792-8ea8-24d4de2e024f', '2020-02-26 13:01:39.688', '2020-02-26 13:01:39.688', 0, 'CNC Routers Description', '47606', 3, 'CNC Routers', '47607', 'Working Area 3');


--
-- TOC entry 2941 (class 0 OID 47501)
-- Dependencies: 211
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_info VALUES ('5566a60c-b58c-4b88-bd2f-046a04c07618', '2020-02-26 13:01:39.816', '2020-02-26 13:01:39.816', 0, true, true, true, 'hasalem@gmail.com', true, 'Hatem', NULL, NULL, '{bcrypt}$2a$10$x6xxTkL3OEdngm4yTxW6R.WLaW3IF2cQkMWT2vgDbnu1Ec.0Ds1zO', 'hasalem');
INSERT INTO public.user_info VALUES ('ea91c1f5-9606-4da3-b5c7-ace63eda30f6', '2020-02-26 13:01:39.951', '2020-02-26 13:01:39.951', 0, true, true, true, 'mosalem@gmail.com', true, 'Hatem', NULL, NULL, '{bcrypt}$2a$10$5W5EGCNg33p9AS0B3i8vbeU.SChBQh7UtTplQ.29a2gJFu9XC3awu', 'mosalem');
INSERT INTO public.user_info VALUES ('d0b8e3a6-56af-4ee4-bfc7-72198243e2dd', '2020-02-26 13:01:40.068', '2020-02-26 13:01:40.068', 0, true, true, true, 'admin@gmail.com', true, 'Admin', NULL, NULL, '{bcrypt}$2a$10$y1Mc0KRyMZN.1swsBWM24usrWOvMgWNG.Rtprwcnew5OVJIPOE/ue', 'admin');


--
-- TOC entry 2942 (class 0 OID 47509)
-- Dependencies: 212
-- Data for Name: users_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users_accounts VALUES ('5566a60c-b58c-4b88-bd2f-046a04c07618', 'c79d740c-08e2-4fc9-a81a-3cb4d9a36b25');
INSERT INTO public.users_accounts VALUES ('ea91c1f5-9606-4da3-b5c7-ace63eda30f6', '8185cc8e-afb3-4415-a49d-9fb61904a87b');
INSERT INTO public.users_accounts VALUES ('d0b8e3a6-56af-4ee4-bfc7-72198243e2dd', 'dcbbbc4b-7909-40d8-ba7c-99a461370b1a');


--
-- TOC entry 2949 (class 0 OID 0)
-- Data for Name: BLOBS; Type: BLOBS; Schema: -; Owner: 
--

BEGIN;

SELECT pg_catalog.lo_open('47602', 131072);
SELECT pg_catalog.lowrite(0, '\x5b222a2e6a7067222c222a2e706e67222c222a2e706466225d');
SELECT pg_catalog.lo_close(0);

SELECT pg_catalog.lo_open('47603', 131072);
SELECT pg_catalog.lowrite(0, '\x5b7b226e616d65223a224d6174657269616c31222c227479706573223a5b7b226e616d65223a225479706531222c22636f6c6f7273223a5b22526564222c22426c7565225d2c2264696d656e73696f6e73223a5b22313558355835222c223130583130583130225d7d2c7b226e616d65223a225479706532222c22636f6c6f7273223a5b225768697465222c224f72616e6765225d2c2264696d656e73696f6e73223a5b22313658355835222c223230583130583130225d7d5d7d2c7b226e616d65223a224d6174657269616c32222c227479706573223a5b7b226e616d65223a225479706533222c22636f6c6f7273223a5b22426c61636b222c22507572626c65225d2c2264696d656e73696f6e73223a5b22323558355835222c223130583130583130225d7d2c7b226e616d65223a225479706534222c22636f6c6f7273223a5b2259656c6c6f77222c22477265656e225d2c2264696d656e73696f6e73223a5b22323658355835222c223230583130583130225d7d5d7d5d');
SELECT pg_catalog.lo_close(0);

SELECT pg_catalog.lo_open('47604', 131072);
SELECT pg_catalog.lowrite(0, '\x5b222a2e6a7067222c222a2e706e67222c222a2e706466225d');
SELECT pg_catalog.lo_close(0);

SELECT pg_catalog.lo_open('47605', 131072);
SELECT pg_catalog.lowrite(0, '\x5b7b226e616d65223a224d6174657269616c31222c227479706573223a5b7b226e616d65223a225479706531222c22636f6c6f7273223a5b22526564222c22426c7565225d2c2264696d656e73696f6e73223a5b22313558355835222c223130583130583130225d7d2c7b226e616d65223a225479706532222c22636f6c6f7273223a5b225768697465222c224f72616e6765225d2c2264696d656e73696f6e73223a5b22313658355835222c223230583130583130225d7d5d7d2c7b226e616d65223a224d6174657269616c32222c227479706573223a5b7b226e616d65223a225479706533222c22636f6c6f7273223a5b22426c61636b222c22507572626c65225d2c2264696d656e73696f6e73223a5b22323558355835222c223130583130583130225d7d2c7b226e616d65223a225479706534222c22636f6c6f7273223a5b2259656c6c6f77222c22477265656e225d2c2264696d656e73696f6e73223a5b22323658355835222c223230583130583130225d7d5d7d5d');
SELECT pg_catalog.lo_close(0);

SELECT pg_catalog.lo_open('47606', 131072);
SELECT pg_catalog.lowrite(0, '\x5b222a2e6a7067222c222a2e706e67222c222a2e706466225d');
SELECT pg_catalog.lo_close(0);

SELECT pg_catalog.lo_open('47607', 131072);
SELECT pg_catalog.lowrite(0, '\x5b7b226e616d65223a224d6174657269616c31222c227479706573223a5b7b226e616d65223a225479706531222c22636f6c6f7273223a5b22526564222c22426c7565225d2c2264696d656e73696f6e73223a5b22313558355835222c223130583130583130225d7d2c7b226e616d65223a225479706532222c22636f6c6f7273223a5b225768697465222c224f72616e6765225d2c2264696d656e73696f6e73223a5b22313658355835222c223230583130583130225d7d5d7d2c7b226e616d65223a224d6174657269616c32222c227479706573223a5b7b226e616d65223a225479706533222c22636f6c6f7273223a5b22426c61636b222c22507572626c65225d2c2264696d656e73696f6e73223a5b22323558355835222c223130583130583130225d7d2c7b226e616d65223a225479706534222c22636f6c6f7273223a5b2259656c6c6f77222c22477265656e225d2c2264696d656e73696f6e73223a5b22323658355835222c223230583130583130225d7d5d7d5d');
SELECT pg_catalog.lo_close(0);

COMMIT;

--
-- TOC entry 2752 (class 2606 OID 47425)
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- TOC entry 2754 (class 2606 OID 47430)
-- Name: authority authority_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authority
    ADD CONSTRAINT authority_pkey PRIMARY KEY (id);


--
-- TOC entry 2756 (class 2606 OID 47435)
-- Name: file_asset file_asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file_asset
    ADD CONSTRAINT file_asset_pkey PRIMARY KEY (id);


--
-- TOC entry 2758 (class 2606 OID 47443)
-- Name: house_hold house_hold_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.house_hold
    ADD CONSTRAINT house_hold_pkey PRIMARY KEY (id);


--
-- TOC entry 2760 (class 2606 OID 47448)
-- Name: job job_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id);


--
-- TOC entry 2762 (class 2606 OID 47456)
-- Name: line_item line_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.line_item
    ADD CONSTRAINT line_item_pkey PRIMARY KEY (id);


--
-- TOC entry 2764 (class 2606 OID 47461)
-- Name: machine machine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machine
    ADD CONSTRAINT machine_pkey PRIMARY KEY (id);


--
-- TOC entry 2766 (class 2606 OID 47466)
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);


--
-- TOC entry 2770 (class 2606 OID 47476)
-- Name: material_type material_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_type
    ADD CONSTRAINT material_type_pkey PRIMARY KEY (id);


--
-- TOC entry 2768 (class 2606 OID 47471)
-- Name: material_types material_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_types
    ADD CONSTRAINT material_types_pkey PRIMARY KEY (material_id, types_id);


--
-- TOC entry 2772 (class 2606 OID 47487)
-- Name: order_entity order_entity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_entity
    ADD CONSTRAINT order_entity_pkey PRIMARY KEY (id);


--
-- TOC entry 2774 (class 2606 OID 47492)
-- Name: password_reset_token password_reset_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT password_reset_token_pkey PRIMARY KEY (id);


--
-- TOC entry 2776 (class 2606 OID 47500)
-- Name: service service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT service_pkey PRIMARY KEY (id);


--
-- TOC entry 2778 (class 2606 OID 47515)
-- Name: service uk_adgojnrwwx9c3y3qa2q08uuqp; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT uk_adgojnrwwx9c3y3qa2q08uuqp UNIQUE (name);


--
-- TOC entry 2780 (class 2606 OID 47519)
-- Name: user_info uk_f2ksd6h8hsjtd57ipfq9myr64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT uk_f2ksd6h8hsjtd57ipfq9myr64 UNIQUE (username);


--
-- TOC entry 2782 (class 2606 OID 47517)
-- Name: user_info uk_gnu0k8vv6ptioedbxbfsnan9g; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT uk_gnu0k8vv6ptioedbxbfsnan9g UNIQUE (email);


--
-- TOC entry 2786 (class 2606 OID 47521)
-- Name: users_accounts uk_nbnvigj13od728soebnnv9fks; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_accounts
    ADD CONSTRAINT uk_nbnvigj13od728soebnnv9fks UNIQUE (accounts_id);


--
-- TOC entry 2784 (class 2606 OID 47508)
-- Name: user_info user_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_pkey PRIMARY KEY (id);


--
-- TOC entry 2788 (class 2606 OID 47513)
-- Name: users_accounts users_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_accounts
    ADD CONSTRAINT users_accounts_pkey PRIMARY KEY (user_id, accounts_id);


--
-- TOC entry 2804 (class 2606 OID 47597)
-- Name: users_accounts fk1bcd9defcr5hf5l31flckeocp; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_accounts
    ADD CONSTRAINT fk1bcd9defcr5hf5l31flckeocp FOREIGN KEY (user_id) REFERENCES public.user_info(id);


--
-- TOC entry 2795 (class 2606 OID 47552)
-- Name: line_item fk1v8lp0ixoxi90ktjcijohx0x6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.line_item
    ADD CONSTRAINT fk1v8lp0ixoxi90ktjcijohx0x6 FOREIGN KEY (service_id) REFERENCES public.service(id);


--
-- TOC entry 2794 (class 2606 OID 47547)
-- Name: line_item fk4lteo851x0qiulqao043g0y72; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.line_item
    ADD CONSTRAINT fk4lteo851x0qiulqao043g0y72 FOREIGN KEY (order_entity_id) REFERENCES public.order_entity(id);


--
-- TOC entry 2793 (class 2606 OID 47542)
-- Name: line_item fk4t06qrm1ed8k6pv1ojg95vatq; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.line_item
    ADD CONSTRAINT fk4t06qrm1ed8k6pv1ojg95vatq FOREIGN KEY (digtal_assets_id) REFERENCES public.file_asset(id);


--
-- TOC entry 2797 (class 2606 OID 47562)
-- Name: material_types fk7t4ofvp74x9eu8e5floh3xo8l; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_types
    ADD CONSTRAINT fk7t4ofvp74x9eu8e5floh3xo8l FOREIGN KEY (material_id) REFERENCES public.material(id);


--
-- TOC entry 2800 (class 2606 OID 47577)
-- Name: order_entity fk9r51w5x6nphgrqpqo74pu6ivk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_entity
    ADD CONSTRAINT fk9r51w5x6nphgrqpqo74pu6ivk FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- TOC entry 2790 (class 2606 OID 47527)
-- Name: file_asset fkaupcv57en4ujy16uei2gxhasg; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file_asset
    ADD CONSTRAINT fkaupcv57en4ujy16uei2gxhasg FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- TOC entry 2796 (class 2606 OID 47557)
-- Name: material_types fkc9v348auywbw9fwlpoo6bsk6o; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_types
    ADD CONSTRAINT fkc9v348auywbw9fwlpoo6bsk6o FOREIGN KEY (types_id) REFERENCES public.material_type(id);


--
-- TOC entry 2803 (class 2606 OID 47592)
-- Name: users_accounts fkgoacpua1vignre8j8arq9n9b6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_accounts
    ADD CONSTRAINT fkgoacpua1vignre8j8arq9n9b6 FOREIGN KEY (accounts_id) REFERENCES public.account(id);


--
-- TOC entry 2799 (class 2606 OID 47572)
-- Name: material_type_dimensions fkjheqf5uy4k6pwtk745tyd2mxy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_type_dimensions
    ADD CONSTRAINT fkjheqf5uy4k6pwtk745tyd2mxy FOREIGN KEY (material_type_id) REFERENCES public.material_type(id);


--
-- TOC entry 2802 (class 2606 OID 47587)
-- Name: password_reset_token fkk2beirypjoe6rotu5v9kyemy9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT fkk2beirypjoe6rotu5v9kyemy9 FOREIGN KEY (user_id) REFERENCES public.user_info(id);


--
-- TOC entry 2791 (class 2606 OID 47532)
-- Name: job fkl4x5wg64tsfo3lggh9jfayu50; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job
    ADD CONSTRAINT fkl4x5wg64tsfo3lggh9jfayu50 FOREIGN KEY (line_item_id) REFERENCES public.line_item(id);


--
-- TOC entry 2801 (class 2606 OID 47582)
-- Name: order_entity fkme68wnnglo7ylr0f62l5urs12; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_entity
    ADD CONSTRAINT fkme68wnnglo7ylr0f62l5urs12 FOREIGN KEY (placed_by_id) REFERENCES public.user_info(id);


--
-- TOC entry 2789 (class 2606 OID 47522)
-- Name: authority fkppldfkj66r2x13yjeur8ib66m; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authority
    ADD CONSTRAINT fkppldfkj66r2x13yjeur8ib66m FOREIGN KEY (user_id) REFERENCES public.user_info(id);


--
-- TOC entry 2792 (class 2606 OID 47537)
-- Name: job fkpw1ungh0hw7crmp89f9c21wf4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job
    ADD CONSTRAINT fkpw1ungh0hw7crmp89f9c21wf4 FOREIGN KEY (machine_id) REFERENCES public.machine(id);


--
-- TOC entry 2798 (class 2606 OID 47567)
-- Name: material_type_colors fkwyhag7x7ux5x4glli52ly85n; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_type_colors
    ADD CONSTRAINT fkwyhag7x7ux5x4glli52ly85n FOREIGN KEY (material_type_id) REFERENCES public.material_type(id);


-- Completed on 2020-02-26 13:15:49

--
-- PostgreSQL database dump complete
--

