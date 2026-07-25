const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const notifPhpHandler = `
  app.all('/api/notifications.php', (req, res, next) => {
    const userId = req.query.user_id;
    if (userId) {
      req.url = \`/api/notifications/\${userId}\`;
    }
    next();
  });

  app.all('/api/notifications_read.php', (req, res, next) => {
    const id = req.query.id;
    if (id) {
      req.url = \`/api/notifications/\${id}/read\`;
    }
    next();
  });
`;

if (!content.includes('/api/notifications.php')) {
  content = content.replace("app.get('/api/notifications/:user_id'", notifPhpHandler + "\n  app.get('/api/notifications/:user_id'");
}

fs.writeFileSync('server.ts', content);
