const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  "  if (process.env.USE_REMOTE_API === 'true' || true) {",
  "  if (process.env.USE_REMOTE_API === 'true' && false) {"
);
code = code.replace(
  "      res.status(500).json({ error: 'Failed to sync data' });\n    }",
  "      // Fallback to mock data on connection failure\n      return res.json({\n        users: dbFallback['users'] || [],\n        students: dbFallback['students'] || [],\n        classes: dbFallback['classes'] || [],\n        subjects: dbFallback['subjects'] || []\n      });\n    }"
);
fs.writeFileSync('server.ts', code);
