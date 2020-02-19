--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.2

-- Started on 2020-02-17 14:57:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2916 (class 0 OID 34521)
-- Dependencies: 196
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.account (id, created, updated, version) VALUES ('99075bd6-6ac3-47a6-89f5-92712f898f7c', '2020-02-17 14:57:10.142', '2020-02-17 14:57:10.142', 0);
INSERT INTO public.account (id, created, updated, version) VALUES ('0f261f4d-1b90-4a02-91d2-eca8f097d4d6', '2020-02-17 14:57:10.265', '2020-02-17 14:57:10.265', 0);
INSERT INTO public.account (id, created, updated, version) VALUES ('31c94856-a595-4acc-b158-dbca3a45bacb', '2020-02-17 14:57:10.374', '2020-02-17 14:57:10.374', 0);


--
-- TOC entry 2929 (class 0 OID 34595)
-- Dependencies: 209
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_info (id, created, updated, version, account_non_expired, account_non_locked, credentials_non_expired, email, enabled, first_name, last_name, middle_name, password, username) VALUES ('ce3a6ed4-ac78-4695-b717-8b421d87c44c', '2020-02-17 14:57:10.14', '2020-02-17 14:57:10.14', 0, true, true, true, 'hasalem@gmail.com', true, 'Hatem', NULL, NULL, '{bcrypt}$2a$10$TNGrnDTzBwNWiKA88msxPefAtuv0tGfzmYl0BOmwIcF7b4GlboB9u', 'hasalem');
INSERT INTO public.user_info (id, created, updated, version, account_non_expired, account_non_locked, credentials_non_expired, email, enabled, first_name, last_name, middle_name, password, username) VALUES ('0fd2476d-3355-4883-bf1e-225f4c2f3716', '2020-02-17 14:57:10.264', '2020-02-17 14:57:10.264', 0, true, true, true, 'mosalem@gmail.com', true, 'Hatem', NULL, NULL, '{bcrypt}$2a$10$L/41NUSh4pA4uUYwDQ.RyO0kotu0HQORFI/4hJ96fjM7uDO1omsAW', 'mosalem');
INSERT INTO public.user_info (id, created, updated, version, account_non_expired, account_non_locked, credentials_non_expired, email, enabled, first_name, last_name, middle_name, password, username) VALUES ('698a3ee6-9a2d-4fa9-891c-a0a08d0f3248', '2020-02-17 14:57:10.374', '2020-02-17 14:57:10.374', 0, true, true, true, 'admin@gmail.com', true, 'Admin', NULL, NULL, '{bcrypt}$2a$10$qDkaYm4Ra9aTW5SPgbFuG.hJuzyZ/SfFCaXhQcbpy9y5T2EHJCYAS', 'admin');


--
-- TOC entry 2917 (class 0 OID 34526)
-- Dependencies: 197
-- Data for Name: authority; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.authority (id, created, updated, version, authority, user_id) VALUES ('a652ed30-1f45-4aac-9aef-f7bb198be302', '2020-02-17 14:57:10.142', '2020-02-17 14:57:10.142', 0, 'ROLE_USER', 'ce3a6ed4-ac78-4695-b717-8b421d87c44c');
INSERT INTO public.authority (id, created, updated, version, authority, user_id) VALUES ('8d4983b3-27a8-467f-bb61-16bf6b3528af', '2020-02-17 14:57:10.265', '2020-02-17 14:57:10.265', 0, 'ROLE_USER', '0fd2476d-3355-4883-bf1e-225f4c2f3716');
INSERT INTO public.authority (id, created, updated, version, authority, user_id) VALUES ('503203a8-1ddd-41db-b45d-82c5bb302210', '2020-02-17 14:57:10.375', '2020-02-17 14:57:10.375', 0, 'ROLE_USER', '698a3ee6-9a2d-4fa9-891c-a0a08d0f3248');
INSERT INTO public.authority (id, created, updated, version, authority, user_id) VALUES ('ec0ecfcd-96e7-4fa7-b825-889c64e14106', '2020-02-17 14:57:10.39', '2020-02-17 14:57:10.39', 0, 'ROLE_ADMIN', '698a3ee6-9a2d-4fa9-891c-a0a08d0f3248');


--
-- TOC entry 2918 (class 0 OID 34531)
-- Dependencies: 198
-- Data for Name: file_asset; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2919 (class 0 OID 34536)
-- Dependencies: 199
-- Data for Name: house_hold; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2925 (class 0 OID 34572)
-- Dependencies: 205
-- Data for Name: order_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2927 (class 0 OID 34582)
-- Dependencies: 207
-- Data for Name: service; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.service (id, created, updated, version, description, max_files, name, working_area) VALUES ('1d6a002a-82fb-4212-a791-3be0b8845087', '2020-02-17 14:57:09.915', '2020-02-17 14:57:09.915', 0, '3D Printing Description', 0, '3D Printing', NULL);
INSERT INTO public.service (id, created, updated, version, description, max_files, name, working_area) VALUES ('77b32f25-98d1-474c-8562-7fdbc8981638', '2020-02-17 14:57:10.001', '2020-02-17 14:57:10.001', 0, 'Laser Cutting Description', 0, 'Laser Scanning', NULL);
INSERT INTO public.service (id, created, updated, version, description, max_files, name, working_area) VALUES ('e3faf35f-56c4-488d-849b-a78ce6d9f8d2', '2020-02-17 14:57:10.004', '2020-02-17 14:57:10.004', 0, 'CNC Routers Description', 0, 'CNC Routers', NULL);


--
-- TOC entry 2921 (class 0 OID 34549)
-- Dependencies: 201
-- Data for Name: line_item; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2922 (class 0 OID 34557)
-- Dependencies: 202
-- Data for Name: machine; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2920 (class 0 OID 34544)
-- Dependencies: 200
-- Data for Name: job; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2923 (class 0 OID 34562)
-- Dependencies: 203
-- Data for Name: material; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2924 (class 0 OID 34567)
-- Dependencies: 204
-- Data for Name: material_type; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2926 (class 0 OID 34577)
-- Dependencies: 206
-- Data for Name: password_reset_token; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2928 (class 0 OID 34590)
-- Dependencies: 208
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2930 (class 0 OID 34603)
-- Dependencies: 210
-- Data for Name: users_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users_accounts (user_id, accounts_id) VALUES ('ce3a6ed4-ac78-4695-b717-8b421d87c44c', '99075bd6-6ac3-47a6-89f5-92712f898f7c');
INSERT INTO public.users_accounts (user_id, accounts_id) VALUES ('0fd2476d-3355-4883-bf1e-225f4c2f3716', '0f261f4d-1b90-4a02-91d2-eca8f097d4d6');
INSERT INTO public.users_accounts (user_id, accounts_id) VALUES ('698a3ee6-9a2d-4fa9-891c-a0a08d0f3248', '31c94856-a595-4acc-b158-dbca3a45bacb');


-- Completed on 2020-02-17 14:57:48

--
-- PostgreSQL database dump complete
--

