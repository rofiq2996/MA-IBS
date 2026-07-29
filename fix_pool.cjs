const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "async function ensureDatabaseColumns() {",
  "async function testPoolAndInit() {\n  if (pool) {\n    try {\n      await pool.query('SELECT 1');\n      console.log('Database connected successfully.');\n      await ensureDatabaseColumns();\n    } catch (e) {\n      console.error('Database connection failed, falling back to mock mode:', e.message);\n      pool = undefined;\n    }\n  }\n}\n\ntestPoolAndInit();\n\nasync function ensureDatabaseColumns() {"
);

// Remove the ensureDatabaseColumns() call at the bottom if any
code = code.replace("ensureDatabaseColumns();\nstartServer();", "startServer();");

fs.writeFileSync('server.ts', code);
