-- Drop the table if it exists
DROP TABLE IF EXISTS estudiantes_form_submissions;

-- Create the table with the correct column names
CREATE TABLE estudiantes_form_submissions (
    id SERIAL PRIMARY KEY,
    institucion_educativa TEXT NOT NULL,
    anos_estudiando TEXT NOT NULL,
    grado_actual TEXT NOT NULL,
    jornada TEXT NOT NULL,
    comunicacion JSONB NOT NULL,
    practicas_pedagogicas JSONB NOT NULL,
    convivencia JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 