const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const annRegex = /app\.get\(\['\/api\/announcements', '\/api\/announcements\.php'\], async \(req, res\) => \{[\s\S]*?\}\);/m;
const newAnn = `app.get(['/api/announcements', '/api/announcements.php'], async (req, res) => {
    if (!pool) {
      return res.json([
        { id: 1, title: 'Selamat Datang', content: 'Selamat datang di Siakad. Harap perbarui data profil Anda.', target_audience: 'semua', created_at: new Date().toISOString() }
      ]);
    }
    try {
      const [rows] = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
      res.json(rows);
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });`;
content = content.replace(annRegex, newAnn);

const statsRegex = /app\.get\(\['\/api\/stats', '\/api\/stats\.php'\], async \(req, res\) => \{[\s\S]*?\}\);/m;
const newStats = `app.get(['/api/stats', '/api/stats.php'], async (req, res) => {
    if (!pool) {
      return res.json({
        totalUsers: 15,
        totalStudents: 120,
        activeClasses: 6,
        attendanceRate: 98,
        users: 15, students: 120, classes: 6
      });
    }
    try {
      // Mock stats for now if DB connected
      res.json({
        users: 150, students: 450, classes: 12
      });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });`;
content = content.replace(statsRegex, newStats);

fs.writeFileSync('server.ts', content);
