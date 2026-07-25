const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /\}\s+catch\s+\(error\)\s*\{\s*console\.error\('Database query error:', error\);\s*res\.status\(500\)\.json\(\{ error: 'Failed to sync data' \}\);\s*\}\s*\}\);\s*\}\s*try\s*\{\s*const\s*\[users\]\s*=\s*await\s*pool\.query\('SELECT \* FROM users'\);\s*const\s*\[students\]\s*=\s*await\s*pool\.query\('SELECT \* FROM students'\);\s*const\s*\[classes\]\s*=\s*await\s*pool\.query\('SELECT \* FROM classes'\);\s*res\.json\(\{ users, students, classes \}\);\s*\}\s*catch\s*\(error\)\s*\{\s*console\.error\('Database query error:', error\);\s*res\.status\(500\)\.json\(\{ error: 'Failed to sync data' \}\);\s*\}\s*\}\);/g;

content = content.replace(regex, `} catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Failed to sync data' });
    }
  });`);

fs.writeFileSync('server.ts', content);
