const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const materiEndpoints = `
  app.get(['/api/get_materi', '/api/get_materi.php'], async (req, res) => {
    try {
      const db = await pool.connect();
      try {
        const result = await db.query(\`
          SELECT m.*, u.name, u.role, m.class_name as class
          FROM materi_ajar m 
          LEFT JOIN users u ON m.user_id = u.id 
          ORDER BY m.created_at DESC
        \`);
        const rows = result.rows;
        
        for (let row of rows) {
          const objResult = await db.query('SELECT objective FROM materi_objectives WHERE materi_id = $1', [row.id]);
          row.objectives = objResult.rows.map(o => o.objective);
        }
        
        res.json({ status: 'success', data: rows });
      } finally {
        db.release();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post(['/api/save_materi', '/api/save_materi.php'], async (req, res) => {
    try {
      const db = await pool.connect();
      try {
        const { id, user_id, subject, class_name, title, description, file_name, status, date, objectives } = req.body;
        
        await db.query('BEGIN');
        let materiId = id;
        
        if (id) {
          await db.query(\`
            UPDATE materi_ajar SET 
              subject = $1, class_name = $2, title = $3, description = $4, 
              file_name = $5, status = $6, date = $7
            WHERE id = $8
          \`, [subject, class_name, title, description, file_name, status, date, id]);
          
          await db.query('DELETE FROM materi_objectives WHERE materi_id = $1', [id]);
        } else {
          const result = await db.query(\`
            INSERT INTO materi_ajar (user_id, subject, class_name, title, description, file_name, status, date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
          \`, [user_id, subject, class_name, title, description, file_name, status, date]);
          materiId = result.rows[0].id;
        }
        
        if (objectives && objectives.length > 0) {
          for (const obj of objectives) {
            await db.query('INSERT INTO materi_objectives (materi_id, objective) VALUES ($1, $2)', [materiId, obj]);
          }
        }
        
        await db.query('COMMIT');
        res.json({ status: 'success', id: materiId });
      } catch (err) {
        await db.query('ROLLBACK');
        throw err;
      } finally {
        db.release();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post(['/api/delete_materi', '/api/delete_materi.php'], async (req, res) => {
    try {
      const { id } = req.body;
      const db = await pool.connect();
      try {
        await db.query('BEGIN');
        await db.query('DELETE FROM materi_objectives WHERE materi_id = $1', [id]);
        await db.query('DELETE FROM materi_ajar WHERE id = $1', [id]);
        await db.query('COMMIT');
        res.json({ status: 'success' });
      } catch (err) {
        await db.query('ROLLBACK');
        throw err;
      } finally {
        db.release();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
`;

code = code.replace("app.get(['/api/sarpras', '/api/sarpras.php']", materiEndpoints + "\n  app.get(['/api/sarpras', '/api/sarpras.php']");

fs.writeFileSync('server.ts', code);
