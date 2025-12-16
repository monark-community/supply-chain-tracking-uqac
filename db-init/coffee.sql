--
-- PostgreSQL database dump
--

\restrict wzNA6hFLf0V8NWCLFJphkpXGSspdo1aEI7XQ5JW3f53fDrmWnufzi1hgESGZFvA

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-13 00:26:56

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
-- TOC entry 223 (class 1259 OID 16636)
-- Name: actor_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actor_categories (
    id character varying(10) NOT NULL,
    name character varying(50) NOT NULL,
    description text
);


ALTER TABLE public.actor_categories OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16659)
-- Name: actor_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actor_contacts (
    actor_id character varying(10) NOT NULL,
    contact_id character varying(10) NOT NULL
);


ALTER TABLE public.actor_contacts OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16676)
-- Name: actor_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actor_products (
    actor_id character varying(10) NOT NULL,
    product_id character varying(10) NOT NULL
);


ALTER TABLE public.actor_products OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16645)
-- Name: actors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actors (
    id character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    category_id character varying(10),
    lat numeric(9,6),
    lon numeric(9,6),
    fairtrade boolean,
    organic boolean,
    rainforest_alliance boolean,
    bird_friendly boolean,
    carbon_neutral boolean,
    direct_trade boolean,
    sca_grade numeric(4,2),
    notes text
);


ALTER TABLE public.actors OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16626)
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    notes text
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16607)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    category_id character varying(10),
    variety character varying(50),
    bag_type character varying(50),
    quantity numeric(10,2),
    unit character varying(10),
    shelf_life_hours numeric(10,2),
    notes text
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16599)
-- Name: product_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_categories (
    id character varying(10) NOT NULL,
    name character varying(50),
    description text
);


ALTER TABLE public.product_categories OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16693)
-- Name: product_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_transactions (
    transaction_id character varying(66) NOT NULL,
    product_id character varying(10) NOT NULL
);


ALTER TABLE public.product_transactions OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16593)
-- Name: units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.units (
    unit_code character varying(10) NOT NULL,
    description character varying(50)
);


ALTER TABLE public.units OWNER TO postgres;

--
-- TOC entry 5064 (class 0 OID 16636)
-- Dependencies: 223
-- Data for Name: actor_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.actor_categories (id, name, description) FROM stdin;
ACAT-001	Farmer	Raw produce
ACAT-002	Transporter	Moves produce between facilities
ACAT-003	Roaster	Transforms raw beans into roasted beans
ACAT-004	Retail store	Sells end-product to customer
\.


--
-- TOC entry 5066 (class 0 OID 16659)
-- Dependencies: 225
-- Data for Name: actor_contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.actor_contacts (actor_id, contact_id) FROM stdin;
A-001	C-001
A-002	C-002
A-003	C-003
A-004	C-004
A-005	C-005
A-006	C-006
A-007	C-007
A-008	C-008
A-009	C-009
\.


--
-- TOC entry 5067 (class 0 OID 16676)
-- Dependencies: 226
-- Data for Name: actor_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.actor_products (actor_id, product_id) FROM stdin;
A-001	P-001
A-002	P-002
A-006	P-003
A-007	P-004
A-005	P-005
A-005	P-006
A-008	P-005
A-008	P-006
A-009	P-005
A-009	P-006
\.


--
-- TOC entry 5065 (class 0 OID 16645)
-- Dependencies: 224
-- Data for Name: actors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.actors (id, name, description, category_id, lat, lon, fairtrade, organic, rainforest_alliance, bird_friendly, carbon_neutral, direct_trade, sca_grade, notes) FROM stdin;
A-001	Finca La Esperanza	Family farm at 1,600 m altitude producing Arabica Caturra	ACAT-001	1.584227	-75.590011	t	t	f	t	f	f	83.00	\N
A-002	Finca Santa Maria	Cooperative-managed farm at 1,450 m growing Arabica Typica	ACAT-001	2.473899	-77.858577	f	t	t	f	t	f	84.00	\N
A-003	Andes Freight	Cross-border logistics for agricultural exports	ACAT-002	\N	\N	\N	\N	\N	\N	\N	\N	\N	8 trucks, 2 reefers
A-004	BlueSea Cargo	Sea freight consolidator for coffee containers	ACAT-002	\N	\N	\N	\N	\N	\N	\N	\N	\N	MSC partner, 20' reefers
A-005	Laval Distribution Center	Regional DC handling packaged coffee for QC	ACAT-002	\N	\N	\N	\N	\N	\N	\N	\N	\N	Serves 30+ retailers
A-006	RoastCo Montreal	Specialty roaster focused on medium roasts	ACAT-003	\N	\N	t	t	f	t	f	f	84.00	Capacity 1,500 kg/week
A-007	Nordik Roast	Roaster specializing in light profiles	ACAT-003	\N	\N	f	t	t	f	t	f	85.00	Capacity 1,200 kg/week
A-008	BeanMart Montreal	Retailer on St-Laurent, specialty coffee	ACAT-004	\N	\N	\N	\N	\N	\N	\N	\N	\N	Fairtrade selection
A-009	Café du Quartier	Neighborhood café and retail corner	ACAT-004	\N	\N	\N	\N	\N	\N	\N	\N	\N	Espresso oriented
A-010	Buenaventura Port	Columbia Nunito Port	ACAT-002	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
A-011	Cartagena Port	Columbia Cartagena Port	ACAT-002	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5063 (class 0 OID 16626)
-- Dependencies: 222
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, name, email, notes) FROM stdin;
C-001	Juan Pérez	juanperez@fincaesperanza.co	\N
C-002	Ana Ruiz	ana.ruiz@fsm.co	\N
C-003	Maria Gomez	mgomez@andesfreight.co	8 trucks, 2 reefers
C-004	Luis Torres	ltorres@bluesea.co	MSC partner, 20' reefers
C-005	Alain Dubois	adubois@lavaldc.ca	Serves 30+ retailers
C-006	Marc Tremblay	marc@roastco.ca	Capacity 1,500 kg/week
C-007	Claire Gagnon	claire@nordikroast.ca	Capacity 1,200 kg/week
C-008	Sophie Leduc	sleduc@beanmart.ca	Fairtrade selection
C-009	Etienne Roy	etienne@cafequartier.ca	Espresso oriented
\.


