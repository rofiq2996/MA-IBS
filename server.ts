import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Initialize database connection pool
let host = process.env.DB_HOST || 'localhost';
let port = parseInt(process.env.DB_PORT || '3306');

if (host.includes(':')) {
  const parts = host.split(':');
  host = parts[0];
  if (parts[1]) {
    const parsedPort = parseInt(parts[1], 10);
    if (!isNaN(parsedPort)) {
      port = parsedPort;
    }
  }
}

const dbConfig = {
  host,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  port
};

let pool: mysql.Pool;

try {
  if (process.env.DB_HOST) {
    pool = mysql.createPool(dbConfig);
    console.log('Database pool initialized with host:', process.env.DB_HOST);
  } else {
    console.log('No DB_HOST provided, skipping database initialization.');
  }
} catch (error) {
  console.error('Failed to initialize database pool:', error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes

  const allowedTables = [
    'academic_history', 'academic_terms', 'agenda', 'announcements', 'bk_cases',
    'cbt_exams', 'cbt_questions', 'cbt_submissions', 'classes', 'grades',
    'kinerja_staf', 'leave_requests', 'materi_ajar', 'materi_objectives',
    'notifications', 'sarpras', 'schedules', 'student_attendance', 'students',
    'subjects', 'teacher_attendance', 'teaching_assignments', 'users'
  ];

  
  app.all('/api/crud.php', (req, res, next) => {
    const table = req.query.table;
    const id = req.query.id;
    if (!table) return res.status(400).json({ error: 'Missing table param' });
    
    // Rewrite the url to match the existing Express routes
    if (id) {
      req.url = `/api/crud/${table}/${id}`;
    } else {
      req.url = `/api/crud/${table}`;
    }
    next();
  });

  
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
      const [rows] = await pool.query(`SELECT * FROM ${table}`);
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
      const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
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
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
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
      const sql = `DELETE FROM ${table} WHERE id = ?`;
      const [result]: any = await pool.query(sql, [id]);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  
  // Example API to get announcements from the database
  app.get(['/api/announcements', '/api/announcements.php'], async (req, res) => {
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
  });



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


  app.post(['/api/request_reset', '/api/request_reset.php'], async (req, res) => {
    const { username } = req.body;
    if (!pool) return res.json({ status: 'success' });
    
    try {
      const [users] = await pool.query('SELECT * FROM users WHERE username = ? OR id = ?', [username, username]);
      const userList = users as any[];
      if (userList.length > 0) {
        const u = userList[0];
        const title = 'Permintaan Reset Password';
        const message = `Pengguna ${u.name} (${u.username}) meminta reset password.`;
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


  
  app.all('/api/notifications.php', (req, res, next) => {
    const userId = req.query.user_id;
    if (userId) {
      req.url = `/api/notifications/${userId}`;
    }
    next();
  });

  app.all('/api/notifications_read.php', (req, res, next) => {
    const id = req.query.id;
    if (id) {
      req.url = `/api/notifications/${id}/read`;
    }
    next();
  });

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

  app.get('/api/sync.php', async (req, res) => {
    if (!pool) {
      return res.json({
        users: dbFallback['users'] || [],
        students: dbFallback['students'] || [],
        classes: dbFallback['classes'] || [],
        subjects: dbFallback['subjects'] || []
      });
    }
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
  });


  // Example API to get dashboard stats
  app.get(['/api/sarpras', '/api/sarpras.php'], async (req, res) => {
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
  });

  app.get(['/api/stats', '/api/stats.php'], async (req, res) => {
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
  });



  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
