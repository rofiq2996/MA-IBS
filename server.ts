import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { createProxyMiddleware } from 'http-proxy-middleware';

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

async function testPoolAndInit() {
  if (pool) {
    try {
      await pool.query('SELECT 1');
      console.log('Database connected successfully.');
      await ensureDatabaseColumns();
    } catch (e) {
      console.error('Database connection failed, falling back to mock mode:', e.message);
      pool = undefined;
    }
  }
}



async function ensureDatabaseColumns() {
  if (pool) {
    try {
      // Check if column nuptk exists in users
      const [columnsNuptk]: any = await pool.query("SHOW COLUMNS FROM users LIKE 'nuptk'");
      if (columnsNuptk.length === 0) {
        console.log("Adding 'nuptk' column to 'users' table...");
        await pool.query("ALTER TABLE users ADD COLUMN nuptk VARCHAR(50) DEFAULT NULL");
        console.log("'nuptk' column added successfully.");
      }

      // Check if column roles exists in users
      const [columnsRoles]: any = await pool.query("SHOW COLUMNS FROM users LIKE 'roles'");
      if (columnsRoles.length === 0) {
        console.log("Adding 'roles' column to 'users' table...");
        await pool.query("ALTER TABLE users ADD COLUMN roles JSON DEFAULT NULL");
        console.log("'roles' column added successfully.");
      }
    } catch (err) {
      console.error("Failed to ensure database columns exist:", err);
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ensure database columns on start
  await testPoolAndInit();

  // API Routes

  const allowedTables = [
    'academic_history', 'academic_terms', 'agenda', 'announcements', 'bk_cases',
    'cbt_exams', 'cbt_questions', 'cbt_submissions', 'classes', 'grades',
    'kinerja_staf', 'leave_requests', 'materi_ajar', 'materi_objectives',
    'notifications', 'sarpras', 'schedules', 'student_attendance', 'students',
    'subjects', 'teacher_attendance', 'teaching_assignments', 'users'
  ];

  

  // PROXY to mmmaibs.com in development to bypass CORS
  if (process.env.USE_REMOTE_API === 'true' && false) {
    app.use('/api', createProxyMiddleware({
      target: 'https://mmmaibs.com',
      changeOrigin: true,
      secure: false,
    }));
  } else {

  
  // Key-value store endpoint
  app.all('/api/keyval.php', async (req, res) => {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS key_value_store (
        k varchar(255) NOT NULL,
        v longtext NOT NULL,
        PRIMARY KEY (k)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      
      const method = req.method;
      if (method === 'GET') {
        const key = req.query.key;
        if (key) {
          const [rows] = await pool.query('SELECT v FROM key_value_store WHERE k = ?', [key]) as any;
          res.json({ value: rows.length ? rows[0].v : null });
        } else {
          const [rows] = await pool.query('SELECT * FROM key_value_store') as any;
          const obj = {};
          rows.forEach(r => { obj[r.k] = r.v; });
          res.json(obj);
        }
      } else if (method === 'POST') {
        const { key, value } = req.body;
        if (!key || value === undefined) return res.status(400).json({ error: 'Missing key or value' });
        await pool.query('INSERT INTO key_value_store (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', [key, value]);
        res.json({ status: 'success' });
      } else if (method === 'DELETE') {
        const key = req.query.key;
        if (key) {
          await pool.query('DELETE FROM key_value_store WHERE k = ?', [key]);
        } else {
          await pool.query('TRUNCATE TABLE key_value_store');
        }
        res.json({ status: 'success' });
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

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
      
      // Fallback check: find user in dbFallback['users'] matching username OR nuptk (case insensitive)
      const usersList = dbFallback['users'] || [];
      const foundUser = usersList.find((u: any) => 
        (u.username && u.username.toLowerCase() === username.toLowerCase()) || 
        (u.nuptk && u.nuptk.toLowerCase() === username.toLowerCase())
      );
      
      if (foundUser) {
        let isPasswordCorrect = false;
        try {
          if (foundUser.password && (foundUser.password.startsWith('$2a$') || foundUser.password.startsWith('$2b$'))) {
            isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);
          } else {
            isPasswordCorrect = (foundUser.password === password);
          }
        } catch (e) {
          isPasswordCorrect = (foundUser.password === password);
        }
        
        if (isPasswordCorrect) {
          return res.json({ status: 'success', user: foundUser });
        }
      }
      return res.json({ status: 'error', message: 'Username / NIPTK atau password salah' });
    }
    
    try {
      // Query both username and nuptk columns
      const [users] = await pool.query('SELECT * FROM users WHERE username = ? OR nuptk = ?', [username, username]);
      const userList = users as any[];
      if (userList.length > 0) {
         const dbUser = userList[0];
         let isPasswordCorrect = false;
         try {
           if (dbUser.password && (dbUser.password.startsWith('$2a$') || dbUser.password.startsWith('$2b$'))) {
             isPasswordCorrect = bcrypt.compareSync(password, dbUser.password);
           } else {
             isPasswordCorrect = (dbUser.password === password);
           }
         } catch (bcryptErr) {
           isPasswordCorrect = (dbUser.password === password);
         }
         
         if (isPasswordCorrect) {
            return res.json({ status: 'success', user: dbUser });
         }
      }
      return res.json({ status: 'error', message: 'Username / NIPTK atau password salah' });
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
      // Fallback to mock data on connection failure
      return res.json({
        users: dbFallback['users'] || [],
        students: dbFallback['students'] || [],
        classes: dbFallback['classes'] || [],
        subjects: dbFallback['subjects'] || []
      });
    }
  });


  // Example API to get dashboard stats
  
  app.get(['/api/get_materi', '/api/get_materi.php'], async (req, res) => {
    if (!pool) return res.json({ status: 'success', data: [] });
    try {
      const db = await pool.getConnection();
      try {
        const [rows]: any = await db.query(`
          SELECT m.*, u.name, u.role, m.class_name as class
          FROM materi_ajar m 
          LEFT JOIN users u ON m.user_id = u.id 
          ORDER BY m.created_at DESC
        `);
        
        for (let row of rows) {
          const [objs]: any = await db.query('SELECT objective FROM materi_objectives WHERE materi_id = ?', [row.id]);
          row.objectives = objs.map((o: any) => o.objective);
        }
        
        res.json({ status: 'success', data: rows });
      } finally {
        db.release();
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post(['/api/save_materi', '/api/save_materi.php'], async (req, res) => {
    if (!pool) return res.json({ status: 'success', id: 1 });
    try {
      const db = await pool.getConnection();
      try {
        const { id, user_id, subject, class_name, title, description, file_name, status, date, objectives } = req.body;
        
        await db.beginTransaction();
        let materiId = id;
        
        if (id) {
          await db.query(`
            UPDATE materi_ajar SET 
              subject = ?, class_name = ?, title = ?, description = ?, 
              file_name = ?, status = ?, date = ?
            WHERE id = ?
          `, [subject, class_name, title, description, file_name, status, date, id]);
          
          await db.query('DELETE FROM materi_objectives WHERE materi_id = ?', [id]);
        } else {
          const [result]: any = await db.query(`
            INSERT INTO materi_ajar (user_id, subject, class_name, title, description, file_name, status, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [user_id, subject, class_name, title, description, file_name, status, date]);
          materiId = result.insertId;
        }
        
        if (objectives && objectives.length > 0) {
          for (const obj of objectives) {
            await db.query('INSERT INTO materi_objectives (materi_id, objective) VALUES (?, ?)', [materiId, obj]);
          }
        }
        
        await db.commit();
        res.json({ status: 'success', id: materiId });
      } catch (err) {
        await db.rollback();
        throw err;
      } finally {
        db.release();
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post(['/api/delete_materi', '/api/delete_materi.php'], async (req, res) => {
    if (!pool) return res.json({ status: 'success' });
    try {
      const { id } = req.body;
      const db = await pool.getConnection();
      try {
        await db.beginTransaction();
        await db.query('DELETE FROM materi_objectives WHERE materi_id = ?', [id]);
        await db.query('DELETE FROM materi_ajar WHERE id = ?', [id]);
        await db.commit();
        res.json({ status: 'success' });
      } catch (err) {
        await db.rollback();
        throw err;
      } finally {
        db.release();
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

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
  }
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
