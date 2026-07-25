const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Replace the CRUD routes
const crudRegex = /app\.get\('\/api\/crud\/:table', async \(req, res\) => \{[\s\S]*?app\.delete\('\/api\/crud\/:table\/:id', async \(req, res\) => \{[\s\S]*?\}\);/m;

const newCrud = `
  const dbFallback: any = {
    subjects: [
      { id: 1, code: 'MP-001', name: 'Matematika', category: 'Wajib', weekly_hours: 4 },
      { id: 2, code: 'MP-002', name: 'Bahasa Indonesia', category: 'Wajib', weekly_hours: 4 }
    ],
    sarpras: [
      { id: 1, item_name: 'Proyektor EPSON', code: 'PRJ-001', category: 'Peralatan Elektronik', quantity: 2, qty_baik: 1, qty_rusak_ringan: 1, qty_rusak_berat: 0, condition: 'Baik', room: 'Ruang Guru' }
    ],
    users: [],
    students: [],
    classes: []
  };

  app.get('/api/crud/:table', async (req, res) => {
    const { table } = req.params;
    if (!allowedTables.includes(table)) return res.status(403).json({ error: 'Forbidden table' });
    if (!pool) {
       return res.json(dbFallback[table] || []);
    }
    try {
      const [rows] = await pool.query(\`SELECT * FROM \${table}\`);
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/crud/:table', async (req, res) => {
    const { table } = req.params;
    if (!allowedTables.includes(table)) return res.status(403).json({ error: 'Forbidden table' });
    if (!pool) {
       const data = req.body;
       if (!dbFallback[table]) dbFallback[table] = [];
       const id = dbFallback[table].length > 0 ? Math.max(...dbFallback[table].map((x:any)=>x.id)) + 1 : 1;
       const newItem = { ...data, id };
       dbFallback[table].push(newItem);
       return res.json({ insertId: id });
    }
    try {
      const data = req.body;
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map(() => '?').join(', ');
      const sql = \`INSERT INTO \${table} (\${keys.join(', ')}) VALUES (\${placeholders})\`;
      const [result]: any = await pool.query(sql, values);
      res.json({ insertId: result.insertId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/crud/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    if (!allowedTables.includes(table)) return res.status(403).json({ error: 'Forbidden table' });
    if (!pool) {
       if (!dbFallback[table]) return res.json({ affectedRows: 0 });
       const idx = dbFallback[table].findIndex((x:any) => x.id == id);
       if (idx >= 0) {
           dbFallback[table][idx] = { ...dbFallback[table][idx], ...req.body };
           return res.json({ affectedRows: 1 });
       }
       return res.json({ affectedRows: 0 });
    }
    try {
      const data = req.body;
      const keys = Object.keys(data);
      const values = Object.values(data);
      const setClause = keys.map(k => \`\${k} = ?\`).join(', ');
      const sql = \`UPDATE \${table} SET \${setClause} WHERE id = ?\`;
      const [result]: any = await pool.query(sql, [...values, id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/crud/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    if (!allowedTables.includes(table)) return res.status(403).json({ error: 'Forbidden table' });
    if (!pool) {
       if (!dbFallback[table]) return res.json({ affectedRows: 0 });
       const idx = dbFallback[table].findIndex((x:any) => x.id == id);
       if (idx >= 0) {
           dbFallback[table].splice(idx, 1);
           return res.json({ affectedRows: 1 });
       }
       return res.json({ affectedRows: 0 });
    }
    try {
      const sql = \`DELETE FROM \${table} WHERE id = ?\`;
      const [result]: any = await pool.query(sql, [id]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
`;

content = content.replace(crudRegex, newCrud);
fs.writeFileSync('server.ts', content);
