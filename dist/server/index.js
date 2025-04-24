import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
// Debug environment
console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
    PORT: process.env.PORT
});
// Middleware
app.use(cors());
app.use(express.json());
// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not set');
        }
        await pool.query('SELECT NOW()');
        res.json({ status: 'healthy', database: 'connected' });
    }
    catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: process.env.NODE_ENV === 'production' ? 'Database connection failed' : error.message
        });
    }
});
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../build')));
// PostgreSQL connection configuration
if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set!');
    process.exit(1); // Exit if no database URL is provided
}
const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
};
console.log('Database config:', {
    hasConnectionString: !!dbConfig.connectionString,
    ssl: dbConfig.ssl
});
const pool = new Pool(dbConfig);
// Test database connection
pool.query('SELECT NOW()')
    .then(() => console.log('Successfully connected to database'))
    .catch(err => {
    console.error('Error connecting to database:', err);
    if (process.env.NODE_ENV === 'production') {
        process.exit(1); // Exit in production if we can't connect to the database
    }
});
// Create table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS docentes_form_submissions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    institucion_educativa VARCHAR(255) NOT NULL,
    anos_como_docente VARCHAR(50) NOT NULL,
    grados_asignados TEXT[] NOT NULL,
    jornada VARCHAR(50) NOT NULL,
    retroalimentacion_de TEXT[] NOT NULL,
    frequency_ratings6 JSONB NOT NULL,
    frequency_ratings7 JSONB NOT NULL,
    frequency_ratings8 JSONB NOT NULL
  );
`;
pool.query(createTableQuery)
    .then(() => console.log('docentes_form_submissions table created successfully'))
    .catch(err => console.error('Error creating docentes_form_submissions table:', err));
// Create estudiantes_form_submissions table if it doesn't exist
const createEstudiantesTableQuery = `
  CREATE TABLE IF NOT EXISTS estudiantes_form_submissions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    institucion_educativa VARCHAR(255) NOT NULL,
    anos_estudiando VARCHAR(50) NOT NULL,
    grado_actual VARCHAR(50) NOT NULL,
    jornada VARCHAR(50) NOT NULL,
    frequency_ratings5 JSONB NOT NULL,
    frequency_ratings6 JSONB NOT NULL,
    frequency_ratings7 JSONB NOT NULL
  );
`;
pool.query(createEstudiantesTableQuery)
    .then(() => console.log('estudiantes_form_submissions table created successfully'))
    .catch(err => console.error('Error creating estudiantes_form_submissions table:', err));
// API endpoint to save form data
app.post('/api/submit-form', async (req, res) => {
    try {
        const { schoolName, yearsOfExperience, currentGrade, schedule, frequencyRatings5, frequencyRatings6, frequencyRatings7 } = req.body;
        const query = `
      INSERT INTO estudiantes_form_submissions (
        institucion_educativa,
        anos_estudiando,
        grado_actual,
        jornada,
        frequency_ratings5,
        frequency_ratings6,
        frequency_ratings7
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
        const values = [
            schoolName,
            yearsOfExperience,
            currentGrade,
            schedule,
            frequencyRatings5,
            frequencyRatings6,
            frequencyRatings7
        ];
        const result = await pool.query(query, values);
        res.json({
            success: true,
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error saving form response:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save form response'
        });
    }
});
// API endpoint to search for school names
app.get('/api/search-schools', async (req, res) => {
    const searchTerm = req.query.q;
    try {
        const query = `
      SELECT DISTINCT TRIM(nombre_de_la_institucion_educativa_en_la_actualmente_desempena_) as school_name
      FROM rectores
      WHERE LOWER(TRIM(nombre_de_la_institucion_educativa_en_la_actualmente_desempena_)) LIKE LOWER($1)
      LIMIT 10;
    `;
        const result = await pool.query(query, [`%${searchTerm}%`]);
        res.json(result.rows.map(row => row.school_name));
    }
    catch (error) {
        console.error('Error searching schools:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search schools'
        });
    }
});
// The "catch-all" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build/index.html'));
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
