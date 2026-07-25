const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const notifEndpoint = `
  app.get('/api/notifications/:user_id', async (req, res) => {
    const { user_id } = req.params;
    if (!pool) return res.json([]);
    
    try {
      // Get notifications for this user (or global ones if user_id matches)
      const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
      res.json(rows);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/notifications/:id/read', async (req, res) => {
    const { id } = req.params;
    if (!pool) return res.json({ status: 'success' });
    
    try {
      await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
      res.json({ status: 'success' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/sync',`;

code = code.replace("  app.get('/api/sync',", notifEndpoint);
fs.writeFileSync('server.ts', code);
console.log("Patched server.ts with notifications endpoints");
