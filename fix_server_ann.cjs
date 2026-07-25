const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const badAnnPart = `    }
    
    try {
      const [rows] = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
      res.json(rows);
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });`;

content = content.replace(badAnnPart, '');
fs.writeFileSync('server.ts', content);
