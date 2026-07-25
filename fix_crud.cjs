const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Insert the crud.php handler before the first /api/crud route
const crudPhpHandler = `
  app.all('/api/crud.php', (req, res, next) => {
    const table = req.query.table;
    const id = req.query.id;
    if (!table) return res.status(400).json({ error: 'Missing table param' });
    
    // Rewrite the url to match the existing Express routes
    if (id) {
      req.url = \`/api/crud/\${table}/\${id}\`;
    } else {
      req.url = \`/api/crud/\${table}\`;
    }
    next();
  });
`;

if (!content.includes('/api/crud.php')) {
  content = content.replace("app.get('/api/crud/:table'", crudPhpHandler + "\n  app.get('/api/crud/:table'");
}

fs.writeFileSync('server.ts', content);
