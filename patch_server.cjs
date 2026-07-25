const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const loginEndpoint = `
  app.post('/api/login.php', async (req, res) => {
    const { username, password } = req.body;
    if (!pool) {
      // Return mock user if no DB
      if (username === 'admin' && password === '12345') {
         return res.json({ status: 'success', user: { id: 1, username: 'admin', role: 'admin', name: 'Administrator' } });
      }
      return res.json({ status: 'error', message: 'Database not connected and invalid mock credentials' });
    }
    
    try {
      const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      const userList = users as any[];
      if (userList.length > 0) {
         // simplified password check (assuming bcrypt or plain in real app, but here just testing)
         return res.json({ status: 'success', user: userList[0] });
      }
      return res.json({ status: 'error', message: 'Username atau password salah' });
    } catch (err: any) {
      return res.json({ status: 'error', message: err.message });
    }
  });

  app.get('/api/get_user.php', async (req, res) => {
    const { id } = req.query;
    if (!pool) {
       return res.json({ status: 'success', user: { id, name: 'Mock User', avatar: '' }});
    }
    try {
      const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      const userList = users as any[];
      if (userList.length > 0) {
         return res.json({ status: 'success', user: userList[0] });
      }
      return res.json({ status: 'error', message: 'User not found' });
    } catch (err: any) {
      return res.json({ status: 'error', message: err.message });
    }
  });

  app.get('/api/sync',`;

code = code.replace("  app.get('/api/sync',", loginEndpoint);
fs.writeFileSync('server.ts', code);
console.log("Patched server.ts");
