const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.get\('\/api\/sync\.php', async \(req, res\) => \{[\s\S]*?\}\s*\);/m;

const newSync = `app.get('/api/sync.php', async (req, res) => {
    if (!pool) {
      return res.status(503).json({ error: 'Database connection not configured' });
    }
    try {
      const [users] = await pool.query('SELECT * FROM users');
      const [students] = await pool.query('SELECT * FROM students');
      const [classes] = await pool.query('SELECT * FROM classes');
      res.json({ users, students, classes });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Failed to sync data' });
    }
  });`;

content = content.replace(regex, newSync);
fs.writeFileSync('server.ts', content);
