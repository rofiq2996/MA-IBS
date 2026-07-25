const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const badSarpras = `    }
    try {
      const [rows] = await pool.query('SELECT * FROM sarpras');
      res.json(rows);
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Failed to fetch sarpras data' });
    }
  });`;
content = content.replace(badSarpras, '');

fs.writeFileSync('server.ts', content);
