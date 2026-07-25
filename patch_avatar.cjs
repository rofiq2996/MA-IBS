const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const avatarEndpoint = `
  app.post('/api/update_avatar.php', async (req, res) => {
    const { user_id, avatar_base64 } = req.body;
    if (!pool) {
       return res.json({ status: 'success', avatar_url: avatar_base64 });
    }
    try {
      await pool.query('UPDATE users SET avatar = ? WHERE id = ?', [avatar_base64, user_id]);
      return res.json({ status: 'success', avatar_url: avatar_base64 });
    } catch (err: any) {
      return res.json({ status: 'error', message: err.message });
    }
  });

  app.get('/api/sync',`;

code = code.replace("  app.get('/api/sync',", avatarEndpoint);
fs.writeFileSync('server.ts', code);
console.log("Patched avatar");
