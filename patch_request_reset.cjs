const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const resetEndpoint = `
  app.post('/api/request_reset', async (req, res) => {
    const { username } = req.body;
    if (!pool) return res.json({ status: 'success' });
    
    try {
      const [users] = await pool.query('SELECT * FROM users WHERE username = ? OR id = ?', [username, username]);
      const userList = users as any[];
      if (userList.length > 0) {
        const u = userList[0];
        const title = 'Permintaan Reset Password';
        const message = \`Pengguna \${u.name} (\${u.username}) meminta reset password.\`;
        const type = 'warning';
        await pool.query(
          'INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())',
          [1, title, message, type]
        );
      }
      return res.json({ status: 'success' });
    } catch (err: any) {
      console.error(err);
      return res.json({ status: 'error', message: err.message });
    }
  });

  app.get('/api/sync',`;

code = code.replace("  app.get('/api/sync',", resetEndpoint);
fs.writeFileSync('server.ts', code);
console.log("Patched server.ts with request_reset");