--
-- TOC entry 5062 (class 0 OID 16607)
-- Dependencies: 221
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, name, description, category_id, variety, bag_type, quantity, unit, shelf_life_hours, notes) FROM stdin;
P-001	Green Arabica beans	Unroasted beans harvested at 1,600 m altitude	PCAT-001	Caturra	Jute bag	60.00	kg	8640.00	Moisture 11.5%
P-002	Green Arabica beans	Unroasted beans harvested at 1,450 m altitude	PCAT-001	Typica	Jute bag	69.00	kg	8640.00	Moisture 11.2%
P-003	Roasted Arabica beans	Medium roast produced	PCAT-002	Caturra	Vacuum-sealed bag	10.00	kg	4320.00	Roast 210°C, 12 min
P-004	Roasted Arabica beans	Light roast produced	PCAT-002	Typica	Vacuum-sealed bag	5.00	kg	4320.00	Roast 198°C, 10 min
P-005	Ground Arabica coffee	Medium grind retail pack	PCAT-003	Caturra	Retail pouch (laminated)	1.00	kg	3240.00	Drip and espresso
P-006	Ground Arabica coffee	Fine grind retail packs	PCAT-003	Typica	Retail pouch (laminated)	500.00	g	3240.00	Espresso focused
\.


--
-- TOC entry 5061 (class 0 OID 16599)
-- Dependencies: 220
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_categories (id, name, description) FROM stdin;
PCAT-001	Raw material	Farmer produce, not transformed.
PCAT-002	Processed	Roasted or grounded beans.
PCAT-003	Final product	Customer-ready product for retail.
\.


--
-- TOC entry 5068 (class 0 OID 16693)
-- Dependencies: 227
-- Data for Name: product_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_transactions (transaction_id, product_id) FROM stdin;
0xbc437e4d367c3eb42b1bfbafb45d37c7ccf64a20377e336991705de00312c61c	P-001
\.


--
-- TOC entry 5060 (class 0 OID 16593)
-- Dependencies: 219
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units (unit_code, description) FROM stdin;
kg	Kilogram
g	Gram
lb	Pound
oz	Ounce
pc	Piece
ea	Each
cs	Case
bx	Box
plt	Pallet
gal	Gallon
L	Liter
m	Meter
cm	Centimeter
in	Inch
ft	Foot
\.


--
-- TOC entry 4896 (class 2606 OID 16644)
-- Name: actor_categories actor_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actor_categories
    ADD CONSTRAINT actor_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 16665)
-- Name: actor_contacts actor_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actor_contacts
    ADD CONSTRAINT actor_contacts_pkey PRIMARY KEY (actor_id, contact_id);


--
-- TOC entry 4902 (class 2606 OID 16682)
-- Name: actor_products actor_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actor_products
    ADD CONSTRAINT actor_products_pkey PRIMARY KEY (actor_id, product_id);


--
-- TOC entry 4898 (class 2606 OID 16653)
-- Name: actors actors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_pkey PRIMARY KEY (id);


--
-- TOC entry 4894 (class 2606 OID 16635)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 4890 (class 2606 OID 16606)
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4892 (class 2606 OID 16615)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 4904 (class 2606 OID 16699)
-- Name: product_transactions product_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_transactions
    ADD CONSTRAINT product_transactions_pkey PRIMARY KEY (transaction_id);


--
-- TOC entry 4888 (class 2606 OID 16598)
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (unit_code);


--
-- TOC entry 4908 (class 2606 OID 16666)
-- Name: actor_contacts actor_contacts_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actor_contacts
    ADD CONSTRAINT actor_contacts_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.actors(id);


--
-- TOC entry 4909 (class 2606 OID 16671)
-- Name: actor_contacts actor_contacts_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actor_contacts
    ADD CONSTRAINT actor_contacts_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id);


--
-- TOC entry 4910 (class 2606 OID 16683)
-- Name: actor_products actor_products_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actor_products
    ADD CONSTRAINT actor_products_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.actors(id);


--
-- TOC entry 4911 (class 2606 OID 16688)
-- Name: actor_products actor_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actor_products
    ADD CONSTRAINT actor_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- TOC entry 4907 (class 2606 OID 16654)
-- Name: actors actors_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.actor_categories(id);


--
-- TOC entry 4905 (class 2606 OID 16616)
-- Name: product product_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id);


--
-- TOC entry 4912 (class 2606 OID 16700)
-- Name: product_transactions product_transactions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_transactions
    ADD CONSTRAINT product_transactions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- TOC entry 4906 (class 2606 OID 16621)
-- Name: product product_unit_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_unit_fkey FOREIGN KEY (unit) REFERENCES public.units(unit_code);


-- Completed on 2025-11-13 00:26:56

--
-- PostgreSQL database dump complete
--

\unrestrict wzNA6hFLf0V8NWCLFJphkpXGSspdo1aEI7XQ5JW3f53fDrmWnufzi1hgESGZFvA

