const express = require('express');
const cors = require('cors');
const { pool, initDatabase } = require('./src/config/database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

initDatabase();

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, email, profile FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];
    res.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'Database connected' });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});