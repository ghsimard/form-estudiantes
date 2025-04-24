--
-- Create rectores table for the form-estudiantes application
--

CREATE TABLE IF NOT EXISTS public.rectores (
    id SERIAL PRIMARY KEY,
    nombre_ie character varying(255) NOT NULL,
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