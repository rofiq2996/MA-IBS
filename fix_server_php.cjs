const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/app\.get\('\/api\/announcements'/g, "app.get(['/api/announcements', '/api/announcements.php']");
content = content.replace(/app\.post\('\/api\/request_reset'/g, "app.post(['/api/request_reset', '/api/request_reset.php']");
content = content.replace(/app\.get\('\/api\/sarpras'/g, "app.get(['/api/sarpras', '/api/sarpras.php']");
content = content.replace(/app\.get\('\/api\/stats'/g, "app.get(['/api/stats', '/api/stats.php']");

fs.writeFileSync('server.ts', content);
