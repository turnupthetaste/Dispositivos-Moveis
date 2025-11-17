const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'app_scholar',
  password: 'password',
  port: 5432,
});

const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        enrollment VARCHAR(50) UNIQUE NOT NULL,
        course VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      INSERT INTO users (email, password, profile) 
      VALUES 
      ('admin@scholar.com', 'admin123', 'admin'),
      ('aluno@scholar.com', 'aluno123', 'aluno')
      ON CONFLICT (email) DO NOTHING
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = { pool, initDatabase };