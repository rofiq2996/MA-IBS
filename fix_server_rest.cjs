const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const badSync = `    }
    try {
      const [users] = await pool.query('SELECT * FROM users');
      const [students] = await pool.query('SELECT * FROM students');
      const [classes] = await pool.query('SELECT * FROM classes');
      const [subjects] = await pool.query('SELECT * FROM subjects');
      res.json({ users, students, classes, subjects });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Failed to sync data' });
    }
  });`;

content = content.replace(badSync, '');

const badStats = `    }
    
    try {
      // You can replace these with actual queries from your Hostinger database
      // const [users] = await pool.query('SELECT COUNT(*) as total FROM users');
      // const [students] = await pool.query('SELECT COUNT(*) as total FROM students');
      // const [classes] = await pool.query('SELECT COUNT(*) as total FROM classes');
      
      // Mock stats for now if DB connected
      res.json({
        users: 150, students: 450, classes: 12
      });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });`;
content = content.replace(badStats, '');

fs.writeFileSync('server.ts', content);
