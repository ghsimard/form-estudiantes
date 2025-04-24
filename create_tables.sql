--
-- Create necessary tables for the form-estudiantes application
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: rectores; Type: TABLE; Schema: public;
--

CREATE TABLE public.rectores (
    id SERIAL PRIMARY KEY,
    nombre_ie character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

--
-- Name: estudiantes_form_submissions; Type: TABLE; Schema: public;
--

CREATE TABLE public.estudiantes_form_submissions (
    id SERIAL PRIMARY KEY,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

--
-- Insert sample data into rectores table
--

INSERT INTO public.rectores (nombre_ie) VALUES
('INSTITUCIÓN EDUCATIVA SAN JOSÉ'),
('INSTITUCIÓN EDUCATIVA SAN JUAN'),
('INSTITUCIÓN EDUCATIVA SAN PEDRO'),
('INSTITUCIÓN EDUCATIVA SAN PABLO'),
('INSTITUCIÓN EDUCATIVA SAN MARCOS'); 