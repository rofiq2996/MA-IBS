const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const badStats = `    }
    
    try {
      // You can replace these with actual queries from your Hostinger database
      // const [users] = await pool.query('SELECT COUNT(*) as total FROM users');
      res.json({
        totalUsers: 150,
        activeClasses: 24,
        totalTeachers: 45
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });`;
content = content.replace(badStats, '');

fs.writeFileSync('server.ts', content);
