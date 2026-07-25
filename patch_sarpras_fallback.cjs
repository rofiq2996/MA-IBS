const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.get\(\['\/api\/sarpras', '\/api\/sarpras\.php'\], async \(req, res\) => \{[\s\S]*?\}\);/m;

const newSarpras = `app.get(['/api/sarpras', '/api/sarpras.php'], async (req, res) => {
    if (!pool) {
      return res.json(dbFallback['sarpras'] || []);
    }
    try {
      const [rows] = await pool.query('SELECT * FROM sarpras');
      res.json(rows);
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Failed to fetch sarpras data' });
    }
  });`;

content = content.replace(regex, newSarpras);
fs.writeFileSync('server.ts', content);
