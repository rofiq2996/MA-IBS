const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The duplicate trailing part:
const badPart = `    if (!pool) return res.status(503).json({ error: 'DB not connected' });
    try {
      const sql = \`DELETE FROM \${table} WHERE id = ?\`;
      const [result] = await pool.query(sql, [id]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
`;

content = content.replace(badPart, '');
fs.writeFileSync('server.ts', content);
